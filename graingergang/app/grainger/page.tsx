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

        <h1 className="text-3xl font-bold text-center tracking-wide">
          CHECKOUT SUMMARY
        </h1>

        <div className="bg-white p-8 rounded">
          <h2 className="text-xl font-semibold mb-6 tracking-wide">
            ORDER SUMMARY
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">

                <span className="w-28 font-medium tracking-wide">
                  ITEM ID #{item.id}
                </span>

                <div className="w-24 h-16 bg-gray-300 rounded"></div>

                <button className="flex-1 bg-gray-300 px-6 py-3 text-center font-medium tracking-wide">
                  VIEW ON GRAINGER
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded">
          <p className="text-lg font-semibold tracking-wide">
            TOTAL COST: ${total.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">

          <button className="w-96 bg-white px-6 py-4 border font-semibold tracking-wide hover:bg-gray-100 transition">
            OPEN IN GRAINGER
          </button>

          <button className="w-96 bg-white px-6 py-4 border font-semibold tracking-wide hover:bg-gray-100 transition">
            SAVE PROJECT
          </button>

          <button 
            onClick={() => router.push('/')}
            className="w-96 bg-white px-6 py-4 border font-semibold tracking-wide hover:bg-gray-100 transition"
          >
            START NEW PROJECT
          </button>

        </div>

        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 text-2xl font-semibold"
        >
          ←
        </button>

      </div>
    </div>
  )
}
