"use client"

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useProject, CartItem } from "../context/ProjectContext"

export default function CartPage() {

  const router = useRouter()
  const { project, cartItems, setCartItems, saveCurrentProject } = useProject()

  const budget = project.budget || 0
  const taxRate = 0.08
  const [saved, setSaved] = useState(false)


  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * taxRate
    const total = subtotal + tax
    const remaining = budget - total
    return { subtotal, tax, total, remaining }
  }, [cartItems, budget, taxRate])


  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, qty: number) => {
    const newQty = Math.max(1, qty)
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ))
  }

  const handleSave = () => {
    saveCurrentProject()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }


  const isOverBudget = calculations.total > budget


  // Category breakdown for the summary
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    cartItems.forEach(item => {
      const cat = item.category || 'General'
      map[cat] = (map[cat] || 0) + item.price * item.quantity
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [cartItems])


  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 font-semibold">

          <button
            onClick={() => router.back()}
            className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50"
          >
            ← back
          </button>

          <div>
            {project.projectName || "Untitled Project"}
          </div>

          <div>
            budget: ${budget.toLocaleString()}
          </div>
        </div>


        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded shadow text-center">
            <p className="text-gray-500 text-lg mb-4">No items in your purchase list yet.</p>
            <button
              onClick={() => router.push('/build')}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              ← Go back to build
            </button>
          </div>
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Items Table */}
          <div className="bg-white p-6 rounded shadow">

            <div className="grid grid-cols-[2fr_1fr_1fr_80px_1fr_60px] gap-3 mb-4 font-semibold text-sm">
              <div>item</div>
              <div>category</div>
              <div>price</div>
              <div>quantity</div>
              <div>line total</div>
              <div>remove</div>
            </div>

            <div className="space-y-2">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className={`grid grid-cols-[2fr_1fr_1fr_80px_1fr_60px] gap-3 p-3 rounded items-center text-sm ${
                    item.price * item.quantity > budget * 0.3 && isOverBudget
                      ? 'bg-red-100 border border-red-300'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="truncate" title={item.item}>{item.item}</div>
                  <div className="text-gray-600 text-xs">{item.category}</div>
                  <div>${item.price.toFixed(2)}</div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                    />
                  </div>
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-white border border-gray-300 px-2 py-1 rounded hover:bg-red-50 hover:border-red-300 text-sm"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {isOverBudget && (
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                Warning: over budget items highlighted
              </div>
            )}

          </div>



          {/* Cost Panel */}
          <div className="bg-white p-6 rounded shadow">

            <h3 className="text-lg font-semibold mb-4">
              cost breakdown
            </h3>

            {/* Category Bars */}
            {categoryBreakdown.length > 0 && (
              <div className="mb-6">
                <div className="flex gap-2 h-8 rounded overflow-hidden mb-2">
                  {categoryBreakdown.map(([cat, amount]) => {
                    const pct = calculations.subtotal > 0 ? (amount / calculations.subtotal) * 100 : 0
                    const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400']
                    const colorIdx = categoryBreakdown.findIndex(([c]) => c === cat)
                    return (
                      <div
                        key={cat}
                        className={`${colors[colorIdx % colors.length]} rounded`}
                        style={{ width: `${pct}%` }}
                        title={`${cat}: $${amount.toFixed(2)}`}
                      />
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  {categoryBreakdown.map(([cat], idx) => {
                    const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400']
                    return (
                      <div key={cat} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${colors[idx % colors.length]}`} />
                        <span>{cat}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded space-y-2 mb-6">

              <div className="flex justify-between">
                <span>subtotal:</span>
                <span>${calculations.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>tax:</span>
                <span>${calculations.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>total:</span>
                <span>${calculations.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>remaining:</span>
                <span className={
                  calculations.remaining < 0
                    ? "text-red-600"
                    : "text-green-600"
                }>
                  ${calculations.remaining.toFixed(2)}
                </span>
              </div>

            </div>


            <div className="flex flex-col gap-3">
              <button
                onClick={handleSave}
                className={`w-full px-4 py-3 rounded font-semibold transition ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {saved ? '✓ Project Saved!' : 'Save Project'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                ← Back to Home
              </button>
            </div>

          </div>
        </div>

        )}
      </div>
    </div>
  )
}
