"use client"

import { useState } from "react"
import { mockProducts, Product } from "../data/mockProducts"
import ProductCard from "../components/ProductCard"
import BudgetBar from "../components/BudgetBar"
import Charts from "../components/Charts"
import AIInsights from "../components/AIInsights"
import { Slider } from "@/components/ui/slider"

export default function BuildPage() {
  const [budget, setBudget] = useState(2500)
  const [cart, setCart] = useState<Product[]>(mockProducts)

  const total = cart.reduce((sum, p) => sum + p.price, 0)

  const removeProduct = (id: string) => {
    setCart(cart.filter(p => p.id !== id))
  }

  return (
    <div className="p-6 pb-24">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-3">
          <h3 className="font-semibold mb-2">Project Budget</h3>
          <Slider
            defaultValue={[budget]}
            min={500}
            max={5000}
            step={100}
            onValueChange={(v) => setBudget(v[0])}
          />
          <p className="mt-2 font-bold">${budget}</p>
        </div>

        {/* CENTER */}
        <div className="col-span-6 space-y-4">
          {cart.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onRemove={removeProduct}
            />
          ))}

          <Charts cart={cart} />
        </div>

        {/* RIGHT */}
        <div className="col-span-3">
          <AIInsights budget={budget} cart={cart} />
        </div>
      </div>

      <BudgetBar budget={budget} total={total} />
    </div>
  )
}
