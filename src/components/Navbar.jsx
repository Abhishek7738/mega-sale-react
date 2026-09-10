import { useState } from "react";

function Navbar() {
  const [search, setSearch] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Mobile / Tablet main menu
  const [showMenu, setShowMenu] = useState(false);

  // All Categories menu
  const [showCategories, setShowCategories] = useState(false);

  // Navigation links inside Menu
  const [showNavMenu, setShowNavMenu] = useState(false);

  // Thunder's Deals..
  const [showDeals, setShowDeals] = useState(false);
  const [dealIndex, setDealIndex] = useState(0);
  const [cartQuantities, setCartQuantities] = useState({});

  // Search products
  const products = ["Almonds", "Cashews", "Pistachios", "Walnuts"];

  // Main navigation links
  const navLinks = [
    "Home",
    "About Us",
    "Category",
    "Premium",
    "New Launch",
    "Wholesale",
    "Free Product*",
    "Contact",
  ];

  // All Categories
  const allCategoryMenu = [
    "Milk & Dairy Products",
    "Wines & Soft Drinks",
    "Grocery & Staples",
    "Biscuits & Snacks",
    "Frozen Foods",
    "Daily Breakfast",
    "Beverages",
    "Vegetables & Fruits",
  ];

  // Top category select
  const categories = [
    "All Category",
    "Electronics",
    "Sports",
    "Accessories",
    "Fashion",
    "Beauty",
    "Furniture",
    "Meats & Seafood",
    "Pet Shop",
    "Milk & Dairy Products",
    "Wines & Soft Drinks",
    "Grocery & Staples",
    "Biscuits & Snacks",
    "Frozen Foods",
    "Daily Breakfast",
    "Beverages",
    "Vegetables & Fruits",
  ];

  // Thunder Deals Products
  const thunderDeals = [
    {
      id: 1,
      name: "Premium Seafood",
      image: "/Fish.png",
      weight: "10 Pieces",
      rating: "4.8",
      price: "₹ 574.00",
      oldPrice: "₹ 650.00",
      stock: "In Stock",
    },
    {
      id: 2,
      name: "Refreshing Cold Drinks",
      image: "/Soda.png",
      weight: "3 Cans",
      rating: "4.7",
      price: "₹ 278.80",
      oldPrice: "₹ 329.00",
      stock: "Out of Stock",
    },
    {
      id: 3,
      name: "Nutritious Ghee",
      image: "/Ghee.png",
      weight: "1 KG",
      rating: "4.9",
      price: "₹ 779.00",
      oldPrice: "₹ 820.00",
      stock: "In Stock",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      {/* =====================================================
          ROW 1
      ====================================================== */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 min-h-[68px] lg:min-h-[82px]">
            {/* Logo */}
            <div className="w-[105px] sm:w-[125px] lg:w-[145px] shrink-0">
              <img
                src="/download.svg"
                alt="MegaSale Logo"
                className="w-full h-auto"
              />
            </div>

            {/* Category Select - Tablet/Desktop */}
            <div className="hidden md:block shrink-0">
              <select
                className="
                  h-[46px]
                  lg:h-[51px]
                  w-[145px]
                  lg:w-[180px]
                  rounded-md
                  border border-gray-300
                  bg-white
                  px-3
                  lg:px-4
                  text-[13px]
                  lg:text-[15px]
                  text-gray-700
                  outline-none
                  cursor-pointer
                  focus:border-blue-500
                "
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <div className="flex h-[46px] lg:h-[51px]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => {
                    if (search.trim() !== "") {
                      setShowSearchDropdown(true);
                    }
                  }}
                  placeholder="I'm searching for..."
                  className="
                    w-full
                    min-w-0
                    rounded-l-md
                    border border-gray-300
                    px-3
                    sm:px-4
                    text-[13px]
                    sm:text-[14px]
                    lg:text-[15px]
                    text-gray-700
                    outline-none
                    focus:border-blue-500
                  "
                />

                <button
                  type="button"
                  className="
                    w-[48px]
                    sm:w-[55px]
                    lg:w-[62px]
                    shrink-0
                    bg-[#ff9d2e]
                    text-white
                    rounded-r-md
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:bg-[#f28c16]
                  "
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown && search.trim() !== "" && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    mt-2
                    bg-white
                    border
                    border-gray-200
                    rounded-lg
                    shadow-xl
                    overflow-hidden
                    z-50
                  "
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <button
                        key={product}
                        type="button"
                        onClick={() => {
                          setSearch(product);
                          setShowSearchDropdown(false);
                        }}
                        className="
                          block
                          w-full
                          px-4
                          py-3
                          text-left
                          text-sm
                          text-gray-700
                          hover:bg-gray-50
                          hover:text-blue-600
                          transition
                        "
                      >
                        {product}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No Products found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center shrink-0">
              <button
                aria-label="Phone"
                className="w-11 xl:w-12 h-10 border-r border-gray-200 text-gray-600 hover:text-blue-600 transition"
              >
                <i className="fa-solid fa-phone"></i>
              </button>

              <button
                aria-label="Wishlist"
                className="w-11 xl:w-12 h-10 border-r border-gray-200 text-gray-600 hover:text-blue-600 transition"
              >
                <i className="fa-regular fa-heart"></i>
              </button>

              <button
                aria-label="Cart"
                className="w-11 xl:w-12 h-10 border-r border-gray-200 text-gray-600 hover:text-blue-600 transition"
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </button>

              <button
                aria-label="Account"
                className="w-11 xl:w-12 h-10 text-gray-600 hover:text-blue-600 transition"
              >
                <i className="fa-regular fa-user"></i>
              </button>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Open menu"
              aria-expanded={showMenu}
              className="
                lg:hidden
                w-10
                h-10
                shrink-0
                rounded-md
                text-gray-700
                hover:bg-gray-100
                hover:text-blue-600
                transition
              "
            >
              <i
                className={
                  showMenu
                    ? "fa-solid fa-xmark text-xl"
                    : "fa-solid fa-bars text-lg"
                }
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ROW 2 - DESKTOP ONLY
      ====================================================== */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center min-h-[70px]">
            {/* All Categories */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowCategories(!showCategories);
                  setShowNavMenu(false);
                }}
                className="
                  h-[52px]
                  w-[202px]
                  rounded-md
                  bg-blue-600
                  text-white
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-4
                  transition-all
                  duration-300
                  hover:bg-blue-700
                "
              >
                <i className="fa-solid fa-bars"></i>

                <span>All Categories</span>

                <i
                  className={`fa-solid ${
                    showCategories ? "fa-chevron-up" : "fa-chevron-down"
                  } text-xs`}
                ></i>
              </button>

              {/* Desktop Category Dropdown */}
              {showCategories && (
                <div
                  className="
                    absolute
                    left-0
                    top-[58px]
                    w-[300px]
                    bg-white
                    rounded-lg
                    shadow-xl
                    border
                    border-gray-100
                    py-3
                    z-50
                  "
                >
                  {allCategoryMenu.map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="
                        group
                        relative
                        flex
                        items-center
                        gap-4
                        px-6
                        py-3
                        text-[15px]
                        text-[#34506f]
                        overflow-hidden
                      "
                    >
                      {/* Smooth left line */}
                      <span
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          w-0
                          bg-blue-600
                          transition-all
                          duration-300
                          ease-out
                          group-hover:w-[3px]
                        "
                      ></span>

                      <i
                        className="
                          fa-solid
                          fa-leaf
                          text-gray-400
                          group-hover:text-blue-600
                          transition-colors
                          duration-300
                        "
                      ></i>

                      <span
                        className="
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:text-blue-600
                        "
                      >
                        {category}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <ul className="flex-1 flex items-center justify-center gap-4 xl:gap-7 ml-5 xl:ml-8">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="
                      group
                      relative
                      block
                      whitespace-nowrap
                      py-4
                      text-[13px]
                      xl:text-[15px]
                      font-medium
                      text-gray-700
                      hover:text-blue-600
                      transition-colors
                      duration-300
                    "
                  >
                    {link}

                    {/* Smooth underline */}
                    <span
                      className="
                        absolute
                        left-0
                        bottom-1
                        h-[2px]
                        w-0
                        bg-blue-600
                        rounded-full
                        transition-all
                        duration-300
                        ease-out
                        group-hover:w-full
                      "
                    ></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Thunder Button */}
            <button
              type="button"
              aria-label="Deals"
              onClick={() => {
                setShowDeals(true);
                setDealIndex(0);
              }}
              className="
                w-[50px]
                xl:w-[54px]
                h-[46px]
                shrink-0
                rounded-md
                bg-blue-50
                text-blue-600
                text-xl
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:bg-blue-600
                hover:text-white
                hover:scale-105
              "
            >
              <i className="fa-solid fa-bolt"></i>
            </button>
          </div>
        </div>
      </div>

      {showDeals && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDeals(false)}
              aria-label="Close Thunder Deals"
              className="
          absolute
          right-4
          top-4
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-gray-100
          text-gray-600
          transition-colors
          duration-200
          hover:bg-gray-200
          hover:text-gray-900
        "
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Heading */}
            <h2 className="pr-10 text-center text-xl font-bold text-[#263238] sm:text-2xl">
              ⚡ Today's Thunder Deals
            </h2>

            {/* Carousel */}
            <div className="relative mt-6 flex items-center justify-center">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() =>
                  setDealIndex(
                    (current) =>
                      (current - 1 + thunderDeals.length) % thunderDeals.length,
                  )
                }
                aria-label="Previous deal"
                className="
            absolute
            left-0
            z-10
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-md
            transition-all
            duration-200
            hover:scale-105
            hover:bg-blue-700
            sm:left-2
          "
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {/* Product Card */}
              <div className="w-full max-w-sm px-10 sm:px-14">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                  {/* Product Image */}
                  <div className="flex h-48 items-center justify-center bg-white">
                    <img
                      src={thunderDeals[dealIndex].image}
                      alt={thunderDeals[dealIndex].name}
                      className="h-full w-full object-contain p-4"
                    />
                  </div>

                  {/* Product Information */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      {thunderDeals[dealIndex].name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {thunderDeals[dealIndex].weight}
                    </p>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <span className="text-amber-400">
                        ⭐ {thunderDeals[dealIndex].rating}
                      </span>

                      <span
                        className={
                          thunderDeals[dealIndex].stock === "In Stock"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        .{thunderDeals[dealIndex].stock}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold text-blue-600">
                        {thunderDeals[dealIndex].price}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        {thunderDeals[dealIndex].oldPrice}
                      </span>
                    </div>

                    {/* Add To Cart */}
                    {thunderDeals[dealIndex].stock === "Out of Stock" ? (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-lg bg-gray-200 py-2 text-sm font-semibold text-gray-500"
                      >
                        Out of Stock
                      </button>
                    ) : (cartQuantities[thunderDeals[dealIndex].id] || 0) ===
                      0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const productId = thunderDeals[dealIndex].id;

                          setCartQuantities((current) => ({
                            ...current,
                            [productId]: 1,
                          }));
                        }}
                        className="
      mt-4
      w-full
      rounded-md
      bg-blue-600
      py-2.5
      text-sm
      font-semibold
      text-white
      transition-colors
      duration-200
      hover:bg-blue-700
    "
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="mt-4 flex h-10 w-full items-center overflow-hidden rounded-md border border-blue-600">
                        <button
                          type="button"
                          onClick={() => {
                            const productId = thunderDeals[dealIndex].id;

                            setCartQuantities((current) => {
                              const quantity = current[productId] || 0;

                              if (quantity <= 1) {
                                const updated = { ...current };
                                delete updated[productId];
                                return updated;
                              }

                              return {
                                ...current,
                                [productId]: quantity - 1,
                              };
                            });
                          }}
                          aria-label="Decrease quantity"
                          className="
        flex
        h-full
        flex-1
        items-center
        justify-center
        bg-gray-100
        text-lg
        font-semibold
        text-gray-700
        transition-colors
        hover:bg-gray-200
      "
                        >
                          −
                        </button>

                        <span className="flex h-full flex-1 items-center justify-center text-sm font-semibold text-gray-800">
                          {cartQuantities[thunderDeals[dealIndex].id]}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const productId = thunderDeals[dealIndex].id;

                            setCartQuantities((current) => ({
                              ...current,
                              [productId]: (current[productId] || 0) + 1,
                            }));
                          }}
                          aria-label="Increase quantity"
                          className="
        flex
        h-full
        flex-1
        items-center
        justify-center
        bg-blue-600
        text-lg
        font-semibold
        text-white
        transition-colors
        hover:bg-blue-700
      "
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() =>
                  setDealIndex((current) => (current + 1) % thunderDeals.length)
                }
                aria-label="Next deal"
                className="
            absolute
            right-0
            z-10
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-md
            transition-all
            duration-200
            hover:scale-105
            hover:bg-blue-700
            sm:right-2
          "
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TABLET / MOBILE MENU
      ====================================================== */}
      {showMenu && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          {/* ============================================
              ALL CATEGORIES BUTTON
          ============================================= */}
          <div className="p-4 pb-2">
            <button
              type="button"
              onClick={() => {
                setShowCategories((current) => !current);
                setShowNavMenu(false);
              }}
              className="
                w-full
                h-[48px]
                rounded-md
                bg-blue-600
                text-white
                font-semibold
                flex
                items-center
                justify-between
                px-5
                transition-all
                duration-300
                hover:bg-blue-700
              "
            >
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-bars"></i>
                <span>All Categories</span>
              </span>

              <i
                className={`fa-solid ${
                  showCategories ? "fa-chevron-up" : "fa-chevron-down"
                } text-xs`}
              ></i>
            </button>

            {/* Category List */}
            {showCategories && (
              <div
                className="
                  mt-2
                  border
                  border-gray-100
                  rounded-md
                  overflow-hidden
                  bg-gray-50
                "
              >
                {allCategoryMenu.map((category) => (
                  <a
                    key={category}
                    href="#"
                    className="
                      group
                      relative
                      flex
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      text-gray-700
                      border-b
                      border-gray-100
                      last:border-b-0
                      hover:bg-white
                      hover:text-blue-600
                      transition-all
                      duration-300
                    "
                  >
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-0
                        bg-blue-600
                        transition-all
                        duration-300
                        group-hover:w-[3px]
                      "
                    ></span>

                    <i className="fa-solid fa-leaf text-gray-400 group-hover:text-blue-600"></i>

                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {category}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ============================================
              SEPARATE NAV MENU BUTTON
          ============================================= */}
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={() => {
                setShowNavMenu(!showNavMenu);
                setShowCategories(false);
              }}
              className="
                w-full
                h-[48px]
                flex
                items-center
                justify-between
                px-5
                rounded-md
                border
                border-gray-200
                bg-white
                text-gray-700
                font-semibold
                hover:bg-gray-50
                hover:text-blue-600
                transition-all
                duration-300
              "
            >
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-bars"></i>
                <span>Menu</span>
              </span>

              <i
                className={`fa-solid ${
                  showNavMenu ? "fa-chevron-up" : "fa-chevron-down"
                } text-xs`}
              ></i>
            </button>
          </div>

          {/* ============================================
              NAV LINKS - ONLY AFTER MENU CLICK
          ============================================= */}
          {showNavMenu && (
            <ul className="mx-4 mb-2 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={() => setShowMenu(false)}
                    className="
                      group
                      relative
                      block
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-gray-700
                      border-b
                      border-gray-100
                      last:border-b-0
                      hover:bg-white
                      hover:text-blue-600
                      transition-all
                      duration-300
                    "
                  >
                    {/* Animated left line */}
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-0
                        bg-blue-600
                        transition-all
                        duration-300
                        group-hover:w-[3px]
                      "
                    ></span>

                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* ============================================
              MOBILE / TABLET ICONS
          ============================================= */}
          <div className="flex items-center justify-around py-4 border-t border-gray-100">
            <button
              aria-label="Phone"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <i className="fa-solid fa-phone"></i>
            </button>

            <button
              aria-label="Wishlist"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <i className="fa-regular fa-heart"></i>
            </button>

            <button
              aria-label="Cart"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </button>

            <button
              aria-label="Account"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <i className="fa-regular fa-user"></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
