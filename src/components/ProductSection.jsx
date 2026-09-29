import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function ProductSection() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <section className="w-full bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-8 sm:px-6 md:px-8 lg:px-0">
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
      </div>
    </section>
  );
}

export default ProductSection;
