import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { LoginForm } from "@/components/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">登录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            还没有账号？{" "}
            <Link href="/register" className="text-primary underline underline-offset-2">
              注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
