import { useEffect, useState } from "react";

// Blog data
const featuredBlogs = [
  {
    id: 1,
    image: "/Blog1.png",
    date: "31/8/2023 8:29 am",
    title:
      "Mastering the Art of Efficient Grocery Shopping: Expert Tips and Tricks",
    pinned: false,
  },
  {
    id: 2,
    image: "/Blog2.png",
    date: "31/8/2023 8:37 am",
    title: "Nourishing from Within: A Journey to Feed Your Cells and Soul",
    pinned: false,
  },
  {
    id: 3,
    image: "/Blog3.png",
    date: "31/8/2023 8:34 am",
    title: "Fresh and Flavorsome: Decoding the World of Groceries",
    pinned: true,
  },
  {
    id: 4,
    image: "/Blog4.png",
    date: "31/8/2023 8:31 am",
    title: "Beyond the Basket: The Artistry of Grocery Curation",
    pinned: false,
  },
  {
    id: 5,
    image: "/Blog5.png",
    date: "31/8/2023 8:27 am",
    title: "Garden to Plate: Celebrating the Wonder of Farm Fresh Produce",
    pinned: false,
  },
];

// Add clone 5 at beginning and clone 1 at end
const carouselBlogs = [
  featuredBlogs[featuredBlogs.length - 1],
  ...featuredBlogs,
  featuredBlogs[0],
];

function FeaturedBlogSection() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Turn animation back on after an invisible reset
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  return (
    <section className="py-8">
      <div className="mx-auto w-[90%] max-w-[1140px]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#263238]">Featured Blog</h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        {/* Carousel window */}
        <div className="relative w-full overflow-hidden">
          {/* Carousel track */}
          <div
            className={`flex gap-4 ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(calc(-${currentIndex} * ${
                window.innerWidth >= 1024
                  ? "calc(50% + 0.5rem)"
                  : "calc(100% + 1rem)"
              }))`,
            }}
            onTransitionEnd={() => {
              // Clone 1 -> real Blog 1
              if (currentIndex === carouselBlogs.length - 1) {
                setIsTransitioning(false);
                setCurrentIndex(1);
              }

              // Clone 5 -> real Blog 5
              if (currentIndex === 0) {
                setIsTransitioning(false);
                setCurrentIndex(featuredBlogs.length);
              }
            }}
          >
            {carouselBlogs.map((blog, index) => (
              <div
                key={`${blog.id}-${index}`}
                className="relative w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white lg:w-[calc(50%-0.5rem)]"
              >
                {/* Pin icon */}
                {blog.pinned && (
                  <div className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
                    <i className="fa-solid fa-thumbtack"></i>
                  </div>
                )}

                {/* Blog image */}
                <div className="overflow-hidden">
                  <div className="transition-transform duration-300 ease-in-out hover:scale-[1.2] hover:rotate-[3deg]">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="aspect-[1.8/1] h-auto w-full object-cover"
                    />
                  </div>
                </div>

                {/* Blog information */}
                <div className="px-4 py-4">
                  <p className="text-sm text-gray-500">{blog.date}</p>

                  <h3 className="mt-3 text-sm font-medium text-gray-600">
                    {blog.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Previous button */}
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => index - 1)}
            className="
              absolute
              left-2
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              text-lg
              text-gray-700
              shadow-md
            "
            aria-label="Previous blog"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => index + 1)}
            className="
              absolute
              right-2
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              text-lg
              text-gray-700
              shadow-md
            "
            aria-label="Next blog"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBlogSection;
