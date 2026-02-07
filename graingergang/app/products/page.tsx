// app/products/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  product: string
  image_url: string
  grainger_url: string
  price: string
  label: string
  created_at: string
}

async function fetchProducts(filters: { category: string; brand: string; price: string; inStock: string }) {
  const params = new URLSearchParams()

  // Map the Category filter to the "label" query param (searches by product label/category)
  if (filters.category) params.set("label", filters.category)
  // Map the Brand filter to "product" query param (searches product name which includes brand)
  if (filters.brand) params.set("product", filters.brand)
  if (filters.price) params.set("price", filters.price)

  const res = await fetch(`/backend?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: "",
    inStock: ""
  })

  // Load all products on first render
  useEffect(() => {
    fetchProducts({ category: "", brand: "", price: "", inStock: "" })
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Called when "search products" button is clicked
  const handleSearch = () => {
    setLoading(true)
    fetchProducts(filters)
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  // Build category dropdown options from current products list
  const categoryOptions = Array.from(new Set(products.map((p) => p.label).filter(Boolean))).sort()

  return (
    <div className="min-h-screen bg-[#d0d0d0]">
      {/* Top Bar */}
      <div className="bg-[#d0d0d0] border-b-2 border-black px-8 py-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <label className="text-lg">project:</label>
            <input type="text" className="bg-white border-none px-4 py-2 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-lg">budget:</label>
            <input type="text" className="bg-white border-none px-4 py-2 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-lg">cart:</label>
            <input type="text" className="bg-white border-none px-4 py-2 w-24" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 grid grid-cols-[1fr_2fr] gap-6">
        {/* Left Panel - Filters */}
        <div className="bg-white p-8">
          <h2 className="text-2xl text-center mb-8">Filters</h2>

          <div className="space-y-6">
            {/* ✅ Category DROPDOWN (label) */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Category:</label>
              <select
                className="bg-[#d0d0d0] border-none px-4 py-3"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All</option>
                {categoryOptions.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Brand:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none px-4 py-3"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Price:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none px-4 py-3"
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">In Stock:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none px-4 py-3"
                value={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              className="bg-[#d0d0d0] border-none px-16 py-4 text-lg cursor-pointer hover:bg-[#c0c0c0]"
              onClick={handleSearch}
            >
              search products
            </button>
          </div>
        </div>

        {/* Right Panel - Product Browser */}
        <div className="bg-white p-8">
          <h2 className="text-2xl text-center mb-8">Product Browser</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={product.grainger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c0c0c0] p-3 cursor-pointer hover:bg-[#b0b0b0] flex flex-col justify-between"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.product}
                      className="w-full h-24 object-contain mb-2"
                    />
                  )}
                  <p className="text-sm font-semibold truncate">{product.product}</p>
                  {product.price && <p className="text-xs mt-1">${product.price}</p>}
                  {product.label && <p className="text-xs text-gray-600 mt-1">{product.label}</p>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Cart Preview */}
          <div className="bg-white p-8">
            <h2 className="text-2xl text-center mb-6">cart preview</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-lg">items:</label>
                <div className="bg-[#c0c0c0] w-16 h-12" />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-lg">total:</label>
                <div className="bg-[#c0c0c0] w-16 h-12" />
              </div>
            </div>
          </div>

          {/* Go to Build Button */}
          <div className="flex items-end justify-end pb-8">
            <div className="relative">
              <button
                className="bg-white border-2 border-black px-20 py-6 text-xl cursor-pointer hover:bg-gray-100"
                onClick={() => router.push("/build")}
              >
                go to build
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}