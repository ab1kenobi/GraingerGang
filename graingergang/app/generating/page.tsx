"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GeneratingPage() {

  const router = useRouter()

  useEffect(() => {

    const timer = setTimeout(() => {
      router.push("/build")
    }, 2500) // adjust timing here

    return () => clearTimeout(timer)

  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#d0d0d0]">

      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-8" />

      <h1 className="text-2xl font-semibold mb-2">
        AI is generating your build plan...
      </h1>

      <p className="text-gray-600">
        Finding optimal tools • Calculating budget • Comparing vendors
      </p>

    </div>
  )
}
