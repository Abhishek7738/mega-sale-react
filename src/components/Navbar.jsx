import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productCatalog from "../data/products";

function Navbar() {
  const navigate = useNavigate();
  const {
    cartCount,
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // Search products
  const [searchResults, setSearchResults] = useState([]);

  // Mobile / Tablet main menu
  const [showMenu, setShowMenu] = useState(false);

  // All Categories menu
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const mobileCategoriesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDesktop = categoriesRef.current?.contains(
        event.target,
      );
      const clickedInsideMobile = mobileCategoriesRef.current?.contains(
        event.target,
      );

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }

    fetch(
      `http://localhost:5000/api/products?search=${encodeURIComponent(search)}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setSearchResults([]);
      });
  }, [search]);

  const [selectedCategory, setSelectedCategory] = useState(
    "Milk & Dairy Products",
  );

  // Navigation links inside Menu
  const [showNavMenu, setShowNavMenu] = useState(false);

  // Thunder's Deals..
  const [showDeals, setShowDeals] = useState(false);
  const [dealIndex, setDealIndex] = useState(0);

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
    { name: "Milk & Dairy Products", icon: "fa-bottle-water" },
    { name: "Wines & Soft Drinks", icon: "fa-wine-glass" },
    { name: "Grocery & Staples", icon: "fa-basket-shopping" },
    { name: "Biscuits & Snacks", icon: "fa-cookie-bite" },
    { name: "Frozen Foods", icon: "fa-snowflake" },
    { name: "Daily Breakfast", icon: "fa-bread-slice" },
    { name: "Beverages", icon: "fa-glass-water" },
    { name: "Vegetables & Fruits", icon: "fa-apple-whole" },
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
      id: 101,
      name: "Premium Seafood",
      image: "/Fish.png",
      weight: "10 Pieces",
      rating: "4.8",
      price: "₹ 574.00",
      oldPrice: "₹ 650.00",
      stock: "In Stock",
    },
    {
      id: 102,
      name: "Refreshing Cold Drinks",
      image: "/Soda.png",
      weight: "3 Cans",
      rating: "4.7",
      price: "₹ 278.80",
      oldPrice: "₹ 329.00",
      stock: "Out of Stock",
    },
    {
      id: 103,
      name: "Nutritious Ghee",
      image: "/Ghee.png",
      weight: "1 KG",
      rating: "4.9",
      price: "₹ 779.00",
      oldPrice: "₹ 820.00",
      stock: "In Stock",
    },
  ];
  const currentDeal = thunderDeals[dealIndex];

  const currentQuantity =
    cartItems.find((item) => item.id === currentDeal.id)?.quantity || 0;

  const filteredProducts = searchResults;

  const selectedCategoryProducts = productCatalog
    .filter((product) =>
      product.categories?.includes(selectedCategory.toLowerCase()),
    )
    .slice(0, 4);

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
                src="/RUROO_Logo.png"
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
                  onClick={() => {
                    if (!search.trim()) return;

                    setShowSearchDropdown(false);

                    navigate(
                      `/search?query=${encodeURIComponent(search.trim())}`,
                    );
                  }}
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
                        key={product._id}
                        type="button"
                        onClick={() => {
                          setSearch(product.name);
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
                        {product.name}
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

              <Link
                to="/cart"
                aria-label="Cart"
                className="relative flex h-10 w-11 items-center justify-center border-r border-gray-200 text-gray-600 transition hover:text-blue-600"
              >
                <i className="fa-solid fa-cart-shopping"></i>

                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Account"
                    onClick={() => setShowAccountMenu((current) => !current)}
                    className="flex w-11 xl:w-12 h-10 items-center justify-center text-gray-600 hover:text-blue-600 transition"
                  >
                    <i className="fa-solid fa-user"></i>
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                      <div className="border-b border-gray-100 pb-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "My Account"}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {user?.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowAccountMenu(false);
                        }}
                        className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  aria-label="Account"
                  className="flex w-11 xl:w-12 h-10 items-center justify-center text-gray-600 hover:text-blue-600 transition"
                >
                  <i className="fa-solid fa-user"></i>
                </Link>
              )}
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
            <div ref={categoriesRef} className="relative shrink-0">
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
                <div className="absolute left-0 top-[58px] z-50 flex w-[850px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                  {/* Categories List */}
                  <div className="w-[280px] shrink-0 border-r border-gray-100 bg-white py-3">
                    {allCategoryMenu.map((category) => {
                      const isSelected = selectedCategory === category.name;

                      return (
                        <Link
                          key={category.name}
                          to={`/category/${encodeURIComponent(category.name)}`}
                          onMouseEnter={() =>
                            setSelectedCategory(category.name)
                          }
                          onClick={() => setShowCategories(false)}
                          className={`group relative flex items-center gap-4 overflow-hidden px-6 py-3.5 text-[15px] transition-all duration-300 ${
                            isSelected
                              ? "bg-blue-50 text-blue-600"
                              : "text-[#34506f] hover:bg-blue-50/50 hover:text-blue-600"
                          }`}
                        >
                          <span
                            className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 ${
                              isSelected ? "w-[3px]" : "w-0 group-hover:w-[3px]"
                            }`}
                          ></span>

                          <i
                            className={`fa-solid ${category.icon} w-5 text-center text-lg transition-colors duration-300 ${
                              isSelected
                                ? "text-blue-600"
                                : "text-gray-400 group-hover:text-blue-600"
                            }`}
                          ></i>

                          <span className="relative whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                            {category.name}
                            <span
                              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-blue-600 transition-all duration-300 ease-out ${
                                isSelected ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                            ></span>
                          </span>

                          <i className="fa-solid fa-chevron-right ml-auto text-xs text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600"></i>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Products Preview */}
                  <div className="flex-1 bg-white p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-[#263238]">
                        {selectedCategory}
                      </h3>

                      <Link
                        to={`/category/${encodeURIComponent(selectedCategory)}`}
                        onClick={() => setShowCategories(false)}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                      >
                        View All
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </Link>
                    </div>

                    {selectedCategoryProducts.length > 0 ? (
                      <div className="grid grid-cols-4 gap-4">
                        {selectedCategoryProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/category/${encodeURIComponent(selectedCategory)}`}
                            onClick={() => setShowCategories(false)}
                            className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          >
                            <div className="flex h-[150px] items-center justify-center bg-white p-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div className="px-3 pb-4 text-center">
                              <h4 className="truncate text-sm font-semibold text-gray-800">
                                {product.name}
                              </h4>
                              <p className="mt-1 text-xs text-gray-500">
                                {product.weight}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-blue-600">
                                {product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-[230px] items-center justify-center text-sm text-gray-400">
                        No products available in this category.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <ul className="flex-1 flex items-center justify-center gap-4 xl:gap-7 ml-5 xl:ml-8">
              {navLinks.map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : "#"}
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
                  </Link>
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
                        {thunderDeals[dealIndex].stock}
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
                    ) : currentQuantity === 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(currentDeal);
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
                            decreaseQuantity(currentDeal.id);
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
                          {currentQuantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            increaseQuantity(currentDeal.id);
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

            {/* Category List + Product Preview */}
            {showCategories && (
              <div
                ref={mobileCategoriesRef}
                className="
                  mt-2
                  overflow-hidden
                  rounded-md
                  border
                  border-gray-100
                  bg-gray-50
                "
              >
                <div>
                  {allCategoryMenu.map((category) => {
                    const isSelected = selectedCategory === category.name;

                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`group relative flex w-full items-center gap-3 border-b border-gray-100 px-5 py-3 text-left text-sm transition-all duration-300 last:border-b-0 ${
                          isSelected
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-white hover:text-blue-600"
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 ${
                            isSelected ? "w-[3px]" : "w-0 group-hover:w-[3px]"
                          }`}
                        ></span>

                        <i
                          className={`fa-solid ${category.icon} w-5 text-center transition-colors duration-300 ${
                            isSelected
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-blue-600"
                          }`}
                        ></i>

                        <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">
                          {category.name}
                        </span>

                        <i
                          className={`fa-solid fa-chevron-right text-xs transition-all duration-300 ${
                            isSelected
                              ? "translate-x-1 text-blue-600"
                              : "text-gray-300 group-hover:translate-x-1 group-hover:text-blue-600"
                          }`}
                        ></i>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile / Tablet Product Preview */}
                <div className="border-t border-gray-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="truncate text-base font-bold text-[#263238]">
                      {selectedCategory}
                    </h3>

                    <Link
                      to={`/category/${encodeURIComponent(selectedCategory)}`}
                      onClick={() => {
                        setShowCategories(false);
                        setShowMenu(false);
                      }}
                      className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      View All
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>

                  {selectedCategoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {selectedCategoryProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/category/${encodeURIComponent(selectedCategory)}`}
                          onClick={() => {
                            setShowCategories(false);
                            setShowMenu(false);
                          }}
                          className="group overflow-hidden rounded-lg border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="flex h-24 items-center justify-center bg-white p-2 sm:h-28">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          <div className="px-2 pb-3 text-center">
                            <h4 className="truncate text-xs font-semibold text-gray-800">
                              {product.name}
                            </h4>
                            <p className="mt-1 text-[11px] text-gray-500">
                              {product.weight}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-blue-600">
                              {product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No products available in this category.
                    </div>
                  )}
                </div>
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
                  <Link
                    to={link === "Home" ? "/" : "#"}
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
                  </Link>
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

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex items-center justify-center text-gray-600 transition hover:text-blue-600"
            >
              <i className="fa-solid fa-cart-shopping"></i>

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => setShowAccountMenu((current) => !current)}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  <i className="fa-regular fa-user"></i>
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 bottom-full z-50 mb-2 w-56 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "My Account"}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowAccountMenu(false);
                      }}
                      className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Account"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <i className="fa-regular fa-user"></i>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
