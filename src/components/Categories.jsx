import { useEffect, useState } from "react";

const categories = [
  {
    name: "Electronics",
    image: "/Electronics1.png",
  },
  {
    name: "Sports",
    image: "/Sports1.png",
  },
  {
    name: "Accessorise",
    image: "/Accessorise1.jpg",
  },
  {
    name: "Fashion",
    image: "/Fashion1.png",
  },
  {
    name: "Beauty",
    image: "/Beauty.png",
  },
  {
    name: "Grocery & Food",
    image: "/Grocery & Food1.png",
  },
  {
    name: "Beverages",
    image: "/Beverages1.png",
  },
  {
    name: "Vegetables & Fruits",
    image: "/Vegetables & Fruits1.png",
  },
];

const getVisibleCards = () => {
  if (typeof window === "undefined") return 6;

  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 1024) return 4;

  return 6;
};

const Categories = () => {
  const [visibleCards, setVisibleCards] = useState(() =>
    getVisibleCards()
  );

  const [currentIndex, setCurrentIndex] = useState(categories.length);

  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  /*
    Three copies of categories:

    Copy 1: 1 to 8
    Copy 2: 1 to 8
    Copy 3: 1 to 8
  */
  const clonedCategories = [
    ...categories,
    ...categories,
    ...categories,
  ];

  /*
    Responsive cards:
    Mobile  = 2
    Tablet  = 4
    Desktop = 6
  */
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCards = getVisibleCards();

      setVisibleCards((previousVisibleCards) => {
        if (previousVisibleCards !== newVisibleCards) {
          setIsTransitionEnabled(false);
          setCurrentIndex(categories.length);

          return newVisibleCards;
        }

        return previousVisibleCards;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /*
    Enable transition again after silent reset
  */
  useEffect(() => {
    if (!isTransitionEnabled) {
      const frame = requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitionEnabled]);

  /*
    Move one card forward safely
  */
  const handleNext = () => {
    if (currentIndex >= categories.length * 2) return;

    setCurrentIndex((previousIndex) => previousIndex + 1);
  };

  /*
    Move one card backward safely
  */
  const handlePrev = () => {
    if (currentIndex <= 0) return;

    setCurrentIndex((previousIndex) => previousIndex - 1);
  };

  /*
    Infinite carousel reset
  */
  const handleTransitionEnd = () => {
    /*
      Third copy reached:
      Jump silently to second copy
    */
    if (currentIndex >= categories.length * 2) {
      setIsTransitionEnabled(false);
      setCurrentIndex(categories.length);
    }

    /*
      First copy reached:
      Jump silently to second copy
    */
    if (currentIndex <= 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(categories.length);
    }
  };

  return (
    <section className="w-full py-8">
      {/* Section Container */}
      <div className="mx-auto w-full max-w-[1168px] px-4">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Shop By Categories
            </h2>

            <div className="mt-2 h-1 w-20 rounded-full bg-blue-600" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous categories"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-md transition duration-300 hover:bg-blue-600 hover:text-white"
            >
              <i className="fa-solid fa-chevron-left text-sm" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next categories"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition duration-300 hover:bg-white hover:text-blue-600"
            >
              <i className="fa-solid fa-chevron-right text-sm" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="w-full overflow-hidden">
          {/* Carousel Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex ${
              isTransitionEnabled
                ? "transition-transform duration-300 ease-out"
                : ""
            }`}
            style={{
              width: `${(clonedCategories.length / visibleCards) * 100}%`,
              transform: `translate3d(-${
                (currentIndex * 100) / clonedCategories.length
              }%, 0, 0)`,
            }}
          >
            {clonedCategories.map((category, index) => (
              <div
                key={`${category.name}-${index}`}
                className="shrink-0 px-1.5 sm:px-2"
                style={{
                  width: `${100 / clonedCategories.length}%`,
                  flex: `0 0 ${100 / clonedCategories.length}%`,
                }}
              >
                {/* Category Card */}
                <div className="group relative h-[220px] overflow-hidden rounded-xl bg-white p-4 shadow-md transition duration-300 hover:bg-[#dff5f2]">
                  {/* Category Image */}
                  <div className="flex h-[130px] items-center justify-center transition duration-300 group-hover:-translate-y-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="mt-4 text-center text-base font-semibold text-gray-800 transition-opacity duration-200 group-hover:opacity-0">
                    {category.name}
                  </h3>

                  {/* Shop Now Button */}
                  <button
                    type="button"
                    className="absolute bottom-[-45px] left-1/2 z-20 min-w-[105px] -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:bottom-4 group-hover:opacity-100"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;