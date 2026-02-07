"use client"

import { useRouter } from "next/navigation"
import { useProject } from "./context/ProjectContext"

export default function Home() {
  const router = useRouter()
  const { project, setProject } = useProject()

  const handleGenerateAIPlan = () => {

    if (!project.projectName || !project.budget) {
      alert("Please enter a project name and budget.")
      return
    }

    router.push("/generating")
  }

  const handleManualBrowse = () => {

    if (!project.projectName || !project.budget) {
      alert("Please enter a project name and budget.")
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
            logo
          </button>

          <button className="bg-white px-10 py-5">
            new project
          </button>

          <button className="bg-white px-10 py-5">
            saved projects
          </button>

          <button className="bg-white px-10 py-5">
            help
          </button>
        </div>


        {/* FORM */}
        <div className="bg-white p-10 mb-8">
          <div className="space-y-5">

            {/* Project Name */}
            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg">project name:</label>

              <input
                type="text"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.projectName}
                onChange={(e) =>
                  setProject({
                    ...project,
                    projectName: e.target.value
                  })
                }
              />
            </div>


            {/* Budget */}
            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg">budget:</label>

              <input
                type="number"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.budget || ""}
                onChange={(e) =>
                  setProject({
                    ...project,
                    budget: Number(e.target.value)
                  })
                }
              />
            </div>


            {/* Timeline */}
            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg">timeline:</label>

              <input
                type="text"
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.timeline}
                onChange={(e) =>
                  setProject({
                    ...project,
                    timeline: e.target.value
                  })
                }
              />
            </div>


            {/* Category */}
            <div className="grid grid-cols-[200px_1fr] gap-8 items-center">
              <label className="text-lg">category:</label>

              <select
                className="bg-[#d0d0d0] h-12 px-4"
                value={project.category}
                onChange={(e) =>
                  setProject({
                    ...project,
                    category: e.target.value
                  })
                }
              >
                <option value="">select category</option>
                <option value="renovation">renovation</option>
                <option value="electrical">electrical</option>
                <option value="plumbing">plumbing</option>
              </select>
            </div>

          </div>
        </div>


        {/* Description */}
        <div className="mb-12">
          <label className="text-lg block mb-4">
            describe project
          </label>

          <textarea
            className="w-full bg-white border-2 border-gray-300 min-h-[200px] p-4"
            value={project.description}
            onChange={(e) =>
              setProject({
                ...project,
                description: e.target.value
              })
            }
          />
        </div>


        {/* Buttons */}
        <div className="flex gap-14 justify-center mt-16">

          <button
            onClick={handleGenerateAIPlan}
            className="bg-white px-12 py-5 hover:bg-gray-100 transition"
          >
            generate AI plan
          </button>

          <button
            onClick={handleManualBrowse}
            className="bg-white px-12 py-5 hover:bg-gray-100 transition"
          >
            skip and browse manually
          </button>

        </div>
      </div>
    </div>
  )
}
