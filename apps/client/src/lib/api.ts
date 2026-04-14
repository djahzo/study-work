import { supabase } from "./supabase"
import type { Post, PostInput } from "@repo/types"

export const postKeys = {
  all: ["posts"] as const,
  list: (params?: { search?: string; page?: number }) =>
    [...postKeys.all, "list", params] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
  myPosts: (userId: string) => [...postKeys.all, "my", userId] as const,
}

export async function fetchPublishedPosts(search = "", page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (search) query = query.ilike("title", `%${search}%`)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)
  return { posts: (data as Post[]) ?? [], total: count ?? 0 }
}

export async function fetchMyPosts(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data as Post[]) ?? []
}

export async function fetchPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data as Post
}

export async function createPost(input: PostInput & { author_id: string }) {
  const { data, error } = await supabase
    .from("posts")
    .insert(input)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Post
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  const { data, error } = await supabase
    .from("posts")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Post
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function uploadCoverImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from("post-covers").upload(path, file)
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from("post-covers").getPublicUrl(path)
  return data.publicUrl
}
