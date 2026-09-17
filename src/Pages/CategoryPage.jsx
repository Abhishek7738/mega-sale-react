import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function CategoryPage() {
  const { categoryName } = useParams();

  const formattedCategory = decodeURIComponent(categoryName).replace(
  /-/g,
  " "
);

const categoryProducts = {
  "milk & dairy products": [
    {
      name: "Fresh Milk",
      weight: "1 Litre",
      price: 65,
      oldPrice: 75,
      image: "/Milk.png",
      featured: true,
    },
    {
      name: "Organic Curd",
      weight: "500 g",
      price: 55,
      oldPrice: 65,
      image: "/Dahi.png",
      featured: false,
    },
    {
      name: "Fresh Butter",
      weight: "250 g",
      price: 120,
      oldPrice: 140,
      image: "/Butter.png",
      featured: false,
    },
    {
      name: "Nutritious Ghee",
      weight: "1 kg",
      price: 779,
      oldPrice: 820,
      image: "/Ghee.png",
      featured: true,
    },
  ],

 "vegetables & fruits": [
  {
    name: "Fresh Orange",
    weight: "1 kg",
    price: 99,
    oldPrice: 120,
    image: "/Orange.png",
    featured: true,
  },
  {
    name: "Fresh Onion",
    weight: "1 kg",
    price: 50,
    oldPrice: 65,
    image: "/Onion.png",
    featured: false,
  },
  {
    name: "Fresh Tomato",
    weight: "1 kg",
    price: 60,
    oldPrice: 75,
    image: "/Tomato.png",
    featured: false,
  },
],
  "grocery & food": [
    {
      name: "Fresh Jam",
      weight: "500 g",
      price: 120,
      oldPrice: 145,
      image: "/Jam.png",
      featured: true,
    },
    {
      name: "Grocery Food",
      weight: "1 Pack",
      price: 150,
      oldPrice: 180,
      image: "/Grocery & Food1.png",
      featured: false,
    },
  ],
};

const products =
  categoryProducts[formattedCategory.toLowerCase()] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-blue-600 px-4 py-8 text-white">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="text-3xl font-bold capitalize">
            {formattedCategory}
          </h1>

          <p className="mt-2">
            Explore products from this category
          </p>
        </div>
      </div>

      {/* Products */}
      <main className="mx-auto max-w-[1140px] px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
          Products in  {formattedCategory} 
          </h2>

          <Link
            to="/"
            className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              weight={product.weight}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              featured={product.featured}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;