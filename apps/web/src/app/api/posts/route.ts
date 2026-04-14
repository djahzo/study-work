import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(id, name, email, avatar_url)")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, content, author_id, cover_url, published } = body

  if (!title || !content || !author_id) {
    return NextResponse.json(
      { data: null, error: "title, content, and author_id are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, author_id, cover_url: cover_url ?? null, published: published ?? false })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null }, { status: 201 })
}
