function TopBar() {
  const offers = [
    {
      text: "Something you love is now on sale",
      action: "Buy Now!",
    },
    {
      text: "Your must-have item is calling",
      action: "Buy Now!",
    },
    {
      text: "Welcome to Megsale! Wrap new offers/gift every single day on Weekends.",
      action: "New Coupon Code: FAST50",
    },
  ];

  return (
    <div className="w-full h-8 bg-[#2563eb] text-white overflow-hidden flex items-center">
      <div className="flex w-max items-center animate-[marquee_60s_linear_infinite]">
        {offers.map((offer, index) => (
          <div
            key={`first-${index}`}
            className="flex items-center justify-center whitespace-nowrap px-8 sm:px-12 text-xs sm:text-sm font-medium h-8"
          >
            <span>{offer.text}</span>

            <span className="ml-1 font-bold">
              {offer.action}
            </span>
          </div>
        ))}

        {offers.map((offer, index) => (
          <div
            key={`second-${index}`}
            className="flex items-center justify-center whitespace-nowrap px-8 sm:px-12 text-xs sm:text-sm font-medium h-8"
          >
            <span>{offer.text}</span>

            <span className="ml-1 font-bold">
              {offer.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopBar;