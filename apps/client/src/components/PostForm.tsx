import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { postSchema, type PostInput, type PostFormInput, type Post } from "@repo/types"
import { useCreatePost, useUpdatePost } from "../hooks/usePosts"
import { useAuthStore } from "../store/auth"
import { toast } from "sonner"
import { uploadCoverImage } from "../lib/api"
import { useState } from "react"
import { ImagePlus } from "lucide-react"

interface PostFormProps {
  post?: Post
  onSuccess?: () => void
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const user = useAuthStore((s) => s.user)
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.cover_url ?? null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInput, unknown, PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? { title: post.title, content: post.content, cover_url: post.cover_url, published: post.published }
      : { published: false },
  })

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const url = await uploadCoverImage(file, user.id)
      setCoverPreview(url)
      setValue("cover_url", url)
      toast.success("封面上传成功")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: PostInput) {
    if (!user) return toast.error("请先登录")
    try {
      if (post) {
        await updatePost.mutateAsync({ id: post.id, input: data })
        toast.success("文章已更新")
      } else {
        await createPost.mutateAsync({ ...data, author_id: user.id })
        toast.success("文章已创建")
      }
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Cover image */}
      <div className="space-y-2">
        <Label>封面图片</Label>
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden relative">
          {coverPreview ? (
            <img src={coverPreview} alt="封面" className="object-cover w-full h-full" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">{uploading ? "上传中..." : "点击上传封面"}</span>
            </div>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} disabled={uploading} />
        </label>
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">标题</Label>
        <Input id="title" placeholder="文章标题" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">正文</Label>
        <Textarea id="content" placeholder="开始写作..." rows={10} {...register("content")} />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          className="h-4 w-4 rounded border-input"
          {...register("published")}
        />
        <Label htmlFor="published" className="cursor-pointer">立即发布</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting ? "保存中..." : post ? "保存修改" : "创建文章"}
        </Button>
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>取消</Button>
        )}
      </div>
    </form>
  )
}
