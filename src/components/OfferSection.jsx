import { useState } from "react";
import OfferCard from "./OfferCard";

const offers = [
  {
    id: 1,
    discount: "GET 10% OFF",
    condition: "When you spend $20",
    validity: "Valid for 30 days",
    image: "/Offer1.png",
    code: "FASTPR10",
    theme: "orange",
    hoverEffect: true,
  },
  {
    id: 2,
    discount: "GET 10% OFF",
    condition: "When you spend $20",
    validity: "Valid for 30 days",
    image: "/Offer2.png",
    code: "FASTBOGO",
    theme: "blue",
    hoverEffect: true,
  },
  {
    id: 3,
    discount: "GET 10% OFF",
    condition: "When you spend $20",
    validity: "Valid for 30 days",
    image: "/Offer3.png",
    code: "FASTFESTIVE",
    theme: "red",
    hoverEffect: false,
  },
];

function OfferSection() {
  // Clone first and last cards for infinite movement
  const carouselOffers = [
    offers[offers.length - 1],
    ...offers,
    offers[0],
  ];

  // Start at real Card 1
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const goNext = () => {
    if (!isTransitioning) return;

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const goPrevious = () => {
    if (!isTransitioning) return;

    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleTransitionEnd = () => {
    // Clone Card 1 reached
    if (currentIndex === carouselOffers.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }

    // Clone Card 3 reached
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(offers.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  return (
    <section className="w-full py-12">
      <div className="mx-auto w-[90%] max-w-6xl">

        {/* Section Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="whitespace-nowrap text-xl sm:text-2xl font-bold text-gray-900 sm:text-3xl">
              Bank & Wallet Offers
            </h2>

            <div className="mt-2 h-1 w-12 bg-blue-600"></div>
          </div>

          {/* Mobile + Tablet Buttons */}
          <div className="flex shrink-0 gap-3 lg:hidden">
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous offer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm transition-colors duration-200 hover:bg-blue-600 hover:text-white"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next offer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm transition-colors duration-200 hover:bg-blue-600 hover:text-white"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Mobile + Tablet Infinite Carousel */}
        <div className="overflow-hidden lg:hidden">
          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {carouselOffers.map((offer, index) => (
              <div
                key={`${offer.id}-${index}`}
                className="w-full shrink-0"
              >
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Cards */}
        <div className="hidden grid-cols-3 gap-5 lg:grid">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="min-w-0"
            >
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default OfferSection;