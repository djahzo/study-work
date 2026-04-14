// ---- User ----
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// ---- Post ----
export interface Post {
  id: string
  title: string
  content: string
  cover_url: string | null
  published: boolean
  author_id: string
  author?: User
  created_at: string
  updated_at: string
}

// ---- API Response ----
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ---- Auth ----
export interface AuthState {
  user: User | null
  loading: boolean
}

export * from "./schemas"
