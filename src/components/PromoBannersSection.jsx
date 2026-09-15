const promoBanners = [
  {
    id: 1,
    image: "/Poster1.png",
    title: "Chocolate Shake Back in Stock",
  },
  {
    id: 2,
    image: "/Poster2.png",
    title: "Healthy & Fresh Cool Breakfast",
  },
];

function PromoBannersSection() {
  return (
    <section className="custom-promo-section w-full py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-[92%] max-w-[1140px]">
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
          {promoBanners.map((banner) => (
            <div
              key={banner.id}
              className="custom-promo-card group relative overflow-hidden rounded-lg bg-white shadow-sm"
            >
              {/* Banner Image */}
              <img
                src={banner.image}
                alt={banner.title}
                loading="lazy"
                className="custom-promo-image block h-auto w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Shop Now Button */}
              <a
                href="#"
                className="custom-promo-shop-button relative z-40 inline-flex items-center justify-center gap-2 rounded-md bg-[#28a6a2] px-5 py-2.5 text-xs font-semibold leading-none text-white shadow-sm transition-all duration-300 hover:bg-[#208f8c] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#28a6a2] focus:ring-offset-2 md:absolute md:bottom-5 md:left-5"
              >
                Shop Now
                <span
                  className="text-sm leading-none"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>

              {/* White Flash Hover Effect */}
              <span
                className="custom-promo-hover-flash pointer-events-none absolute inset-0 z-30"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromoBannersSection;