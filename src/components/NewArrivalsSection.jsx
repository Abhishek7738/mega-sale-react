import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function NewArrivalsSection() {
  const [newArrivalsProducts, setNewArrivalsProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }
        return response.json();
      })
      .then((data) => {
        setNewArrivalsProducts(data.slice(-6).reverse());
      })
      .catch((error) => {
        console.error("New arrivals error:", error);
        setNewArrivalsProducts([]);
      });
  }, []);

  return (
    <section className="w-full bg-[#fffaf2] py-12">
      <div className="m-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">New Arrivals</h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivalsProducts.map((product) => (
            <div key={product._id} className="w-full">
              <ProductCard
                id={product._id}
                name={product.name}
                weight={product.weight}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                featured={product.featured}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;
