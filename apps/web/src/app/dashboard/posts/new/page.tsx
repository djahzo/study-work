import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { PostForm } from "@/components/PostForm"
import { createPost } from "@/lib/actions"

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">写文章</h1>
        <PostForm action={createPost} />
      </div>
    </main>
  )
}
