import ProductCard from "./ProductCard";
import products from "../data/products";

const bestSellerProducts = products.filter((product) =>
  ["prod-seafood", "prod-cold-drinks"].includes(product.id),
);

function BestSellersSection() {
  return (
    <section className="w-full bg-[#f0f7ff] py-12">
      <div className="m-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Our Best Sellers
          </h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellerProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellersSection;