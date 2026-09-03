import ProductCard from "./ProductCard";
const breakfastDairyProducts = [
  {
    id: 1,
    name: "Nutritious Ghee",
    weight: "1 KG",
    price: "779.00",
    oldPrice: "820.00",
    image: "/Ghee.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 2,
    name: "Fresh Milk",
    weight: "1 L",
    price: "68.00",
    oldPrice: "75.00",
    image: "/Milk.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 3,
    name: "Fresh Dahi",
    weight: "500 GM",
    price: "55.00",
    oldPrice: "65.00",
    image: "/Dahi.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 4,
    name: "Fresh Bread",
    weight: "400 GM",
    price: "45.00",
    oldPrice: "50.00",
    image: "/Bread.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id: 5,
    name: "Premium Butter",
    weight: "500 GM",
    price: "120.00",
    oldPrice: "135.00",
    image: "/Butter.png",
    stock: "In Stock",
    featured: false,
  },
  {
    id:6,
    name:"Fresh Mix Fruit Jam",
    weight:"500 GM",
    price:"150.00",
    oldPrice:"175.00",
    image:"/Jam.png",
    stock:"In Stock",
    featured: false,
  }

];
function BreakfastDairySection() {
  return (
    <section>
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Breakfast & Dairy
          </h2>
          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>
        <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {breakfastDairyProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default BreakfastDairySection;
