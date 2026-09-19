import ProductCard from "./ProductCard";
import products from "../data/products";

const newArrivalsProducts = products.filter((product) =>
  ["prod-ghee"].includes(product.id),
);

function NewArrivalsSection() {
  return (
    <section className="w-full bg-[#fffaf2] py-12">
      <div className="m-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">New Arrivals</h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivalsProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;
