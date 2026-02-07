"use client"

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useProject } from "../context/ProjectContext"

interface CartItem {
  id: string
  item: string
  category: string
  price: number
  quantity: number
}

export default function CartPage() {

  const router = useRouter()
  const { project } = useProject()

  const budget = project.budget || 0
  const [taxRate] = useState<number>(0.08)

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', item: 'Industrial Drill', category: 'Power Tools', price: 120.00, quantity: 1 },
    { id: '2', item: 'Welding Machine', category: 'Power Tools', price: 850.00, quantity: 1 },
    { id: '3', item: 'Safety Glasses', category: 'Safety', price: 15.99, quantity: 10 },
    { id: '4', item: 'Tool Cabinet', category: 'Storage', price: 450.00, quantity: 2 },
    { id: '5', item: 'Angle Grinder', category: 'Power Tools', price: 95.00, quantity: 2 },
    { id: '6', item: 'Work Bench', category: 'Furniture', price: 380.00, quantity: 2 },
  ])


  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * taxRate
    const total = subtotal + tax
    const remaining = budget - total
    return { subtotal, tax, total, remaining }
  }, [cartItems, budget, taxRate])


  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }


  const optimizeCost = () => {
    const sorted = [...cartItems].sort(
      (a, b) => (b.price * b.quantity) - (a.price * a.quantity)
    )

    let newItems = [...sorted]
    let testTotal = calculations.total

    while (testTotal > budget && newItems.length > 0) {
      newItems.shift()
      const newSubtotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      testTotal = newSubtotal * (1 + taxRate)
    }

    setCartItems(newItems)
  }


  const replaceWithCheaper = () => {
    const newItems = cartItems.map(item => ({
      ...item,
      quantity: Math.max(1, Math.floor(item.quantity * 0.7))
    }))
    setCartItems(newItems)
  }


  const isOverBudget = calculations.total > budget



  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 font-semibold">

          <button
            onClick={() => router.back()}
            className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50"
          >
            ← Back
          </button>

          <div>
            {project.projectName || "Untitled Project"}
          </div>

          <div>
            Project Budget: ${budget.toLocaleString()}
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Items */}
          <div className="bg-white p-6 rounded shadow">

            <div className="grid grid-cols-5 gap-4 mb-4 font-semibold text-sm">
              <div>Item</div>
              <div>Category</div>
              <div>Unit Price</div>
              <div>Qty</div>
              <div>Remove</div>
            </div>

            <div className="space-y-2">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className={`grid grid-cols-5 gap-4 p-3 rounded ${
                    item.price * item.quantity > budget * 0.3 && isOverBudget
                      ? 'bg-red-100 border border-red-300'
                      : 'bg-gray-100'
                  }`}
                >
                  <div>{item.item}</div>
                  <div>{item.category}</div>
                  <div>${item.price.toFixed(2)}</div>
                  <div>{item.quantity}</div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="hover:bg-gray-200 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {isOverBudget && (
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                Warning: Over-budget items highlighted
              </div>
            )}

          </div>



          {/* Cost Panel */}
          <div className="bg-white p-6 rounded shadow">

            <h3 className="text-lg font-semibold mb-4">
              Cost Breakdown
            </h3>

            <div className="bg-gray-100 p-4 rounded space-y-2 mb-6">

              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculations.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${calculations.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Cost:</span>
                <span>${calculations.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Remaining Budget:</span>
                <span className={
                  calculations.remaining < 0
                    ? "text-red-600"
                    : "text-green-600"
                }>
                  ${calculations.remaining.toFixed(2)}
                </span>
              </div>

            </div>


            <div className="flex gap-4">
              <button
                onClick={optimizeCost}
                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Optimize Cost
              </button>

              <button
                onClick={replaceWithCheaper}
                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Reduce Quantities
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
