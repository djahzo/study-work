import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import { Navbar } from "./components/Navbar"
import { AuthDialog } from "./components/AuthDialog"
import { PostList } from "./components/PostList"
import { PostForm } from "./components/PostForm"
import { MyPostsPanel } from "./components/MyPostsPanel"
import { useAuthStore } from "./store/auth"
import { supabase } from "./lib/supabase"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { Separator } from "@repo/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/dialog"
import { PenLine } from "lucide-react"

type Tab = "feed" | "my-posts"

function App() {
  const [dark, setDark] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("feed")
  const { init, user } = useAuthStore()

  useEffect(() => { init(supabase) }, [init])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />

      <Navbar
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        onShowAuth={() => setAuthOpen(true)}
      />

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Write post dialog */}
      <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>写文章</DialogTitle>
          </DialogHeader>
          <PostForm onSuccess={() => setWriteOpen(false)} />
        </DialogContent>
      </Dialog>

      <main className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        {/* Hero */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">Day2 Blog</h1>
            <Badge variant="secondary">Vite + React</Badge>
          </div>
          <p className="text-muted-foreground max-w-xl">
            基于 pnpm monorepo + Turborepo 构建的全栈博客平台。
          </p>
          {user && (
            <Button onClick={() => setWriteOpen(true)}>
              <PenLine className="mr-2 h-4 w-4" />
              写文章
            </Button>
          )}
        </section>

        <Separator />

        {/* Tabs */}
        {user && (
          <div className="flex gap-1 border-b">
            {(["feed", "my-posts"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "feed" ? "全部文章" : "我的文章"}
              </button>
            ))}
          </div>
        )}

        {tab === "feed" || !user ? <PostList /> : <MyPostsPanel />}
      </main>
    </div>
  )
}

export default App
