import React from "react";

const OfferCard = ({ offer }) => {
  const hoverColor = {
    orange: "bg-[#ffb52e]",
    blue: "bg-[#1689e8]",
    red: "bg-[#ff4b4b]",
  };

  return (
    <div
      className={`group w-full overflow-hidden rounded-[15px] ${
        offer.hoverEffect ? "cursor-pointer" : ""
      }`}
    >
      {/* Offer Image */}
      <div className="w-full overflow-hidden">
        <img
          src={offer.image}
          alt={offer.discount}
          className="block w-full object-cover"
        />
      </div>

      {/* Bottom Code Bar */}
      <div
        className={`
          flex min-h-[64px] items-center justify-between
          px-5
          ${
            offer.theme === "orange" &&
            "bg-gradient-to-r from-[#ffab1f] to-[#ff5545]"
          }
          ${
            offer.theme === "blue" &&
            "bg-gradient-to-r from-[#2399e9] to-[#45aef5]"
          }
          ${
            offer.theme === "red" &&
            "bg-gradient-to-r from-[#c90035] to-[#ff4c4c]"
          }
        `}
      >
        {/* Code */}
        <div className="text-[16px] text-white">
          Code :{" "}
          <strong className="ml-1 font-bold">
            {offer.code}
          </strong>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          className="
            relative
            overflow-hidden
            rounded-[7px]
            bg-white/15
            px-5
            py-[9px]
            text-[15px]
            font-bold
            text-white
          "
        >
          {/* Hover Color Layer */}
          {offer.hoverEffect && (
            <span
              className={`
                absolute
                inset-0
                origin-top
                scale-y-0
                transition-transform
                duration-300
                ease-out
                group-hover:scale-y-100
                ${hoverColor[offer.theme]}
              `}
            />
          )}

          {/* Button Text */}
          <span className="relative z-10">
            Copy Code
          </span>
        </button>
      </div>
    </div>
  );
};

export default OfferCard;