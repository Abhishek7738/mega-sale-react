import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function TopSellingSection() {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setTopSellingProducts(data.slice(0, 3));
      })
      .catch((error) => {
        console.error("Top selling products error:", error);
        setTopSellingProducts([]);
      });
  }, []);

  return (
    <section className="w-full bg-[#f4faf6] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Top Selling Items
          </h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topSellingProducts.map((product) => (
            <ProductCard
              key={product._id}
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

export default TopSellingSection;