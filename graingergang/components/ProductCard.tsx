type Product = {
  id: number;
  product: string;
  price: number;
  image_url: string;
  grainger_url: string;
  label?: string;
  reasoning?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col">
      <img
        src={product.image_url}
        alt={product.product}
        className="w-full h-48 object-contain mb-4"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />

      <h3 className="font-semibold text-lg">{product.product}</h3>

      {product.label && (
        <p className="text-xs text-gray-400 mt-1">{product.label}</p>
      )}

      {product.reasoning && (
        <p className="text-sm text-gray-500 mt-2 italic">
          {product.reasoning}
        </p>
      )}

      <p className="text-blue-600 font-bold text-xl mt-2">
        ${product.price}
      </p>

      <a
        href={product.grainger_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 bg-red-600 text-white text-center text-sm px-4 py-2 rounded hover:bg-red-700 transition"
      >
        View on Grainger →
      </a>
    </div>
  );
}
