const deliveryBanners = [
  {
    id: 1,
    image: "/Poster3.png",
    alt: "Safe delivery to the door",
    showButton: true,
    buttonText: "Read More",
    buttonLink: "#",
    aspectRatio: "aspect-[3.23/1]",
  },
  {
    id: 2,
    image: "/Poster4.png",
    alt: "Safe delivery and social distancing",
    showButton: false,
    aspectRatio: "aspect-[1.57/1]",
    mobileAspectRatio: "max-sm:aspect-[2.8/1]",
  },
];

function DeliveryBannersSection() {
  return (
    <section className="w-full py-4 sm:py-5">
      <div className="mx-auto w-[92%] max-w-[1140px]">
        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-[2.05fr_1fr]
            lg:gap-6
          "
        >
          {deliveryBanners.map((banner) => (
            <div
              key={banner.id}
              className={`
                delivery-banner
                relative
                w-full
                overflow-hidden
                rounded-md
                ${banner.aspectRatio}
                ${banner.mobileAspectRatio || ""}
              `}
            >
              {/* Banner Image */}
              <img
                src={banner.image}
                alt={banner.alt}
                loading="lazy"
                className="
                  absolute
                  inset-0
                  block
                  h-full
                  w-full
                  max-w-none
                  object-cover
                "
              />

              {/* Read More Button */}
              {banner.showButton && (
                <a
                  href={banner.buttonLink}
                  className="absolute left-[73%] top-[86%] z-20 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-[#28a6a2] px-4 py-1.5 text-[9px] font-medium leading-none text-white shadow-sm transition-colors duration-300 hover:bg-[#208f8c] sm:left-[70%] sm:top-[84%] sm:px-4 sm:py-1.5 sm:text-[10px] lg:left-[62%] lg:top-[82%] lg:gap-2 lg:px-5 lg:py-2 lg:text-xs"
                >
                  {banner.buttonText}

                  <span className="text-xs leading-none sm:text-sm lg:text-base">
                    →
                  </span>
                </a>
              )}

              {/* One-Time White Flash */}
              <span className="delivery-hover-flash" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DeliveryBannersSection;
