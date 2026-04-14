-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Posts table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  cover_url text,
  published boolean default false not null,
  author_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute function update_updated_at();

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Row Level Security
alter table public.users enable row level security;
alter table public.posts enable row level security;

-- Users policies
create policy "Users can view all profiles"
  on public.users for select using (true);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Posts policies
create policy "Anyone can view published posts"
  on public.posts for select using (published = true);

create policy "Authors can view own posts"
  on public.posts for select using (auth.uid() = author_id);

create policy "Authors can create posts"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on public.posts for update using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on public.posts for delete using (auth.uid() = author_id);

-- Storage: post-covers bucket
insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do nothing;

create policy "Anyone can view cover images"
  on storage.objects for select
  using (bucket_id = 'post-covers');

create policy "Authenticated users can upload cover images"
  on storage.objects for insert
  with check (bucket_id = 'post-covers' and auth.role() = 'authenticated');

create policy "Users can update own cover images"
  on storage.objects for update
  using (bucket_id = 'post-covers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own cover images"
  on storage.objects for delete
  using (bucket_id = 'post-covers' and auth.uid()::text = (storage.foldername(name))[1]);
