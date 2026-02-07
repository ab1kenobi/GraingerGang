"use client"

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

interface CartItem {
  id: string
  item: string
  category: string
  price: number
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const [budget, setBudget] = useState<number>(5000)
  const [taxRate] = useState<number>(0.08)
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', item: 'Industrial Drill', category: 'Power Tools', price: 120.00, quantity: 1 },
    { id: '2', item: 'Welding Machine', category: 'Power Tools', price: 850.00, quantity: 1 },
    { id: '3', item: 'Safety Glasses', category: 'Safety', price: 15.99, quantity: 10 },
    { id: '4', item: 'Tool Cabinet', category: 'Storage', price: 450.00, quantity: 2 },
    { id: '5', item: 'Angle Grinder', category: 'Power Tools', price: 95.00, quantity: 2 },
    { id: '6', item: 'Work Bench', category: 'Furniture', price: 380.00, quantity: 2 },
    { id: '7', item: 'Pneumatic Nailer', category: 'Power Tools', price: 199.99, quantity: 1 },
    { id: '8', item: 'Circular Saw', category: 'Power Tools', price: 145.00, quantity: 1 },
    { id: '9', item: 'Safety Harness', category: 'Safety', price: 89.99, quantity: 5 },
  ])

  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * taxRate
    const total = subtotal + tax
    const remaining = budget - total
    
    return { subtotal, tax, total, remaining }
  }, [cartItems, budget, taxRate])

  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {}
    cartItems.forEach(item => {
      const cost = item.price * item.quantity
      breakdown[item.category] = (breakdown[item.category] || 0) + cost
    })
    return breakdown
  }, [cartItems])

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const optimizeCost = () => {
    const sorted = [...cartItems].sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    let newItems = [...sorted]
    let testTotal = calculations.total
    
    while (testTotal > budget && newItems.length > 0) {
      newItems.shift()
      const newSubtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
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
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50 transition"
          >
            back to browse
          </button>
          <button className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50 transition">
            save
          </button>
          <button 
            onClick={() => router.push('/grainger')}
            className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50 transition"
          >
            checkout
          </button>
          <button className="bg-white px-6 py-3 rounded shadow hover:bg-gray-50 transition ml-auto">
            analytics/visualization
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <div className="grid grid-cols-5 gap-4 mb-4 font-semibold text-sm">
              <div>item</div>
              <div>category</div>
              <div>price</div>
              <div>quantity</div>
              <div>remove</div>
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
                  <div className="truncate">{item.item}</div>
                  <div className="truncate">{item.category}</div>
                  <div>${item.price.toFixed(2)}</div>
                  <div>{item.quantity}</div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-center hover:bg-gray-200 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {isOverBudget && (
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                warning: over budget items highlighted in red
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">cost breakdown</h3>
            
            <div className="bg-gray-100 h-48 rounded mb-6 p-4">
              <div className="h-full flex items-end gap-2">
                {Object.entries(categoryBreakdown).map(([category, amount]) => {
                  const maxAmount = Math.max(...Object.values(categoryBreakdown))
                  const height = (amount / maxAmount) * 100
                  
                  return (
                    <div key={category} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs truncate w-full text-center">{category}</div>
                      <div className="text-xs font-semibold">${amount.toFixed(0)}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded space-y-2 mb-6">
              <div className="flex justify-between">
                <span>subtotal:</span>
                <span className="font-mono">${calculations.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>tax:</span>
                <span className="font-mono">${calculations.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>total:</span>
                <span className="font-mono">${calculations.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span>budget:</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="font-mono px-2 py-1 rounded border w-32 text-right"
                />
              </div>
              <div className="flex justify-between">
                <span>remaining:</span>
                <span className={`font-mono font-semibold ${calculations.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${calculations.remaining.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={optimizeCost}
                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                optimize cost
              </button>
              <button
                onClick={replaceWithCheaper}
                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                replace with cheaper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}