// app/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectName: "",
    budget: "",
    timeline: "",
    category: "renovation/electrical/plumbing",
    description: ""
  })

  const handleGenerateAIPlan = () => {
    router.push('/build')
  }

  const handleManualBrowse = () => {
    router.push('/products')
  }

  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="flex gap-5 mb-10">
          <button className="bg-white hover:bg-gray-100 px-10 py-5 text-lg font-normal border-none cursor-pointer">
            logo
          </button>
          <button className="bg-white hover:bg-gray-100 px-10 py-5 text-lg font-normal border-none cursor-pointer">
            new project
          </button>
          <button className="bg-white hover:bg-gray-100 px-10 py-5 text-lg font-normal border-none cursor-pointer">
            saved projects
          </button>
          <button className="bg-white hover:bg-gray-100 px-10 py-5 text-lg font-normal border-none cursor-pointer">
            help
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white p-10 mb-8">
          <div className="space-y-5">
            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-normal">project name:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none h-12 px-4 text-base"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-normal">budget:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none h-12 px-4 text-base"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-normal">timeline:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] border-none h-12 px-4 text-base"
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-normal">category:</label>
              <select
                className="bg-[#d0d0d0] border-none h-12 px-4 text-base"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="renovation/electrical/plumbing">renovation/electrical/plumbing</option>
                <option value="renovation">renovation</option>
                <option value="electrical">electrical</option>
                <option value="plumbing">plumbing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-12">
          <label className="text-lg font-normal block mb-4">describe project</label>
          <textarea
            className="w-full bg-white border-2 border-gray-300 min-h-[200px] text-base p-4 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-14 justify-center mt-16">
          <div className="relative">
            <button
              className="bg-white hover:bg-gray-100 px-12 py-5 text-lg font-normal border-none cursor-pointer"
              onClick={handleGenerateAIPlan}
            >
              generate AI plan
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
          </div>

          <div className="relative">
            <button
              className="bg-white hover:bg-gray-100 px-12 py-5 text-lg font-normal border-none cursor-pointer"
              onClick={handleManualBrowse}
            >
              skip and browse manually
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
          </div>
        </div>
      </div>
    </div>
  )
}