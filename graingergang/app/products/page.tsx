// products page
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProject } from "../context/ProjectContext"

type Product = {
  id: number
  product: string
  image_url: string
  grainger_url: string
  price: string
  label: string
  created_at: string
}

async function fetchProducts(filters: { category: string; price: string }) {
  const params = new URLSearchParams()
  if (filters.category) params.set("label", filters.category)
  if (filters.price) params.set("price", filters.price)

  const res = await fetch(`/backend?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export default function ProductsPage() {
  const router = useRouter()
  const { project, cartItems, setCartItems } = useProject()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    category: "",
    price: ""
  })

  const addToCart = (p: Product) => {
    const prev = cartItems ?? []
    const idx = prev.findIndex((x) => x.id === p.id)

    let next = prev
    if (idx >= 0) {
      next = prev.map((x) =>
        x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x
      )
    } else {
      next = [
        ...prev,
        {
          id: p.id,
          item: p.product,
          category: p.label || "General",
          price: Number(p.price) || 0,
          quantity: 1,
          image_url: p.image_url || "",
          grainger_url: p.grainger_url || "#"
        }
      ]
    }

    setCartItems(next)
  }

  const removeFromCart = (id: number) => {
    setCartItems((cartItems ?? []).filter((x) => x.id !== id))
  }

  const incrementQty = (id: number) => {
    const next = (cartItems ?? []).map((x) =>
      x.id === id ? { ...x, quantity: x.quantity + 1 } : x
    )
    setCartItems(next)
  }

  const cartCount =
    cartItems?.reduce((sum, x) => sum + (x.quantity ?? 1), 0) ?? 0

  const cartTotal =
    cartItems?.reduce(
      (sum, x) => sum + (Number(x.price) || 0) * (x.quantity ?? 1),
      0
    ) ?? 0

  useEffect(() => {
    fetchProducts({ category: "", price: "" })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    setLoading(true)
    fetchProducts(filters)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const categoryOptions = Array.from(
    new Set(products.map((p) => p.label).filter(Boolean))
  ).sort()

  return (
    <div className="min-h-screen bg-[#d0d0d0]">
      {/* Top Bar */}
      <div className="border-b-2 border-black px-8 py-6">
        <div className="flex items-center gap-8 text-lg">
          <div>project: <strong>{project.projectName || "—"}</strong></div>
          <div>budget: <strong>{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</strong></div>
          <div>cart: <strong>{cartCount}</strong></div>

          <button
            className="ml-4 bg-white border-2 border-black px-6 py-2 hover:bg-gray-100"
            onClick={() => router.push("/cart")}
          >
            view cart
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 grid grid-cols-[1fr_2fr] gap-6">
        {/* Filters */}
        <div className="bg-white p-8">
          <h2 className="text-2xl text-center mb-8">Filters</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Category:</label>
              <select
                className="bg-[#d0d0d0] px-4 py-3"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
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
              <label className="text-lg">Price:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] px-4 py-3"
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
                placeholder="e.g. 100 or <=100"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              className="bg-[#d0d0d0] px-16 py-4 text-lg hover:bg-[#c0c0c0]"
              onClick={handleSearch}
            >
              search products
            </button>
          </div>
        </div>

        {/* Product Browser (scrollable) */}
        <div className="bg-white p-8">
          <h2 className="text-2xl text-center mb-8">Product Browser</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#c0c0c0] p-3 flex flex-col justify-between"
                  >
                    <div>
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.product}
                          className="w-full h-24 object-contain mb-2"
                        />
                      )}
                      <p className="text-sm font-semibold">{product.product}</p>
                      <p className="text-xs">${product.price}</p>
                      <p className="text-xs text-gray-600">{product.label}</p>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        className="flex-1 bg-white px-2 py-2 text-sm hover:bg-gray-100"
                        onClick={() => addToCart(product)}
                      >
                        add
                      </button>
                      <a
                        className="flex-1 text-center bg-white px-2 py-2 text-sm hover:bg-gray-100"
                        href={product.grainger_url}
                        target="_blank"
                      >
                        view
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-8 flex justify-end">
        <button
          className="bg-white border-2 border-black px-20 py-6 text-xl hover:bg-gray-100"
          onClick={() => router.push("/build")}
        >
          go to build
        </button>
      </div>
    </div>
  )
}