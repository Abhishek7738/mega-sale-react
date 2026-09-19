import ProductCard from "./ProductCard";
import products from "../data/products";

const freshFruitProducts = products.filter((product) =>
  ["prod-orange", "prod-banana"].includes(product.id),
);

function FreshFruitsSection() {
  return (
    <section className=" w-full bg-[#f4faf6] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">Fresh Fruits</h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {freshFruitProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FreshFruitsSection;
