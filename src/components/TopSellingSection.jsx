import ProductCard from "./ProductCard";

const topSellingProducts = [
  {
    id: 1,
    name: "Premium Seafood",
    weight: "10 Pieces",
    price: "574.00",
    oldPrice: null,
    image: "/Fish.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 2,
    name: "Nutritious Ghee",
    weight: "1 KG",
    price: "779.00",
    oldPrice: "820.00",
    image: "/Ghee.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 3,
    name: "Refreshing Cold Drinks",
    weight: "3 Cans",
    price: "278.80",
    oldPrice: "328.00",
    image: "/Soda.png",
    stock: "In Stock",
    featured: false,
  },
];

function TopSellingSection() {
  return (
    <section className="w-full py-12">
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