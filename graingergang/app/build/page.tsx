"use client"

import { useRouter } from 'next/navigation'

export default function BuildPage() {
  const router = useRouter()

  const projectName = "Warehouse Setup"
  const budget = 5000
  const estimatedCost = 4200
  const items = 6

  const overBudget = estimatedCost > budget
  const difference = Math.abs(budget - estimatedCost)
  const percentUsed = Math.min((estimatedCost / budget) * 100, 100)

  const handleGeneratePurchaseList = () => {
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex gap-8 text-lg">
            <span>project: {projectName}</span>
            <span>budget: ${budget.toLocaleString()}</span>
          </div>

          <span className="text-lg font-semibold">
            cart: {items}
          </span>
        </div>

        <div className="bg-white p-8 rounded">
          <h2 className="text-xl mb-6 font-semibold">
            AI Results Summary
          </h2>

          <div className="space-y-4">

            <p>Generated 6 Recommended Tools</p>

            <p className={overBudget ? "text-red-600 font-semibold" : ""}>
              Estimated Cost: ${estimatedCost.toLocaleString()}
            </p>

            <p
              className={
                overBudget
                  ? "text-red-600 font-semibold"
                  : "text-white font-semibold"
              }
            >
              {overBudget
                ? `Over Budget By: $${difference.toLocaleString()}`
                : `Under Budget By: $${difference.toLocaleString()}`
              }
            </p>

            <div className="w-full bg-gray-300/30 h-4 rounded overflow-hidden">
              <div
                className={`h-4 ${
                  overBudget
                    ? "bg-red-500"
                    : "bg-white/95 shadow-md"
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <p className="text-sm text-gray-400">
              {percentUsed.toFixed(0)}% of budget used
            </p>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">

          <div className="bg-white p-6 rounded">
            <h3 className="text-lg mb-4 font-semibold">
              AI Suggestions
            </h3>

            <div className="space-y-3">
              {[1,2,3,4].map((item) => (
                <div 
                  key={item}
                  className="flex justify-between items-center bg-[#d0d0d0] p-4 rounded"
                >
                  <div>
                    <p className="font-medium">
                      Industrial Drill
                    </p>
                    <p className="text-sm text-gray-600">
                      Recommended for heavy-duty warehouse mounting
                    </p>
                  </div>

                  <span className="font-semibold">
                    $120
                  </span>

                  <button className="bg-white border px-3 py-1 rounded hover:bg-gray-200 transition">
                    swap
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded">
            <h3 className="text-lg mb-4 font-semibold">
              Product Browser
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((item) => (
                <div 
                  key={item}
                  className="bg-[#d0d0d0] h-24 rounded hover:bg-[#bdbdbd] cursor-pointer transition"
                />
              ))}
            </div>
          </div>

        </div>

        <div className="bg-white p-8 flex justify-between items-center rounded">
          <div className="space-y-1">
            <p>items: {items}</p>
            <p className="font-semibold">
              total: ${estimatedCost.toLocaleString()}
            </p>
          </div>

          <button 
            onClick={handleGeneratePurchaseList}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Generate Purchase List
          </button>
        </div>

      </div>
    </div>
  )
}
