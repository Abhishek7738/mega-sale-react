import { useEffect, useState } from "react";

// Banner data
const banners = [
  {
    id: 1,
    desktopImage: "/Banners1.png",
    mobileImage: "/Banner1-mobile.png",
    alt: "Mega Sale Banner 1",
  },
  {
    id: 2,
    desktopImage: "/Banners2.png",
    mobileImage: "/Banner2-mobile.png",
    alt: "Mega Sale Banner 2",
  },
  {
    id: 3,
    desktopImage: "/Banners3.png",
    mobileImage: "/Banner3-mobile.png",
    alt: "Mega Sale Banner 3",
  },
  {
    id: 4,
    desktopImage: "/Banners4.png",
    mobileImage: "/Banner4-mobile.png",
    alt: "Mega Sale Banner 4",
  },
  {
    id: 5,
    desktopImage: "/Banners5.png",
    mobileImage: "/Banner5-mobile.png",
    alt: "Mega Sale Banner 5",
  },
];

function BannerSection() {
  // Clone last banner at beginning
  // and first banner at the end
  const carouselBanners = [banners[banners.length - 1], ...banners, banners[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const slideWidth = 100 / carouselBanners.length;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      // Do nothing while browser tab is hidden
      if (document.hidden) {
        return;
      }

      setCurrentIndex((prevIndex) => {
        // Never allow the index to go beyond
        // the cloned first banner
        if (prevIndex >= carouselBanners.length - 1) {
          return carouselBanners.length - 1;
        }

        return prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselBanners.length]);

  // Handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < 1 || prevIndex > carouselBanners.length - 1) {
            return 1;
          }

          return prevIndex;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [carouselBanners.length]);

  // Infinite loop reset
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
    currentIndex === carouselBanners.length - 1 ? 0 : currentIndex - 1;

  return (
    <section className="w-full py-8 sm:py-10 lg:py-12">
      {/* Banner viewport */}
      <div className="mx-auto w-[90%] max-w-6xl overflow-hidden rounded-lg sm:rounded-xl">
        {/* Carousel track */}
        <div
          className={`flex ${
            isTransitioning ? "transition-transform duration-500 ease-out" : ""
          }`}
          style={{
            width: `${carouselBanners.length * 100}%`,
            transform: `translateX(-${currentIndex * slideWidth}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselBanners.map((banner, index) => (
            <div
              key={`${banner.id}-${index}`}
              className="w-full shrink-0"
              style={{
                width: `${slideWidth}%`,
              }}
            >
              {/* Responsive image container */}
              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  bg-white
                  sm:aspect-[16/6]
                  md:aspect-[16/5]
                  lg:aspect-[16/4.8]
                "
              >
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet={banner.mobileImage}
                  />

                  <img
                    src={banner.desktopImage}
                    alt={banner.alt}
                    className="
                      block
                      h-auto
                      w-full
                      object-contain
                      object-center
                      sm:h-full
                      sm:object-cover
                    "
                  />
                </picture>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2 sm:mt-4">
        {banners.map((banner, index) => (
          <span
            key={banner.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index ? "w-5 bg-blue-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerSection;
