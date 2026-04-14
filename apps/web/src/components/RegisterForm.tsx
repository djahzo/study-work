"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "注册中..." : "注册"}
    </Button>
  )
}

export function RegisterForm() {
  const [state, action] = useActionState(signUp, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
          {state.success}
        </p>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">姓名</Label>
        <Input id="name" name="name" placeholder="张三" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">密码</Label>
        <Input id="password" name="password" type="password" placeholder="••••••" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">确认密码</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••" required />
      </div>

      <SubmitButton />
    </form>
  )
}
