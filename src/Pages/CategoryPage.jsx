import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function CategoryPage() {
  const { categoryName } = useParams();

  const formattedCategory = decodeURIComponent(categoryName).replace(/-/g, " ");

  const [categoryProducts, setCategoryProducts] = useState([]);


  useEffect(() => {
  fetch(
    `http://localhost:5000/api/products?category=${encodeURIComponent(
      formattedCategory.toLowerCase()
    )}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch category products");
      }

      return response.json();
    })
    .then((data) => {
      setCategoryProducts(data);
    })
    .catch((error) => {
      console.error("Category products error:", error);
      setCategoryProducts([]);
    });
}, [formattedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-blue-600 px-4 py-5 text-white">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="text-2xl font-bold capitalize">{formattedCategory}</h1>

          <p className="mt-1 text-sm">Explore products from this category</p>
        </div>
      </div>

      {/* Products */}
      <main className="mx-auto max-w-[1140px] px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Products in {formattedCategory}
          </h2>

          <Link
            to="/"
            aria-label="Back to Home"
            title="Back to Home"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
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
      </main>
    </div>
  );
}

export default CategoryPage;
