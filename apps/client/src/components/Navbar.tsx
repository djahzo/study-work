import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { useAuthStore } from "../store/auth"
import { Moon, Sun, LogOut, User } from "lucide-react"

interface NavbarProps {
  dark: boolean
  onToggleDark: () => void
  onShowAuth: () => void
}

export function Navbar({ dark, onToggleDark, onShowAuth }: NavbarProps) {
  const { user, signOut } = useAuthStore()

  const initials = user?.user_metadata?.name
    ? (user.user_metadata.name as string).slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="max-w-4xl mx-auto px-8 h-14 flex items-center justify-between">
        <span className="font-bold text-lg">Day2 App</span>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.user_metadata?.name ?? "用户"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  个人资料
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={onShowAuth}>登录 / 注册</Button>
          )}
        </div>
      </div>
    </header>
  )
}
