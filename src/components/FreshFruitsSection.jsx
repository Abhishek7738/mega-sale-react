import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function FreshFruitsSection() {
  const [freshFruitProducts, setFreshFruitProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?category=vegetables%20%26%20fruits")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch fruit products");
        }
        return response.json();
      })
      .then((data) => {
        setFreshFruitProducts(
          data.filter((product) =>
            ["Organic Oranges", "Nature's Sweet Banana"].includes(product.name)
          )
        );
      })
      .catch((error) => {
        console.error("Fresh fruits error:", error);
        setFreshFruitProducts([]);
      });
  }, []);

  return (
    <section className="w-full bg-[#f4faf6] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">Fresh Fruits</h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {freshFruitProducts.map((product) => (
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

export default FreshFruitsSection;