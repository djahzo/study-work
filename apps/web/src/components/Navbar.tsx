import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { Button } from "@repo/ui/button"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"
import { signOut } from "@/lib/actions"

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initials = user?.user_metadata?.name
    ? (user.user_metadata.name as string).slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? null

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="max-w-4xl mx-auto px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">Day2</Link>
          <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            文章
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              控制台
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm hidden sm:block">
                {user.user_metadata?.name ?? user.email}
              </span>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">退出</Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
