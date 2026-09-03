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
  // Clone the last and first banner for a seamless infinite carousel
  const carouselBanners = [
    banners[banners.length - 1],
    ...banners,
    banners[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all banner images before showing the carousel
  useEffect(() => {
    const imagePromises = banners.map((banner) => {
      return new Promise((resolve) => {
        const image = new Image();

        image.onload = resolve;
        image.onerror = resolve;

        image.src = banner.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Reset after reaching the cloned first banner
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

  // Calculate which real banner is active
  const activeIndex =
    currentIndex === carouselBanners.length - 1
      ? 0
      : currentIndex - 1;

  // Loading placeholder
  if (!imagesLoaded) {
    return (
      <section className="w-full py-12">
        <div className="mx-auto w-[90%] max-w-6xl">
          <div className="aspect-[3/1] w-full rounded-xl bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="mx-auto w-[90%] max-w-6xl overflow-hidden rounded-xl">
        {/* Banner carousel */}
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
                className="block h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider dots */}
      <div className="mt-4 flex justify-center gap-2">
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