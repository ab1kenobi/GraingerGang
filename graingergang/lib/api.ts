export async function getProducts(filters?: {
  label?: string;
  product?: string;
  price?: number;
}) {
  const params = new URLSearchParams();

  if (filters?.label) params.append("label", filters.label);
  if (filters?.product) params.append("product", filters.product);
  if (filters?.price) params.append("price", filters.price.toString());

  const res = await fetch(`/backend?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
