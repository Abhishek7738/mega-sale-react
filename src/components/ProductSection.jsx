import ProductCard from "./ProductCard";

function ProductSection() {
  const products = [
    {
      id: 1,
      name: "Organic Oranges",
      weight: "1 KG",
      price: "₹ 228.78",
      oldPrice: "₹ 246.00",
      image: "/Orange.png",
      featured: true,
    },
    {
      id: 2,
      name: "Gourmet Organic",
      weight: "1 KG",
      price: "₹ 246.00",
      oldPrice: "",
      image: "/Cabbage.png",
      featured: false,
    },
    {
      id: 3,
      name: "Premium Organic",
      weight: "3 KG",
      price: "₹ 811.80",
      oldPrice: "₹ 820.00",
      image: "/Onion.png",
      featured: false,
    },
    {
      id: 4,
      name: "Fresh Capsicum",
      weight: "1 KG",
      price: "₹ 311.60",
      oldPrice: "₹ 328.00",
      image: "/Capsicum.png",
      featured: false,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1140px] px-4 py-8 sm:px-6 md:px-8 lg:px-0">
      {/* Section Heading */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Fruits &amp; Vegetables
        </h2>

      <div className="mt-2 h-[4px] w-16 rounded-full bg-blue-600" />
      </div>

      {/* Product Grid */}
      <div className="grid w-full grid-cols-1 justify-items-center gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-start">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            weight={product.weight}
            price={product.price}
            oldPrice={product.oldPrice}
            image={product.image}
            featured={product.featured}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
