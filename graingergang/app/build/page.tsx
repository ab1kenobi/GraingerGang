"use client"

import { useRouter } from 'next/navigation'
import { useProject } from "../context/ProjectContext"
import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

type Product = {
  id: number
  product: string
  price: number
  image_url: string
  grainger_url: string
}

export default function BuildPage() {

  const router = useRouter()
  const { project } = useProject()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const budget = project.budget || 0

  useEffect(() => {

    // 🚨 Never fetch with no budget
    if (!budget) {
      setLoading(false)
      return
    }

    async function loadProducts() {
      try {

        // ⭐ Smart demo behavior:
        // Pull products UNDER budget so AI looks intelligent
        const data = await getProducts({
          price: budget
        })

        setProducts(data)

      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

  }, [budget])


  // ⭐ REAL calculations
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

        {/* HEADER */}
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
                project: {project.projectName || "Untitled Project"}
              </span>

              <span>
                budget: ${budget.toLocaleString()}
              </span>
            </div>
          </div>

          <span className="text-lg font-semibold">
            cart: {items}
          </span>
        </div>



        {/* AI SUMMARY */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h2 className="text-xl mb-6 font-semibold">
            AI Results Summary
          </h2>

          {loading ? (

            <p className="animate-pulse">
              Generating smart recommendations...
            </p>

          ) : (

            <div className="space-y-4">

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


              {/* Progress Bar */}
              <div className="w-full bg-gray-300 h-4 rounded overflow-hidden">
                <div
                  className={`h-4 ${
                    overBudget ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              <p className="text-sm text-gray-600">
                {percentUsed.toFixed(0)}% of budget used
              </p>

            </div>

          )}

        </div>



        {/* PRODUCT GRID */}
        <div className="bg-white p-6 rounded shadow-sm">

          <h3 className="text-lg mb-6 font-semibold">
            Recommended Products
          </h3>

          {loading ? (

            <p>Loading products...</p>

          ) : products.length === 0 ? (

            <p className="text-gray-500">
              No products found within this budget.
            </p>

          ) : (

            // ⭐ responsive grid upgrade
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



        {/* CART BAR */}
        <div className="bg-white p-8 flex justify-between items-center rounded shadow-sm">

          <div className="space-y-1">
            <p>
              items: {items}
            </p>

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
