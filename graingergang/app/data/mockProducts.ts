export type Product = {
  id: string
  name: string
  category: "Plumbing" | "Renovation" | "Electrical";
  price: number
  durability_score: number
  vendor_link: string
  image: string
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Industrial Cordless Drill",
    category: "Electrical",
    price: 229,
    durability_score: 8,
    vendor_link: "https://www.grainger.com/",
    image: "/drill.png",
  },
  {
    id: "2",
    name: "Steel Storage Shelving Unit",
    category: "Renovation",
    price: 799,
    durability_score: 9,
    vendor_link: "https://www.grainger.com/",
    image: "/shelf.png",
  },
  {
    id: "3",
    name: "Safety Gloves (Pack of 12)",
    category: "Renovation",
    price: 49,
    durability_score: 7,
    vendor_link: "https://www.grainger.com/",
    image: "/gloves.png",
  },
]
