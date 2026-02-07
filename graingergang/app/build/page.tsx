"use client"

import { useRouter } from 'next/navigation'
import { useProject } from "../context/ProjectContext"
import { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"

type Product = {
  id: number
  product: string
  price: number
  image_url: string
  grainger_url: string
  label?: string
  reasoning?: string  // AI reasoning for this recommendation
}

export default function BuildPage() {

  const router = useRouter()
  const { project } = useProject()

  const [products, setProducts] = useState<Product[]>([])
  const [aiSummary, setAiSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const budget = project.budget || 0


  useEffect(() => {

<<<<<<< Updated upstream
    if (!budget) {
=======
    // 🚨 Never fetch with no budget or project details
    if (!budget || !project.projectName) {
>>>>>>> Stashed changes
      setLoading(false)
      return
    }

    async function loadProducts() {
      try {
<<<<<<< Updated upstream
        const data = await getProducts({ price: budget })
        setProducts(data)
=======
        setError('') // Clear previous errors

        const requestBody = {
          description: project.description || project.projectName,
          budget: budget,
          category: project.category || undefined
        }

        console.log('🔍 Sending to AI route:', requestBody)

        // ⭐ Call the AI route instead of direct database query
        const response = await fetch('/backend/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        console.log('📡 Response status:', response.status)
        console.log('📡 Response ok?:', response.ok)
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

        // Try to get response text first
        const responseText = await response.text()
        console.log('📄 Raw response text:', responseText)

        if (!response.ok) {
          let errorData
          try {
            errorData = JSON.parse(responseText)
          } catch {
            errorData = { error: `HTTP ${response.status}: ${responseText || 'No error message'}` }
          }
          console.error('❌ API Error:', errorData)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = JSON.parse(responseText)
        console.log('✅ Received data:', data)
        
        setProducts(data.products || [])
        setAiSummary(data.aiText || 'AI recommendations generated')

>>>>>>> Stashed changes
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error("❌ Failed to fetch AI recommendations:", errorMessage)
        console.error("❌ Full error:", err)
        setError(`Error: ${errorMessage}`)
        setAiSummary('Failed to generate AI recommendations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

  }, [budget, project.projectName, project.description, project.category])


  const estimatedCost =
    products.reduce((sum, p) => sum + Number(p.price), 0)

  const items = products.length

  const overBudget = estimatedCost > budget
  const difference = Math.abs(budget - estimatedCost)

  const percentUsed =
    budget > 0
      ? Math.min((estimatedCost / budget) * 100, 100)
      : 0


  const handleGeneratePurchaseList = () => {
    router.push('/cart')
  }

  const handleBack = () => {
    router.push('/')
  }


  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto space-y-8">


        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">

          <div className="flex items-center gap-6">

            <button
              onClick={handleBack}
              className="bg-white/80 px-4 py-2 rounded hover:bg-white transition"
            >
              ← Back
            </button>

            <div className="flex gap-8 text-lg font-semibold">
              <span>
                Project: {project.projectName || "Untitled Project"}
              </span>

              <span>
                Budget: ${budget.toLocaleString()}
              </span>
            </div>
          </div>

          <span className="text-lg font-semibold">
            Cart: {items}
          </span>
        </div>



        {/* AI Summary */}
        <div className="bg-white p-8 rounded shadow-sm">

          <h2 className="text-xl mb-6 font-semibold">
            AI Results Summary
          </h2>

          {loading ? (

            <p className="animate-pulse">
              Generating Smart Recommendations...
            </p>

          ) : error ? (

            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <p className="text-red-600 font-semibold mb-2">
                Failed to load recommendations
              </p>
              <p className="text-sm text-red-500">
                {error}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Check the browser console for detailed error logs
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>

          ) : (

            <div className="space-y-4">

              {/* Display AI summary */}
              <p className="text-gray-700 mb-4">
                {aiSummary}
              </p>

              <p>
                Generated {items} Recommended Tools
              </p>

              <p className={overBudget ? "text-red-600 font-semibold" : ""}>
                Estimated Cost: ${estimatedCost.toLocaleString()}
              </p>

              <p
                className={
                  overBudget
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {overBudget
                  ? `Over Budget By: $${difference.toLocaleString()}`
                  : `Under Budget By: $${difference.toLocaleString()}`
                }
              </p>


              <div className="w-full bg-gray-300 h-4 rounded overflow-hidden">
                <div
                  className={`h-4 ${
                    overBudget ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              <p className="text-sm text-gray-600">
                {percentUsed.toFixed(0)}% of Budget Used
              </p>

            </div>

          )}

        </div>



        {/* Products */}
        <div className="bg-white p-6 rounded shadow-sm">

          <h3 className="text-lg mb-6 font-semibold">
            Recommended Products
          </h3>

          {loading ? (

            <p>Loading Products...</p>

          ) : error ? (

            <p className="text-gray-500">
              Unable to load products. Please check the error above.
            </p>

          ) : products.length === 0 ? (

            <p className="text-gray-500">
<<<<<<< Updated upstream
              No Products Found Within This Budget
=======
              No products found. Try adjusting your budget or project description.
>>>>>>> Stashed changes
            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

          )}

        </div>



        {/* Cart Bar */}
        <div className="bg-white p-8 flex justify-between items-center rounded shadow-sm">

          <div className="space-y-1">
            <p>
              Items: {items}
            </p>

            <p className="font-semibold">
              Total: ${estimatedCost.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleGeneratePurchaseList}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={products.length === 0}
          >
            Generate Purchase List
          </button>

        </div>

      </div>
    </div>
  )
}