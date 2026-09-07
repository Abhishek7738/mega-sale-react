import ProductCard from "./ProductCard";

const trendingProducts = [
  {
    id: 1,
    name: "Premium Seafood",
    image: "/Fish.png",
    weight: "10 Pieces",
    price: "₹ 574.00",
    oldPrice: "",
    stock: "In Stock",
    featured: false,
  },
];

function TrendingProductsSection() {
  return (
    <section className="py-8">
      <div className="m-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Trending Products
          </h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingProductsSection;