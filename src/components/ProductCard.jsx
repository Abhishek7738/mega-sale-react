function ProductCard() {
  return (
    <div className="group w-full max-w-[280px] overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      
      {/* Product Image */}
      <div className="relative flex h-[260px] items-center justify-center bg-white">
        
        {/* Featured Badge */}
        <div className="absolute left-0 top-4 z-10 bg-amber-400 px-4 py-2 text-sm font-semibold text-white">
          Featured
        </div>

        {/* Product Image */}
        <img
          src="/Vegetables & Fruit.jpg"
          alt="Organic Oranges"
          className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Actions */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-3 overflow-hidden rounded-lg bg-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="flex h-10 w-12 items-center justify-center border-r border-gray-200 text-gray-600 hover:text-blue-600"
            title="View"
          >
            <i class="fa-solid fa-eye"></i>
            
          </button>

          <button
            type="button"
            className="flex h-10 w-12 items-center justify-center border-r border-gray-200 text-gray-600 hover:text-blue-600"
            title="Compare"
          >
            <i class="fa-solid fa-rotate"></i>
          </button>

          <button
            type="button"
            className="flex h-10 w-12 items-center justify-center text-gray-600 hover:text-red-500"
            title="Wishlist"
          >
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="px-3 pb-4">
        <h3 className="truncate text-base font-semibold text-gray-900">
          Organic Oranges
        </h3>

        <p className="mt-1 text-sm text-gray-700">
          1 KG
        </p>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-blue-600">
            ₹ 228.78
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹ 246.00
          </span>
        </div>

        {/* Rating + Stock */}
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="tracking-wide text-amber-400">
             <i className="fa-regular fa-star"></i>
             <i className="fa-regular fa-star"></i>
             <i className="fa-regular fa-star"></i>
             <i className="fa-regular fa-star"></i>
             <i className="fa-regular fa-star"></i>
          </span>

          <span className="text-blue-600">
            In Stock
          </span>
        </div>

        {/* Add */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Add
          </span>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xl text-white transition-colors hover:bg-blue-700"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;