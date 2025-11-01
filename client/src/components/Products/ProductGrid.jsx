import { Link } from "react-router-dom";

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const imageUrl =
          product?.images?.[0]?.url ||
          "https://via.placeholder.com/400x400?text=No+Image";

        return (
          <Link key={index} to={`/product/${product._id}`} className="block">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-full h-96 mb-4">
                <img
                  src={imageUrl}
                  alt={product?.images?.[0]?.altText || product.name || "Product"}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm mb-2 truncate">{product.name}</h3>
              <p className="text-gray-500 font-medium text-sm tracking-tighter">
                ${product.price}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ProductGrid;
