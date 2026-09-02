import { useEffect, useState } from "react";

// Banner data
const banners = [
  {
    id: 1,
    image: "/Banner1.png",
    alt: "Mega Sale Banner 1",
  },
  {
    id: 2,
    image: "/Banner2.png",
    alt: "Mega Sale Banner 2",
  },
  {
    id: 3,
    image: "/Banner3.png",
    alt: "Mega Sale Banner 3",
  },
  {
    id: 4,
    image: "/Banner4.png",
    alt: "Mega Sale Banner 4",
  },
  {
    id: 5,
    image: "/Banner5.png",
    alt: "Mega Sale Banner 5",
  },
];

function BannerSection() {
  const carouselBanners = [
    banners[banners.length - 1],
    ...banners,
    banners[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Reset after the cloned first banner
  const handleTransitionEnd = () => {
    if (currentIndex === carouselBanners.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Active dot
  const activeIndex =
    currentIndex === carouselBanners.length - 1
      ? 0
      : currentIndex - 1;

  return (
    <section className="w-full pt-2 py-6">
      {/* <div className="mx-auto w-[90%] max-w-5xl overflow-hidden rounded-xl sm:w-[80%] lg:w-[70%]"> */}
      <div className="mx-auto w-[90%] max-w-6xl overflow-hidden rounded-xl">
        <div
          className={`flex ${
            isTransitioning
              ? "transition-transform duration-500 ease-out"
              : ""
          }`}
          style={{
         transform: `translateX(-${currentIndex * 100}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselBanners.map((banner, index) => (
            <div
              key={`${banner.id}-${index}`}
              className="w-full shrink-0"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="block aspect-[3/1] h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {banners.map((banner, index) => (
          <span
            key={banner.id}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-5 bg-blue-600"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerSection;