"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { useState } from "react"
import { Product } from "../data/mockProducts"

type RecommendedProduct = {
  id: number
  product: string
  price: number
  image_url: string
  grainger_url: string
  label?: string
  reasoning?: string
}

type Props = {
  budget: number
  cart: Product[]
}

export default function AIInsights({ budget, cart }: Props) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([])

  const optimize = async () => {
    if (!query.trim()) return
    setLoading(true)
    setInsight(null)
    setRecommended([])

    try {
      const response = await fetch('/backend/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: query,
          budget: budget || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setInsight(`Error: ${data.error || 'Failed to get recommendations'}`)
        return
      }

      setInsight(data.aiText || 'Here are the recommended products:')
      setRecommended(data.products || [])
    } catch (err) {
      setInsight('Failed to connect to the AI service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">AI Recommendations</h3>

        <p className="text-sm text-muted-foreground mb-3">
          Ask for a product recommendation (e.g. &quot;Find me a sink under $200&quot;)
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && optimize()}
          />
          <Button onClick={optimize} disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {insight && (
          <p className="text-sm mb-3 text-gray-700">{insight}</p>
        )}

        {recommended.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {recommended.map((product) => (
              <div key={product.id} className="border rounded-lg p-3 flex flex-col">
                <img
                  src={product.image_url}
                  alt={product.product}
                  className="w-full h-32 object-contain mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=No+Image';
                  }}
                />
                <p className="text-sm font-semibold line-clamp-2">{product.product}</p>
                {product.reasoning && (
                  <p className="text-xs text-gray-500 italic mt-1">{product.reasoning}</p>
                )}
                <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                <a
                  href={product.grainger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:underline mt-1"
                >
                  View on Grainger →
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
