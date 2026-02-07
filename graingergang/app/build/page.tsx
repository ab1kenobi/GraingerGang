"use client"

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-[#d0d0d0] p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex gap-8 text-lg">
            <span>project: Warehouse Setup</span>
            <span>budget: $5000</span>
          </div>

          <span className="text-lg">cart: 3</span>
        </div>

        {/* AI RESULTS */}
        <div className="bg-white p-8">
          <h2 className="text-xl mb-6 font-semibold">
            AI Results Summary:
          </h2>

          <div className="space-y-4">
            <p>Generated 6 Recommended Tools</p>
            <p>Estimated Cost: $4,200</p>
            <p>Under Budget By: $800</p>
          </div>
        </div>

        {/* SPLIT PANEL */}
        <div className="grid grid-cols-2 gap-8">

          {/* AI Suggestions */}
          <div className="bg-white p-6">
            <h3 className="text-lg mb-4 font-semibold">
              AI Suggestions
            </h3>

            <div className="space-y-3">
              {[1,2,3,4].map((item) => (
                <div 
                  key={item}
                  className="flex justify-between items-center bg-[#d0d0d0] p-3"
                >
                  <span>Industrial Drill</span>
                  <span>$120</span>
                  <button className="bg-white px-3 py-1">
                    swap
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Browser */}
          <div className="bg-white p-6">
            <h3 className="text-lg mb-4 font-semibold">
              Product Browser
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((item) => (
                <div 
                  key={item}
                  className="bg-[#d0d0d0] h-24"
                />
              ))}
            </div>
          </div>
        </div>

        {/* CART */}
        <div className="bg-white p-8 flex justify-between items-center">
          <div>
            <p>items: 6</p>
            <p>total: $4,200</p>
          </div>

          <button className="bg-white border px-6 py-3">
            go to build
          </button>
        </div>

      </div>
    </div>
  )
}
