"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Product } from "../data/mockProducts"

type Props = {
  cart: Product[]
}

export default function Charts({ cart }: Props) {
  const data = Object.values(
    cart.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { category: item.category, cost: 0 }
      }
      acc[item.category].cost += item.price
      return acc
    }, {})
  )

  return (
    <div className="h-64">
      <h3 className="font-semibold mb-2">Cost by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
