import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    fetch(
      `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Search results error:", error);
        setProducts([]);
      });
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          Search Results
        </h1>

        <p className="mb-8 text-slate-500">
          Results for: <span className="font-semibold">{searchQuery}</span>
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                weight={product.weight}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                featured={product.featured}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-500">
              No products found.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchResultsPage;