import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function CategoryPage() {
  const { categoryName } = useParams();

  const formattedCategory = decodeURIComponent(categoryName).replace(/-/g, " ");

  const categoryProducts = products.filter((product) =>
    product.categories?.includes(formattedCategory.toLowerCase()),
  );

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
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
