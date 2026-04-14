"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import type { Post } from "@repo/types"

interface PostFormProps {
  post?: Post
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : label}
    </Button>
  )
}

export function PostForm({ post, action }: PostFormProps) {
  const [state, formAction] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      {/* Cover URL (hidden — populated by upload elsewhere if needed) */}
      <input type="hidden" name="cover_url" value={post?.cover_url ?? ""} />

      <div className="space-y-1">
        <Label htmlFor="title">标题</Label>
        <Input
          id="title"
          name="title"
          placeholder="文章标题"
          defaultValue={post?.title}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">正文</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="开始写作..."
          rows={14}
          defaultValue={post?.content}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          className="h-4 w-4 rounded border-input"
          defaultChecked={post?.published}
        />
        <Label htmlFor="published" className="cursor-pointer">立即发布</Label>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-2">
        <SubmitButton label={post ? "保存修改" : "创建文章"} />
        <Button type="button" variant="outline" onClick={() => history.back()}>
          取消
        </Button>
      </div>
    </form>
  )
}
