import ProductCard from "./ProductCard";
import products from "../data/products";

const breakfastDairyProducts = products.filter((product) =>
  [
    "prod-ghee",
    "prod-milk",
    "prod-dahi",
    "prod-bread",
    "prod-butter",
    "prod-mix-fruit-jam",
  ].includes(product.id),
);
function BreakfastDairySection() {
  return (
    <section className="w-full bg-[#fffaf2] py-12">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Breakfast & Dairy
          </h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>
        <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {breakfastDairyProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default BreakfastDairySection;
