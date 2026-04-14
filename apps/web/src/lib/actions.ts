"use server"

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { loginSchema, registerSchema, postSchema } from "@repo/types"

export async function signIn(_prev: unknown, formData: FormData) {
  const raw = { email: formData.get("email"), password: formData.get("password") }
  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: error.message }

  redirect("/dashboard")
}

export async function signUp(_prev: unknown, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }
  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  })
  if (error) return { error: error.message }

  return { success: "注册成功！请查收验证邮件。" }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

// ---- Post Actions ----

export async function createPost(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "请先登录" }

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    cover_url: formData.get("cover_url") || undefined,
    published: formData.get("published") === "on",
  }
  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }

  const { error } = await supabase
    .from("posts")
    .insert({ ...parsed.data, author_id: user.id })

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  redirect("/dashboard")
}

export async function updatePost(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "请先登录" }

  const id = formData.get("id") as string
  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    cover_url: formData.get("cover_url") || undefined,
    published: formData.get("published") === "on",
  }
  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }

  const { error } = await supabase
    .from("posts")
    .update(parsed.data)
    .eq("id", id)
    .eq("author_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  revalidatePath(`/posts/${id}`)
  redirect("/dashboard")
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "请先登录" }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  return { success: true }
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "请先登录" }

  const { error } = await supabase
    .from("posts")
    .update({ published })
    .eq("id", id)
    .eq("author_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  return { success: true }
}
