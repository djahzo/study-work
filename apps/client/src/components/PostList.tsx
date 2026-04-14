import { useState } from "react"
import { usePublishedPosts } from "../hooks/usePosts"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Badge } from "@repo/ui/badge"
import { Skeleton } from "@repo/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { formatRelativeTime, truncate, debounce } from "@repo/utils"
import { Search } from "lucide-react"

const PAGE_SIZE = 5

export function PostList() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  const debouncedSetSearch = debounce((v: string) => {
    setDebouncedSearch(v)
    setPage(1)
  }, 400)

  const { data, isLoading, isError } = usePublishedPosts(debouncedSearch, page)
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-destructive">
          加载失败，请稍后重试。
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="搜索文章..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            debouncedSetSearch(e.target.value)
          }}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data?.posts.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {debouncedSearch ? `没有找到"${debouncedSearch}"相关文章` : "暂无文章"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.posts.map((post) => {
            const initials = post.author?.name?.slice(0, 2).toUpperCase()
              ?? post.author?.email?.slice(0, 2).toUpperCase() ?? "?"
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">已发布</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.author?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span>{post.author?.name ?? post.author?.email}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{truncate(post.content, 180)}</p>
                  <Button variant="link" className="px-0 mt-2 h-auto text-sm">阅读全文 →</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline" size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline" size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}
