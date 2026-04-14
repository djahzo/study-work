import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Next.js App</h1>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Day2 Monorepo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This is a full-stack monorepo built with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>pnpm workspace</li>
              <li>Turborepo</li>
              <li>Next.js 15</li>
              <li>shadcn/ui + Tailwind CSS</li>
              <li>Supabase</li>
            </ul>
            <div className="mt-6">
              <Button>Get Started</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
