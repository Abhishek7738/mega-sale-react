import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function OrganicVegetablesSection() {
  const [organicVegetableProducts, setOrganicVegetableProducts] =
    useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/products?category=vegetables%20%26%20fruits"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vegetable products");
        }
        return response.json();
      })
      .then((data) => {
  setOrganicVegetableProducts(
    data.filter((product) => product.name !== "Organic Oranges")
  );
})
      .catch((error) => {
        console.error("Organic vegetables error:", error);
        setOrganicVegetableProducts([]);
      });
  }, []);

  return (
    <section className="w-full bg-[#f4faf6] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Organic Vegetables
          </h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {organicVegetableProducts.map((product) => (
            <div key={product._id} className="w-full">
              <ProductCard
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

export default OrganicVegetablesSection;