import { useEffect, useState } from "react";

function Categories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(6);

  // ==============================
  // CATEGORY DATA
  // ==============================
  const categories = [
    {
      name: "Electronics",
      items: 0,
      image: "/Electronics.jpg",
    },
    {
      name: "Sports",
      items: 0,
      image: "/Sports.jpg",
    },
    {
      name: "Accessorise",
      items: 0,
      image: "/Accessorise.jpg",
    },
    {
      name: "Fashion",
      items: 0,
      image: "/Fashion.jpg",
    },
    {
      name: "Beauty",
      items: 0,
      image: "/Beauty.jpg",
    },
    {
      name: "Grocery & Food",
      items: 8,
      image: "/Grocery & Foods.jpg",
    },
    {
      name: "Beverages",
      items: 1,
      image: "/Beverages.jpg",
    },
    {
      name: "Vegetables & Fruits",
      items: 8,
      image: "/Vegetables & Fruit.jpg",
    },
  ];

  // ==============================
  // RESPONSIVE VISIBLE CARDS
  // ==============================
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

  // ==============================
  // RESET INDEX AFTER RESIZE
  // ==============================
  useEffect(() => {
    const maxIndex = Math.max(
      categories.length - visibleCards,
      0
    );

    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [visibleCards, currentIndex, categories.length]);

  // ==============================
  // PREVIOUS BUTTON
  // ==============================
  const handlePrevious = () => {
    const maxIndex = Math.max(
      categories.length - visibleCards,
      0
    );

    setCurrentIndex((prev) => {
      if (prev === 0) {
        return maxIndex;
      }

      return prev - 1;
    });
  };

  // ==============================
  // NEXT BUTTON
  // ==============================
  const handleNext = () => {
    const maxIndex = Math.max(
      categories.length - visibleCards,
      0
    );

    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0;
      }

      return prev + 1;
    });
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + visibleCards
  );

  return (
    <section className="w-full py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ==============================
            SECTION HEADER
        ============================== */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">

          <h2 className="text-xl sm:text-2xl font-bold text-[#263238]">
            Shop By Categories
          </h2>

          {/* ==============================
              NAVIGATION BUTTONS
          ============================== */}
          <div className="flex items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous categories"
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-lg
                bg-[#0878df]
                text-white
                text-lg
                hover:bg-[#056bb5]
                active:scale-95
                transition-all duration-200
              "
            >
              ←
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next categories"
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-lg
                bg-[#0878df]
                text-white
                text-lg
                hover:bg-[#056bb5]
                active:scale-95
                transition-all duration-200
              "
            >
              →
            </button>

          </div>
        </div>

        {/* ==============================
            CATEGORY CARDS
        ============================== */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-3
            sm:gap-4
            lg:gap-5
            overflow-hidden
          "
        >
          {visibleCategories.map((category) => (
            <div
              key={category.name}
              className="
                group
                relative
                h-[155px]
                sm:h-[180px]
                lg:h-[200px]
                bg-[#f3f4f6]
                hover:bg-[#dff5f2]
                rounded-xl
                p-4
                overflow-hidden
                transition-all
                duration-300
              "
            >

              {/* ==============================
                  CATEGORY TEXT
              ============================== */}
              <div className="relative z-20">

                <h3
                  className="
                    text-[15px]
                    sm:text-[16px]
                    font-bold
                    leading-5
                    text-[#263238]
                  "
                >
                  {category.name}
                </h3>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  {category.items} items
                </p>

              </div>

              {/* ==============================
                  CATEGORY IMAGE
              ============================== */}
              <div
                className="
                  absolute
                  left-3
                  right-3
                  bottom-3
                  h-[115px]
                  flex
                  items-center
                  justify-center
                  z-10
                  transition-all
                  duration-500
                  ease-out
                  group-hover:-translate-y-4
                "
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    max-w-[90%]
                    max-h-[110px]
                    object-contain
                    mix-blend-multiply
                    transition-transform
                    duration-500
                    ease-out
                  "
                />
              </div>

              {/* ==============================
                  SHOP NOW BUTTON
              ============================== */}
              <button
                type="button"
                className="
                  absolute
                  left-4
                  bottom-[-48px]
                  z-30

                  bg-[#0878df]
                  hover:bg-[#056bb5]

                  text-white
                  text-xs
                  sm:text-sm
                  font-medium

                  px-3
                  sm:px-4
                  py-2

                  rounded-lg

                  opacity-0

                  group-hover:bottom-4
                  group-hover:opacity-100

                  transition-all
                  duration-300
                  ease-out
                "
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