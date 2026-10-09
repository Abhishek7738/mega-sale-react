import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function BreakfastDairySection() {
  const [breakfastDairyProducts, setBreakfastDairyProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch breakfast and dairy products");
        }
        return response.json();
      })
      .then((data) => {
        const productNames = [
          "Pure Cow Ghee",
          "Fresh Milk",
          "Fresh Dahi",
          "Fresh Butter",
          "Fresh Bread",
          "Mixed Fruit Jam",
        ];

        setBreakfastDairyProducts(
          productNames
            .map((name) => data.find((product) => product.name === name))
            .filter(Boolean),
        );
      })
      .catch((error) => {
        console.error("Breakfast & Dairy error:", error);
        setBreakfastDairyProducts([]);
      });
  }, []);

  return (
    <section className="w-full bg-[#fffaf2] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Breakfast & Dairy
          </h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {breakfastDairyProducts.map((product) => (
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

export default BreakfastDairySection;
