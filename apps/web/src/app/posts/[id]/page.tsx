import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"
import { formatDate } from "@repo/utils"
import type { Post } from "@repo/types"

async function getPost(id: string): Promise<Post | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)")
    .eq("id", id)
    .eq("published", true)
    .single()

  if (error) return null
  return data as Post
}

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) notFound()

  const authorName = post.author?.name ?? post.author?.email ?? "匿名"
  const initials = authorName.slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" asChild>
          <Link href="/posts">← 返回列表</Link>
        </Button>

        <article className="space-y-6">
          {post.cover_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{authorName}</p>
                <p className="text-muted-foreground">{formatDate(post.created_at)}</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {post.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </main>
  )
}
