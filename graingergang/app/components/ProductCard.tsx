"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "../data/mockProducts"

type Props = {
  product: Product
  onRemove: (id: string) => void
}

export default function ProductCard({ product, onRemove }: Props) {
  return (
    <Card className="flex gap-4 p-4">
      <img
        src={product.image}
        alt={product.name}
        className="h-20 w-20 rounded object-cover"
      />

      <CardContent className="p-0 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="font-bold">${product.price}</span>
        </div>

        <div className="flex gap-2 mt-1">
          <Badge variant="secondary">{product.category}</Badge>
          <Badge>Durability {product.durability_score}/10</Badge>
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="destructive" onClick={() => onRemove(product.id)}>
            Remove
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={product.vendor_link} target="_blank">
              View on Grainger
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
