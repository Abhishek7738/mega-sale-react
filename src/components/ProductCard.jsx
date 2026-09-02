function ProductCard({ name, weight, price, oldPrice, image, featured }) {
  return (
    <div className="group w-full overflow-hidden rounded-xl bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Product Image */}
      <div className="relative flex h-[145px] items-center justify-center bg-white">
        {/* Featured Badge */}
        {featured && (
           <div className="absolute left-0 top-2 z-10 bg-amber-400 px-3 py-1.5 text-xs font-semibold text-white after:absolute after:right-[-14px] after:top-0 after:border-y-[14px] after:border-l-[14px] after:border-y-transparent after:border-l-amber-400 after:content-['']">
            Featured
          </div>
        )}

        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Actions */}
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 translate-y-3 overflow-hidden rounded-lg bg-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="flex h-9 w-11 items-center justify-center border-r border-gray-200 text-gray-600 hover:text-blue-600"
            title="View"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            type="button"
            className="flex h-9 w-11 items-center justify-center border-r border-gray-200 text-gray-600 hover:text-blue-600"
            title="Compare"
          >
            <i className="fa-solid fa-rotate"></i>
          </button>

          <button
            type="button"
            className="flex h-9 w-11 items-center justify-center text-gray-600 hover:text-red-500"
            title="Wishlist"
          >
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="px-3 pb-3">
        {/* Product Name */}
        <h3 className="truncate text-[15px] font-semibold text-gray-900">
          {name}
        </h3>

        {/* Weight */}
        <p className="mt-1 text-xs text-gray-700">{weight}</p>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-600">{price}</span>

          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {oldPrice}
            </span>
          )}
        </div>

        {/* Rating + Stock */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className="tracking-wide text-amber-400">
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </span>

          <span className="text-blue-600">In Stock</span>
        </div>

        {/* Add */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-700">Add</span>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-lg text-white transition-colors hover:bg-blue-700"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
