"use client"

import { useRouter } from 'next/navigation'

interface CheckoutItem {
  id: string
  name: string
}

export default function CheckoutPage() {
  const router = useRouter()
  
  const items: CheckoutItem[] = [
    { id: '1', name: 'item #1' },
    { id: '2', name: 'item #2' },
    { id: '3', name: 'item #3' },
    { id: '4', name: 'item #4' },
  ]

  const openInGrainger = () => {
    console.log('Opening in Grainger...')
  }

  const saveProject = () => {
    console.log('Saving project...')
  }

  const startNewProject = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl text-center mb-8">checkout</h1>

        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-xl mb-6">items summary</h2>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-32">{item.name}</div>
                <div className="w-24 h-16 bg-gray-300 rounded"></div>
                <button className="flex-1 bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition">
                  view on granger
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded shadow">
          <div className="text-xl">total:</div>
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <button
            onClick={openInGrainger}
            className="bg-white px-8 py-4 rounded shadow hover:bg-gray-50 transition text-center"
          >
            open in grainger
          </button>
          <button
            onClick={saveProject}
            className="bg-white px-8 py-4 rounded shadow hover:bg-gray-50 transition text-center"
          >
            save project
          </button>
          <button
            onClick={startNewProject}
            className="bg-white px-8 py-4 rounded shadow hover:bg-gray-50 transition text-center"
          >
            start new project
          </button>
        </div>
      </div>
    </div>
  )
}