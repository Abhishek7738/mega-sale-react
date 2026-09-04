import ProductCard from "./ProductCard";

const freshFruitProducts = [
  {
    id: 1,
    name: "Organic Oranges",
    image: "/Orange.png",
    weight: "1 Kg",
    price: "₹228.78",
    oldPrice: "₹246.00",
    stock: "In Stock",
    featured: true,
  },
  {
    id: 2,
    name: "Nature's Sweet Banana",
    image: "/Banana.png",
    weight: "6 Kg",
    price: "₹4575.60",
    oldPrice: "₹4920.00",
    stock: "In Stock",
    featured: false,
  },
];

function FreshFruitsSection() {
  return (
   <section className="py-8">
  <div className="mx-auto w-[90%] max-w-6xl">

    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#263238]">
        Fresh Fruits
      </h2>

      <div className="mt-2 h-1 w-12 bg-blue-600"></div>
    </div>

   <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
  {freshFruitProducts.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>

  </div>
</section>
  );
}

export default FreshFruitsSection;