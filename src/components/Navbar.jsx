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

  // Search products
  const products = [
    "Almonds",
    "Cashews",
    "Pistachios",
    "Walnuts",
  ];

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

  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(search.toLowerCase())
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
                onClick={() => setShowCategories(!showCategories)}
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
                    showCategories
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
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
              onClick={() => setShowCategories(!showCategories)}
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
                  showCategories
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
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
              onClick={() => setShowNavMenu(!showNavMenu)}
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
                  showNavMenu
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
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