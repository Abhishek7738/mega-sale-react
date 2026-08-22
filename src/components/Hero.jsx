function Hero() {
  return (
    <section
      className="w-full h-[405px] bg-cover bg-[position:center_80%]"
      style={{ backgroundImage: "url('/bg_dryfruits.jfif')" }}
    >
      <div className="flex flex-col justify-start pt-[30px]  px-[8%]">
        <p className="text-[13px] tracking-[3px] text-[#35aeb8] mb-[12px]">WEEKEND SPEACIAL OFF</p>

        <h1 className="text-[36px] font-semibold text-[#263238] mb-[12px]">
            PREMIUM QUALITY DRY FRUITS
        </h1>
        <p className="text-[24px] text-[#333] mb-[30px]">Dryfruits shopping made Easy</p>

         <a href="#" className="inline-flex items-center gap-[8px] bg-[#0878df] text-white px-[24px] py-[12px] rounded-[5px] no-underline self-start">Shop Now
        <span>→</span>
      </a>
      </div>

     
    </section>
  );
}
export default Hero;
