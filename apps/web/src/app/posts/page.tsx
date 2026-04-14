import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import type { Post } from "@repo/types"
import { formatDate, truncate } from "@repo/utils"

async function getPosts(): Promise<Post[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) return []
  return data as Post[]
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">文章</h1>
          <Button asChild>
            <Link href="/dashboard/posts/new">写文章</Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              还没有文章，来写第一篇吧！
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {post.author?.name ?? post.author?.email} · {formatDate(post.created_at)}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{truncate(post.content, 200)}</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/posts/${post.id}`}>阅读全文</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
