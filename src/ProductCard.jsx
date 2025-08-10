// src/ProductCard.jsx
export default function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow transition-shadow"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-2">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.store}</p>
        <p className="text-sm font-bold text-black">{product.price}</p>
      </div>
    </div>
  );
}
