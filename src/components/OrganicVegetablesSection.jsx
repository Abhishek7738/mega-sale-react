import ProductCard from "./ProductCard";
const organicVegetableProducts = [
  {
    id: 1,
    name: "Gourmet Organic",
    image: "/Cabbage.png",
    weight: "1 KG",
    price: "₹ 246.00",
    oldPrice: "₹ 275.00",
    stock: "In Stock",
    featured: false,
  }, {
    id: 2,
    name: "Premium Organic",
    image: "/Onion.png",
    weight: "3 KG",
    price: "₹ 811.00",
    oldPrice: "₹ 820.00",
    stock: "In Stock",
    featured: false,
  },
   {
    id: 3,
    name: "Fresh Capsicum",
    image: "/Capsicum.png",
    weight: "1 KG",
    price: "₹ 311.00",
    oldPrice: "₹ 320.00",
    stock: "In Stock",
    featured: false,
  },{
    id: 4,
    name: "Fresh Tomato",
    image: "/Tomato.png",
    weight: "1 KG",
    price: "₹ 101.00",
    oldPrice: "₹ 120.00",
    stock: "In Stock",
    featured: false,
  },
];

function OrganicVegetablesSection() {
  return (
            <section className="py-8">
                  <div className="mx-auto w-[90%] max-w-6xl">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">
            Organic Vegetables
          </h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {organicVegetableProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

      </div>
  </section>
  );
  
}
export default OrganicVegetablesSection;
