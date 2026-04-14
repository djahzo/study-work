"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@repo/ui/button"
import { deletePost, togglePublish } from "@/lib/actions"

interface DashboardActionsProps {
  id: string
  published: boolean
}

export function DashboardActions({ id, published }: DashboardActionsProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("确定要删除这篇文章吗？")) return
    const result = await deletePost(id)
    if (result?.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  async function handleToggle() {
    const result = await togglePublish(id, !published)
    if (result?.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleToggle}>
        {published ? "撤回" : "发布"}
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/posts/${id}/edit`}>编辑</Link>
      </Button>
      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
        删除
      </Button>
    </div>
  )
}
