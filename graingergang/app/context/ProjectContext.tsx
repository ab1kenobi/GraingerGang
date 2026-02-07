"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ProjectData {
  projectName: string
  budget: number
  timeline: string
  category: string
  description: string
}

export interface CartItem {
  id: number
  item: string
  category: string
  price: number
  quantity: number
  image_url: string
  grainger_url: string
}

export interface SavedProject {
  id: string
  projectName: string
  budget: number
  timeline: string
  category: string
  description: string
  items: CartItem[]
  totalCost: number
  savedAt: string
}

interface ProjectContextType {
  project: ProjectData
  setProject: (data: ProjectData) => void
  cartItems: CartItem[]
  setCartItems: (items: CartItem[]) => void
  savedProjects: SavedProject[]
  saveCurrentProject: () => void
  loadProject: (id: string) => void
  deleteProject: (id: string) => void
  resetProject: () => void
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
  setProject: () => {},
  cartItems: [],
  setCartItems: () => {},
  savedProjects: [],
  saveCurrentProject: () => {},
  loadProject: () => {},
  deleteProject: () => {},
  resetProject: () => {},
})

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState(defaultProject)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])

  // Load saved projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("grainger_saved_projects")
      if (stored) {
        setSavedProjects(JSON.parse(stored))
      }
    } catch {}
  }, [])

  // Persist saved projects to localStorage
  const persistProjects = (projects: SavedProject[]) => {
    setSavedProjects(projects)
    localStorage.setItem("grainger_saved_projects", JSON.stringify(projects))
  }

  const saveCurrentProject = () => {
    if (!project.projectName) return

    const taxRate = 0.08
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal * (1 + taxRate)

    const newProject: SavedProject = {
      id: Date.now().toString(),
      projectName: project.projectName,
      budget: project.budget,
      timeline: project.timeline,
      category: project.category,
      description: project.description,
      items: [...cartItems],
      totalCost: total,
      savedAt: new Date().toLocaleDateString(),
    }

    // Replace if same name exists, otherwise add
    const existing = savedProjects.findIndex(p => p.projectName === project.projectName)
    let updated: SavedProject[]
    if (existing >= 0) {
      updated = [...savedProjects]
      updated[existing] = newProject
    } else {
      updated = [...savedProjects, newProject]
    }
    persistProjects(updated)
  }

  const loadProject = (id: string) => {
    const found = savedProjects.find(p => p.id === id)
    if (found) {
      setProject({
        projectName: found.projectName,
        budget: found.budget,
        timeline: found.timeline,
        category: found.category,
        description: found.description,
      })
      setCartItems(found.items)
    }
  }

  const deleteProject = (id: string) => {
    persistProjects(savedProjects.filter(p => p.id !== id))
  }

  const resetProject = () => {
    setProject(defaultProject)
    setCartItems([])
  }

  return (
    <ProjectContext.Provider value={{
      project, setProject,
      cartItems, setCartItems,
      savedProjects, saveCurrentProject, loadProject, deleteProject, resetProject,
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  return useContext(ProjectContext)
}
