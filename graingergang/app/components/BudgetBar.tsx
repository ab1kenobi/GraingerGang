"use client"

type Props = {
  budget: number
  total: number
}

export default function BudgetBar({ budget, total }: Props) {
  const remaining = budget - total

  const color =
    remaining < 0 ? "text-red-600" : remaining < 200 ? "text-yellow-600" : "text-green-600"

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">Total Cost</p>
        <p className="text-xl font-bold">${total}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Remaining Budget</p>
        <p className={`text-xl font-bold ${color}`}>${remaining}</p>
      </div>
    </div>
  )
}
