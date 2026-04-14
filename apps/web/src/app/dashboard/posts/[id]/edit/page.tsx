import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { PostForm } from "@/components/PostForm"
import { updatePost } from "@/lib/actions"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .single()

  if (!post) notFound()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">编辑文章</h1>
        <PostForm post={post} action={updatePost} />
      </div>
    </main>
  )
}
