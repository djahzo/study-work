import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, published, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const name = user.user_metadata?.name ?? user.email ?? "用户"
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">你好，{name}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">全部文章</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">已发布</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts?.filter(p => p.published).length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">草稿</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts?.filter(p => !p.published).length ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>我的文章</CardTitle>
          </CardHeader>
          <CardContent>
            {!posts || posts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">还没有文章，去写第一篇吧！</p>
            ) : (
              <ul className="divide-y">
                {posts.map((post) => (
                  <li key={post.id} className="py-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium truncate">{post.title}</span>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "已发布" : "草稿"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
