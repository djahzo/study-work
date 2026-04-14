import { useState } from "react"
import { useMyPosts, useDeletePost, useUpdatePost } from "../hooks/usePosts"
import { useAuthStore } from "../store/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { Skeleton } from "@repo/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/dialog"
import { PostForm } from "./PostForm"
import { formatDate } from "@repo/utils"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import type { Post } from "@repo/types"

export function MyPostsPanel() {
  const user = useAuthStore((s) => s.user)
  const { data: posts, isLoading } = useMyPosts(user?.id)
  const deletePost = useDeletePost()
  const updatePost = useUpdatePost()
  const [editing, setEditing] = useState<Post | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇文章吗？")) return
    try {
      await deletePost.mutateAsync(id)
      toast.success("已删除")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleTogglePublish(post: Post) {
    try {
      await updatePost.mutateAsync({ id: post.id, input: { published: !post.published } })
      toast.success(post.published ? "已改为草稿" : "已发布")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (!user) return null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>我的文章</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !posts?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">还没有文章</p>
          ) : (
            <ul className="divide-y">
              {posts.map((post) => (
                <li key={post.id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                  </div>
                  <Badge variant={post.published ? "default" : "secondary"} className="shrink-0">
                    {post.published ? "已发布" : "草稿"}
                  </Badge>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      title={post.published ? "改为草稿" : "发布"}
                      onClick={() => handleTogglePublish(post)}
                    >
                      {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => setEditing(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑文章</DialogTitle>
          </DialogHeader>
          {editing && (
            <PostForm post={editing} onSuccess={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
