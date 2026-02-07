"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()

  const items = [
    { id: 1, name: 'Industrial Drill', price: 120.00 },
    { id: 2, name: 'Welding Machine', price: 850.00 },
    { id: 3, name: 'Safety Glasses', price: 15.99 },
    { id: 4, name: 'Tool Cabinet', price: 450.00 },
  ]

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <h1 className="text-3xl font-semibold text-center">checkout</h1>

        <div className="bg-white p-8 rounded">
          <h2 className="text-xl mb-6 font-semibold">items summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <span className="w-24">item #{item.id}</span>
                <div className="w-24 h-16 bg-gray-300"></div>
                <button className="flex-1 bg-gray-300 px-6 py-3 text-center">
                  view on granger
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded">
          <p className="text-lg">total: ${total.toFixed(2)}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button className="w-96 bg-white px-6 py-4 text-center border hover:bg-gray-100 transition">
            open in grainger
          </button>
          <button className="w-96 bg-white px-6 py-4 text-center border hover:bg-gray-100 transition">
            save project
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-96 bg-white px-6 py-4 text-center border hover:bg-gray-100 transition"
          >
            start new project
          </button>
        </div>

        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 text-2xl"
        >
          ←
        </button>

      </div>
    </div>
  )
}