import ProductCard from "./ProductCard";
import products from "../data/products";

const topSellingProducts = products.filter((product) =>
  ["prod-seafood", "prod-cold-drinks", "prod-ghee"].includes(product.id),
);

function TopSellingSection() {
  return (
    <section className="w-full bg-[#f4faf6] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">

        {/* Section Heading */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Top Selling Items
          </h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topSellingProducts.map((product) => (
  <ProductCard
    key={product.id}
    {...product}
  />
))}
        </div>

      </div>
    </section>
  );
}

export default TopSellingSection;