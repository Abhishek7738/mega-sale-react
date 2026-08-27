import { useState } from "react";

function Navbar() {
  // Stores whatever the user types into the search box
  const [search, setSearch] = useState("");

  // Controls whether search suggestions are visible
  const [showDropdown, setShowDropdown] = useState(false);

  // Controls whether the mobile navigation is open
  const [showMenu, setShowMenu] = useState(false);

  // Temporary product data for our search functionality
  const products = ["Almonds", "Cashews", "Pistachios", "Walnuts"];

  // Client-required navigation
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

  // Filter products according to the search text
  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        {/* Logo */}
        <div className="w-32 shrink-0 sm:w-36">
          <img
            src="/download.svg"
            alt="MegaSale Logo"
            className="h-auto w-full"
          />
        </div>

        {/* Desktop Search */}
        <div className="relative order-3 w-full lg:order-0 lg:flex-1 lg:mx-6">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (search.trim() !== "") {
                setShowDropdown(true);
              }
            }}
            className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2 pr-11 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search Products..."
          />

          {/* Search Icon */}
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"></i>

          {/* Search Dropdown */}
          {showDropdown && search.trim() !== "" && (
            <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product}
                    type="button"
                    onClick={() => {
                      setSearch(product);
                      setShowDropdown(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-700 transition duration-200 hover:bg-gray-50 hover:text-blue-600"
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

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="group relative block whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:text-blue-600"
              >
                {link}

                {/* Animated underline */}
                <span className="absolute bottom-0 left-2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-[calc(100%-1rem)]"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Icons */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href="#"
            aria-label="Wishlist"
            className="text-lg text-gray-700 transition duration-200 hover:scale-110 hover:text-blue-600"
          >
            <i className="fa-regular fa-bookmark"></i>
          </a>

          <a
            href="#"
            aria-label="Shopping cart"
            className="text-lg text-gray-700 transition duration-200 hover:scale-110 hover:text-blue-600"
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </a>

          <a
            href="#"
            aria-label="Account"
            className="text-lg text-gray-700 transition duration-200 hover:scale-110 hover:text-blue-600"
          >
            <i className="fa-regular fa-circle-user"></i>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle navigation menu"
          aria-expanded={showMenu}
          className="rounded-lg p-2 text-xl text-gray-700 transition duration-200 hover:bg-gray-100 hover:text-blue-600 lg:hidden"
        >
          <i
            className={showMenu ? "fa-solid fa-xmark" : "fa-solid fa-bars"}
          ></i>
        </button>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="order-4 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg lg:hidden">
            <ul className="flex flex-col py-2">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={() => setShowMenu(false)}
                    className="block border-b border-gray-100 px-5 py-3 text-sm font-medium text-gray-700 transition duration-200 last:border-b-0 hover:bg-gray-50 hover:pl-7 hover:text-blue-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
