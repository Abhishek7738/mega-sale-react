function PromoSection() {
  return (
    <section className="w-full py-[60px] px-[8%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <div
          className="h-[150px] md:h-[160px] lg:h-[150px] rounded-[10px] bg-cover bg-center relative shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          style={{ backgroundImage: "url('/icecream.avif')" }}
        >
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300 flex flex-col justify-center px-[20px] py-[15px]">
            <h2 className="text-[18px] font-semibold text-white">
              Summer Ice Cream
            </h2>
            <a
              href="#"
              className="inline-block bg-[#0787df] text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px] mt-[10px] w-fit hover:bg-[#056bb5] transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>

        <div
          className="h-[150px] md:h-[160px] lg:h-[150px] rounded-[10px] bg-cover bg-center relative shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          style={{ backgroundImage: "url('/fruitjuice.webp')" }}
        >
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300 flex flex-col justify-center px-[20px] py-[15px]">
            <h2 className="text-[18px] font-semibold text-white">
              Fresh Fruit Juice
            </h2>

            <a
              href="#"
              className="inline-block bg-[#0787df] text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px] mt-[10px] w-fit hover:bg-[#056bb5] transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
        <div
          className="h-[150px] md:h-[160px] lg:h-[150px] rounded-[10px] bg-cover bg-center relative shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          style={{ backgroundImage: "url('/freshfruit.webp')" }}
        >
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300 flex flex-col justify-center px-[20px] py-[15px]">
            <h2 className="text-[18px] font-semibold text-white">
              Fresh Fruit
            </h2>

            <a
              href="#"
              className="inline-block bg-[#0787df] text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px] mt-[10px] w-fit hover:bg-[#056bb5] transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
        <div
          className="h-[150px] md:h-[160px] lg:h-[150px] rounded-[10px] bg-cover bg-center relative shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          style={{ backgroundImage: "url('/healthyfood.avif')" }}
        >
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300 flex flex-col justify-center px-[20px] py-[15px]">
            <h2 className="text-[18px] font-semibold text-white">
              Eat Healthy Be Healthy
            </h2>

            <a
              href="#"
              className="inline-block bg-[#0787df] text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px] mt-[10px] w-fit hover:bg-[#056bb5] transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export default PromoSection;
