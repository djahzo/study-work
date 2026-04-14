import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchPublishedPosts, fetchMyPosts, fetchPost,
  createPost, updatePost, deletePost,
  postKeys,
} from "../lib/api"
import type { PostInput } from "@repo/types"

export function usePublishedPosts(search = "", page = 1) {
  return useQuery({
    queryKey: postKeys.list({ search, page }),
    queryFn: () => fetchPublishedPosts(search, page),
  })
}

export function useMyPosts(userId: string | undefined) {
  return useQuery({
    queryKey: postKeys.myPosts(userId ?? ""),
    queryFn: () => fetchMyPosts(userId!),
    enabled: !!userId,
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: PostInput & { author_id: string }) => createPost(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PostInput> }) =>
      updatePost(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: postKeys.all })
      qc.invalidateQueries({ queryKey: postKeys.detail(id) })
    },
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  })
}
