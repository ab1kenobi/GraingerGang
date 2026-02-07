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

  // Category → label
  if (filters.category) params.set("label", filters.category)
  if (filters.price) params.set("price", filters.price)

  const res = await fetch(`/backend?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export default function ProductsPage() {
  const router = useRouter()

  // ✅ Shared cart (same cart used by /build → /cart)
  const { cartItems, setCartItems } = useProject()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filters (Category dropdown + Price text)
  const [filters, setFilters] = useState({
    category: "",
    price: ""
  })

  // ✅ Add item to shared cart (NO callback setter; matches your context typing)
  const addToCart = (p: Product) => {
    const prev = cartItems ?? []
    const idx = prev.findIndex((x) => x.id === p.id)

    let next = prev

    // If already in cart: increment quantity
    if (idx >= 0) {
      next = prev.map((x) =>
        x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x
      )
    } else {
      // Otherwise: add new
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

  // ✅ Remove item from shared cart
  const removeFromCart = (id: number) => {
    const prev = cartItems ?? []
    setCartItems(prev.filter((x) => x.id !== id))
  }

  // ✅ Increment quantity in shared cart
  const incrementQty = (id: number) => {
    const prev = cartItems ?? []
    const next = prev.map((x) =>
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

  // Load all products on first render
  useEffect(() => {
    fetchProducts({ category: "", price: "" })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Search button handler
  const handleSearch = () => {
    setLoading(true)
    fetchProducts(filters)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  // Category dropdown options (from currently loaded products)
  const categoryOptions = Array.from(
    new Set(products.map((p) => p.label).filter(Boolean))
  ).sort()

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
            <div className="bg-white border-none px-4 py-2 w-24 text-center">
              {cartCount}
            </div>
          </div>

          <button
            className="bg-white border-2 border-black px-6 py-2 hover:bg-gray-100"
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
            {/* Category */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Category:</label>
              <select
                className="bg-[#d0d0d0] border-none px-4 py-3"
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

            {/* Price */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-lg">Price:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none px-4 py-3"
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
              className="bg-[#d0d0d0] border-none px-16 py-4 text-lg cursor-pointer hover:bg-[#c0c0c0]"
              onClick={handleSearch}
            >
              search products
            </button>
          </div>
        </div>

        {/* Product Browser */}
        <div className="bg-white p-8">
          <h2 className="text-2xl text-center mb-8">Product Browser</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#c0c0c0] p-3 hover:bg-[#b0b0b0] flex flex-col justify-between"
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

                    {product.price && (
                      <p className="text-xs mt-1">${product.price}</p>
                    )}
                    {product.label && (
                      <p className="text-xs text-gray-600 mt-1">
                        {product.label}
                      </p>
                    )}
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
                      rel="noopener noreferrer"
                    >
                      view
                    </a>
                  </div>
                </div>
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
                <div className="bg-[#c0c0c0] px-4 py-3 min-w-[64px] text-center">
                  {cartCount}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-lg">total:</label>
                <div className="bg-[#c0c0c0] px-4 py-3 min-w-[64px] text-center">
                  ${cartTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="mt-6 space-y-2 max-h-56 overflow-auto">
              {!cartItems || cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">No items in cart yet.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#d0d0d0] p-2"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold truncate">
                        {item.item}
                      </p>
                      <p className="text-xs">
                        ${Number(item.price).toFixed(2)} · qty{" "}
                        {item.quantity ?? 1}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={() => incrementQty(item.id)}
                      >
                        +
                      </button>

                      <button
                        className="bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={() => removeFromCart(item.id)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                ))
              )}
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