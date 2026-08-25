import {useEffect, useState } from "react";

function Categories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(6);
 useEffect(() => {
  const updateVisibleCards = () => {
    if (window.innerWidth < 640) {
      setVisibleCards(2);
    } else if (window.innerWidth < 768) {
      setVisibleCards(3);
    } else if (window.innerWidth < 1024) {
      setVisibleCards(4);
    } else {
      setVisibleCards(6);
    }
  };

  updateVisibleCards();

  window.addEventListener("resize", updateVisibleCards);

  return () => {
    window.removeEventListener("resize", updateVisibleCards);
  };
}, []);

  const categories = [
    { name: "Electronics", items: 0, image: "/Electronics.jpg" },
    { name: "Sports", items: 0, image: "/Sports.jpg" },
    { name: "Accessorise", items: 0, image: "/Accessorise.jpg" },
    { name: "Fashion", items: 0, image: "/Fashion.jpg" },
    { name: "Beauty", items: 0, image: "/Beauty.jpg" },
    { name: "Grocery & Food", items: 8, image: "/Grocery & Foods.jpg" },
    { name: "Beverages", items: 1, image: "/Beverages.jpg" },
    { name: "Vegetables & Fruits", items: 8, image: "/Vegetables & Fruit.jpg" },
  ];

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
       
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop By Categories</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              disabled={currentIndex === 0}
              className="w-10 h-10 flex items-center justify-center
                         bg-gray-200 rounded-lg
                         disabled:opacity-40"
            >
              ←
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={currentIndex >= categories.length - visibleCards}
              className="w-10 h-10 flex items-center justify-center
                         bg-blue-600 text-white rounded-lg
                         disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 overflow-hidden">
          {categories.slice(currentIndex, currentIndex + visibleCards).map((category) => (
            <div
              key={category.name}
              className=" group relative h-48 bg-gray-100
                            hover:bg-[#dff5f2]
                           rounded-xl p-4 overflow-hidden
                           transition-all duration-300"
            >
              <div className="h-14 relative z-20">
                <h3 className="text-lg font-bold leading-6">{category.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {category.items} items
                </p>
              </div>

              <div className="h-28 flex items-center justify-center relative z-10 transition-all duration-500 ease-out group-hover:-translate-y-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="max-w-full max-h-28 object-contain mix-blend-multiply transition-all duration-500 ease-out
                  group-hover:scale-100"
                />
              </div>

              <button
                className="absolute left-4 bottom-[-50px] z-30
                             bg-blue-600 text-white px-4 py-2
                             rounded-lg transition-all duration-300
                             ease-in-out
                             group-hover:bottom-4"
              >
                Shop Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
