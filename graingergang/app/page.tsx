import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        Build smarter. Buy better. Stay on budget.
      </h1>
      <p className="text-muted-foreground max-w-xl mb-6">
        Plan business projects with AI-recommended Grainger tools and real-time
        budget insights.
      </p>
      <Button asChild size="lg">
        <Link href="/build">Start a Project</Link>
      </Button>
    </main>
  )
}
