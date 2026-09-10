import { useEffect, useState } from "react";

const promoBanners = [
  {
    id: 1,
    image: "/icecream.avif",
    title: "Summer Ice Cream",
  },
  {
    id: 2,
    image: "/fruitjuice.webp",
    title: "Fresh Fruit Juice",
  },
  {
    id: 3,
    image: "/freshfruit.webp",
    title: "Fresh Fruit",
  },
  {
    id: 4,
    image: "/healthyfood.avif",
    title: "Eat Healthy Be Healthy",
  },
];

function PromoSection() {
  const carouselBanners = [
    promoBanners[promoBanners.length - 1],
    ...promoBanners,
    promoBanners[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => current + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === carouselBanners.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, carouselBanners.length]);

  return (
    <section className="w-full py-[60px] px-[8%]">
      <div className="overflow-hidden">
        <div
          className={`promo-carousel-track flex gap-[20px] ${
            isTransitioning
              ? "transition-transform duration-700 ease-in-out"
              : ""
          } lg:grid lg:grid-cols-4`}
          style={{
            "--promo-index": currentIndex,
          }}
        >
          {carouselBanners.map((banner, index) => (
            <div
              key={`${banner.id}-${index}`}
            className="promo-banner relative h-[150px] w-full shrink-0 rounded-[10px] bg-cover bg-center shadow-sm md:h-[160px] md:w-[calc(50%-10px)] lg:w-auto first:lg:hidden last:lg:hidden"
              style={{
                backgroundImage: `url('${banner.image}')`,
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-center bg-black/30 px-[20px] py-[15px]">
                <h2 className="text-[18px] font-semibold text-white">
                  {banner.title}
                </h2>

                <a
                  href="#"
                  className="mt-[10px] inline-block w-fit rounded-[5px] bg-[#0787df] px-[12px] py-[6px] text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-[#056bb5]"
                >
                  Shop Now
                </a>

                <span className="promo-hover-flash" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
