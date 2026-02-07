type Product = {
  id: number;
  product: string;
  price: number;
  image_url: string;
  grainger_url: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition">
      <img
        src={product.image_url}
        alt={product.product}
        className="w-full h-48 object-contain mb-4"
      />

      <h3 className="font-semibold text-lg">{product.product}</h3>

      <p className="text-blue-600 font-bold text-xl mt-2">
        ${product.price}
      </p>

      <a
        href={product.grainger_url}
        target="_blank"
        className="inline-block mt-3 text-sm text-gray-500 hover:underline"
      >
        View Product →
      </a>
    </div>
  );
}
