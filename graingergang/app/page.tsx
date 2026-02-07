"use client"

import { useRouter } from "next/navigation"
import { useProject } from "./context/ProjectContext"

export default function Home() {
  const router = useRouter()
  const { project, setProject } = useProject()

  const handleGenerateAIPlan = () => {
    if (!project.projectName || !project.budget) {
      alert("Please enter a Project Name and Budget.")
      return
    }

    router.push("/generating")
  }

  const handleManualBrowse = () => {
    if (!project.projectName || !project.budget) {
      alert("Please enter a Project Name and Budget.")
      return
    }

    router.push("/products")
  }

  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex gap-5 mb-10">
          <button className="bg-white px-10 py-5">
            Logo
          </button>

          <button className="bg-white px-10 py-5">
            New Project
          </button>

          <button className="bg-white px-10 py-5">
            Saved Projects
          </button>

          <button className="bg-white px-10 py-5">
            Help
          </button>
        </div>


        {/* Form */}
        <div className="bg-white p-10 mb-8">
          <div className="space-y-5">

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Project Name:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.projectName}
                onChange={(e) =>
                  setProject({ ...project, projectName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Budget:</label>
              <input
                type="number"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.budget || ""}
                onChange={(e) =>
                  setProject({ ...project, budget: Number(e.target.value) })
                }
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Timeline:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.timeline}
                onChange={(e) =>
                  setProject({ ...project, timeline: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Category:</label>
              <select
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.category}
                onChange={(e) =>
                  setProject({ ...project, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="renovation">Renovation</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
              </select>
            </div>

          </div>
        </div>


        {/* Description */}
        <div className="mb-12">
          <label className="text-lg font-medium block mb-4">
            Project Description
          </label>

          <textarea
            className="w-full bg-white border-2 border-gray-300 min-h-[200px] p-4"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
        </div>


        {/* Buttons */}
        <div className="flex gap-14 justify-center mt-16">

          <button
            onClick={handleGenerateAIPlan}
            className="bg-white px-12 py-5 hover:bg-gray-100 transition font-medium"
          >
            Generate AI Plan
          </button>

          <button
            onClick={handleManualBrowse}
            className="bg-white px-12 py-5 hover:bg-gray-100 transition font-medium"
          >
            Browse Products Manually
          </button>

        </div>
      </div>
    </div>
  )
}
