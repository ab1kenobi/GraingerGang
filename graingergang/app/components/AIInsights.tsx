"use client"

import { Button } from "components/ui/button"
import { Card, CardContent } from "components/ui/card"
import { useState } from "react"
import { Product } from "../data/mockProducts"

type Props = {
  budget: number
  cart: Product[]
}

export default function AIInsights({ budget, cart }: Props) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)

  const optimize = async () => {
    setLoading(true)

    // 🔥 Replace this with real API later
    setTimeout(() => {
      setInsight(`
• Swap Industrial Cordless Drill → Compact Drill
  Saves $79, durability −1

• Remove redundant glove pack
  Saves $49
      `)
      setLoading(false)
    }, 1200)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">AI Recommendations</h3>

        {!insight && (
          <p className="text-sm text-muted-foreground mb-3">
            Optimize your build to save money or improve durability.
          </p>
        )}

        {insight && (
          <pre className="whitespace-pre-wrap text-sm mb-3">{insight}</pre>
        )}

        <Button onClick={optimize} disabled={loading}>
          {loading ? "Optimizing..." : "Optimize My Build"}
        </Button>
      </CardContent>
    </Card>
  )
}
