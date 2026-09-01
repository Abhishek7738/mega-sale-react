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
  return (
    <section className="w-full py-12">
      <div className="mx-auto w-[90%] max-w-6xl">

        {/* Section Heading */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Bank & Wallet Offers
          </h2>

          <div className="mt-2 h-1 w-12 bg-blue-600"></div>
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="min-w-0">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default OfferSection;