function Hero() {
  return (
    <section
      className="w-full h-[405px] bg-cover bg-[position:center_80%]"
      style={{ backgroundImage: "url('/bg_dryfruits.jfif')" }}
    >
      <div className="flex flex-col justify-start pt-[30px] px-[8%]">
        
        <p className="text-[13px] tracking-[3px] text-[#35aeb8] mb-[12px]">
          WEEKEND SPECIAL OFF
        </p>

        <h1 className="text-[36px] leading-tight font-semibold text-[#263238] mb-[14px]">
          PREMIUM QUALITY DRY FRUITS
        </h1>

        <p className="text-[24px] text-[#333] mb-[30px]">
          Dryfruits shopping made Easy
        </p>

        <a
          href="#"
          className="inline-flex items-center gap-2 bg-[#0878df] hover:bg-[#066ac4] text-white px-6 py-3 rounded-[5px] no-underline self-start transition-colors duration-200"
        >
          Shop Now
          <span>→</span>
        </a>

      </div>
    </section>
  );
}

export default Hero;