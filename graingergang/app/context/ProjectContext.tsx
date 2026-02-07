"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ProjectData {
  projectName: string
  budget: number
  timeline: string
  category: string
  description: string
}

interface ProjectContextType {
  project: ProjectData
  setProject: (data: ProjectData) => void
}

const defaultProject: ProjectData = {
  projectName: "",
  budget: 0,
  timeline: "",
  category: "",
  description: ""
}

const ProjectContext = createContext<ProjectContextType>({
  project: defaultProject,
  setProject: () => {}
})

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState(defaultProject)

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  return useContext(ProjectContext)
}
