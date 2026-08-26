import { useState } from "react";

function Navbar() {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const products = ["Almonds", "Cashews", "Pistachios", "Walnuts"];

  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <nav className="w-full relative">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap  md:flex-nowrap items-center justify-between gap-y-2 relative">
        {/* Logo */}
        <div className="w-36">
          <img
            src="/download.svg"
            alt="Megasale Logo"
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden text-2xl"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Search */}
       <div className="w-full md:flex-1 relative mx-1 md:mx-4 mt-3 md:mt-0 order-3 md:order-0">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full h-10 border rounded-md px-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Search Products..."
          />

          {/* Search Icon */}
          <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2"></i>

          {/* Dropdown */}
          {showDropdown && search.trim() !== "" && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-md z-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product}
                    onClick={() => {
                      setSearch(product);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {product}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No Products found</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
      <ul className="hidden md:flex flex-none items-center justify-center gap-4 list-none whitespace-nowrap">
          <li>
            <a
              href="#"
              className="text-gray-700 no-underline px-2 py-2 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-700 no-underline px-2 py-2 hover:text-blue-600 transition-colors duration-200"
            >
              Collection
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-700 no-underline px-2 py-2 hover:text-blue-600 transition-colors duration-200"
            >
              Blog
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-700 no-underline px-2 py-2 hover:text-blue-600 transition-colors duration-200"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-700 no-underline px-2 py-2 whitespace-nowrap hover:text-blue-600 transition-colors duration-200"
            >
              Contact Us
            </a>
          </li>
        </ul>
        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50">
            <ul className="hidden md:flex items-center justify-center gap-3  list-none whitespace-nowrap">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Collection
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* Icons */}
        <div className="hidden md:flex items-center gap-3 ml-2 shrink-0 whitespace-nowrap">
          <a href="#" className="text-gray-700 text-xl hover:text-blue-600">
            <i className="fa-regular fa-bookmark"></i>
          </a>

          <a href="#" className="text-gray-700 text-xl hover:text-blue-600">
            <i className="fa-solid fa-cart-shopping"></i>
          </a>

          <a href="#" className="text-gray-700 text-xl hover:text-blue-600">
            <i className="fa-regular fa-circle-user"></i>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
