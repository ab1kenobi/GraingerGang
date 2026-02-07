"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useProject } from "./context/ProjectContext"

export default function Home() {
  const router = useRouter()
  const { project, setProject, savedProjects, loadProject, deleteProject, resetProject } = useProject()
  const [showSaved, setShowSaved] = useState(false)

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

  const handleNewProject = () => {
    resetProject()
    setShowSaved(false)
  }

  const handleLoadProject = (id: string) => {
    loadProject(id)
    setShowSaved(false)
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-8 mb-12">

          {/* BIGGER LOGO */}
          <img
            src="/logo/logo.png"
            alt="Toolsmith logo"
            onClick={() => router.push("/")}
            className="
              w-28 h-28
              rounded-full
              object-cover
              shadow-2xl
              ring-4 ring-white/40
              hover:scale-105
              transition
              cursor-pointer
            "
          />

          <button
            onClick={handleNewProject}
            className="bg-white px-10 py-5 rounded-2xl shadow hover:bg-gray-100 transition"
          >
            New Project
          </button>

          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`px-10 py-5 rounded-2xl shadow transition ${
              showSaved
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Saved Projects
          </button>

          <button className="bg-white px-10 py-5 rounded-2xl shadow hover:bg-gray-100 transition">
            Help
          </button>
        </div>


        {/* ================= SAVED PROJECTS ================= */}
        {showSaved && (
          <div className="bg-white p-8 mb-8 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Saved Projects</h2>

            {savedProjects.length === 0 ? (
              <p className="text-gray-500">
                No saved projects yet. Create a project and save it from the purchase list.
              </p>
            ) : (
              <div className="space-y-3">
                {savedProjects.map(sp => (
                  <div
                    key={sp.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded hover:bg-gray-200 transition"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleLoadProject(sp.id)}
                    >
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-lg">{sp.projectName}</h3>
                        <span className="text-sm text-gray-500">saved {sp.savedAt}</span>
                      </div>

                      <div className="flex gap-6 text-sm text-gray-600 mt-1">
                        <span>Budget: ${sp.budget.toLocaleString()}</span>
                        <span>Items: {sp.items.length}</span>
                        <span>Total: ${sp.totalCost.toFixed(2)}</span>
                        <span className={
                          sp.totalCost > sp.budget
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }>
                          {sp.totalCost > sp.budget ? "Over Budget" : "Under Budget"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(sp.id)
                      }}
                      className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* ================= FORM ================= */}
        <div className="bg-white p-10 mb-8 rounded-2xl shadow">
          <div className="space-y-5">

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Project Name:</label>
              <input
                type="text"
                className="bg-[#d0d0d0] h-12 px-4 rounded"
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
                className="bg-[#d0d0d0] h-12 px-4 rounded"
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
                className="bg-[#d0d0d0] h-12 px-4 rounded"
                value={project.timeline}
                onChange={(e) =>
                  setProject({ ...project, timeline: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg font-medium">Category:</label>
              <select
                className="bg-[#d0d0d0] h-12 px-4 rounded"
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


        {/* ================= DESCRIPTION ================= */}
        <div className="mb-12">
          <label className="text-lg font-medium block mb-4">
            Project Description
          </label>

          <textarea
            className="w-full bg-white border-2 border-gray-300 rounded min-h-[200px] p-4"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
        </div>


        {/* ================= BUTTONS ================= */}
        <div className="flex gap-14 justify-center mt-16">
          <button
            onClick={handleGenerateAIPlan}
            className="bg-white px-12 py-5 rounded-2xl shadow hover:bg-gray-100 transition font-medium"
          >
            Generate AI Plan
          </button>

          <button
            onClick={handleManualBrowse}
            className="bg-white px-12 py-5 rounded-2xl shadow hover:bg-gray-100 transition font-medium"
          >
            Browse Products Manually
          </button>
        </div>

      </div>
    </div>
  )
}
