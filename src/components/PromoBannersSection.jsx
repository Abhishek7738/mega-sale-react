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
    <section className="py-8">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {promoBanners.map((banner) => (
            <div
              key={banner.id}
              className="group relative overflow-hidden rounded-lg"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="h-auto w-full"
              />

              <button
                type="button"
                className="absolute bottom-[12%] left-[7%] rounded-md bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-teal-700"
              >
                Shop Now <span className="ml-2">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromoBannersSection;