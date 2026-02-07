"use client"

import { useRouter } from "next/navigation"

export default function HelpPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e7d0cc] to-[#ef8f8f] p-10">

      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 bg-white px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12">

          <h1 className="text-3xl font-bold mb-6">
            About Toolsmith
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Toolsmith is a smart project planning assistant that helps you design,
            budget, and organize renovation or construction projects. By entering
            your project details, Toolsmith can recommend products, track costs,
            and ensure you stay within budget.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            How to use this site
          </h2>

          <ul className="space-y-3 text-gray-700 list-disc ml-6">
            <li>Create a new project and enter your project name, budget and project description.</li>
            <li>Generate an AI plan to receive recommended items automatically.</li>
            <li>Browse products manually if you prefer choosing items yourself.</li>
            <li>Save projects to revisit or edit them later.</li>
            <li>Track costs to make sure you stay under budget.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-4">
            Tips
          </h2>

          <p className="text-gray-700">
            Start by entering a realistic budget. The AI recommendations are optimized
            to maximize value while keeping you within your spending limit.
          </p>

        </div>
      </div>
    </div>
  )
}
