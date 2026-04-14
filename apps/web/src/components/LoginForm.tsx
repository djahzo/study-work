"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "登录中..." : "登录"}
    </Button>
  )
}

export function LoginForm() {
  const [state, action] = useActionState(signIn, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {state.error}
        </p>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">密码</Label>
        <Input id="password" name="password" type="password" placeholder="••••••" required />
      </div>

      <SubmitButton />
    </form>
  )
}
