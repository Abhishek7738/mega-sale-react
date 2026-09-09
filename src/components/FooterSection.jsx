import { useState } from "react";

function FooterLink({ children }) {
  return (
    <a
      href="#"
      className="
        group
        relative
        inline-flex
        items-center
        text-[15px]
        text-gray-300
        transition-transform
        duration-200
        hover:translate-x-[13px]
      "
    >
      {/* Blue dot */}
      <span
        className="
          absolute
          -left-[13px]
          top-1/2
          h-1
          w-1
          -translate-y-1/2
          rounded-full
          bg-blue-500
          opacity-0
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      />

      {/* Smooth underline */}
      <span
        className="
          relative
          inline-block
          after:absolute
          after:bottom-[-4px]
          after:left-0
          after:h-[2px]
          after:w-full
          after:origin-left
          after:scale-x-0
          after:rounded-full
          after:bg-blue-500
          after:transition-transform
          after:duration-300
          after:ease-out
          group-hover:after:scale-x-100
        "
      >
        {children}
      </span>
    </a>
  );
}

function FooterSection() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return (
    <footer className="w-full bg-[#001b1b]">
      <div className="mx-auto w-[90%] max-w-6xl pt-10 pb-4 sm:pt-12 sm:pb-5">
        {/* ================= COMPANY ================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Company */}
          <div>
            <img
              src="/download.svg"
              alt="Megsale"
              className="mb-4 h-10 w-auto"
            />

            <p className="max-w-xs text-sm leading-6 text-gray-300">
              Discover convenience redefined at Megsale. From fresh groceries to
              the latest fashion trends, find everything you need under one
              roof. Your one-stop shopping destination for a diverse range of
              products.
            </p>

            <p className="mt-6 flex gap-3 text-sm leading-5 text-gray-300">
              <i className="fa-regular fa-building mt-1"></i>

              <span>
                Office No FF 15 Anaya Business Centre, Panderasara, Althan,
                Surat, Gujarat 394210
              </span>
            </p>

            <p className="mt-4 flex items-center gap-3 text-sm text-gray-300">
              <i className="fa-regular fa-envelope"></i>

              <span>megsale.admin@gmail.com</span>
            </p>
          </div>

          {/* ================= CATEGORIES ================= */}
          <div>
            {/* Mobile heading */}
            <button
              type="button"
              onClick={() => toggleSection("categories")}
              className="flex w-full items-center justify-between text-base font-semibold text-white lg:hidden"
            >
              <span>Categories</span>

              <i
                className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                  openSection === "categories" ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {/* Desktop heading */}
            <h3 className="mb-4 hidden text-base font-semibold text-white lg:block">
              Categories
            </h3>

            {/* Links */}
            <ul
              className={`mt-4 space-y-2 ${
                openSection === "categories" ? "block" : "hidden"
              } lg:mt-0 lg:block`}
            >
              <li>
                <FooterLink>Grocery & Staples</FooterLink>
              </li>

              <li>
                <FooterLink>Biscuits & Snacks</FooterLink>
              </li>

              <li>
                <FooterLink>Frozen Foods</FooterLink>
              </li>

              <li>
                <FooterLink>Daily Breakfast</FooterLink>
              </li>

              <li>
                <FooterLink>Beverages</FooterLink>
              </li>

              <li>
                <FooterLink>Vegetables & Fruits</FooterLink>
              </li>
            </ul>
          </div>

          {/* ================= USEFUL LINKS ================= */}
          <div>
            {/* Mobile heading */}
            <button
              type="button"
              onClick={() => toggleSection("useful")}
              className="flex w-full items-center justify-between text-base font-semibold text-white lg:hidden"
            >
              <span>Useful Links</span>

              <i
                className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                  openSection === "useful" ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {/* Desktop heading */}
            <h3 className="mb-4 hidden text-base font-semibold text-white lg:block">
              Useful Links
            </h3>

            {/* Links */}
            <ul
              className={`mt-4 space-y-2 ${
                openSection === "useful" ? "block" : "hidden"
              } lg:mt-0 lg:block`}
            >
              <li>
                <FooterLink>Home</FooterLink>
              </li>

              <li>
                <FooterLink>Collections</FooterLink>
              </li>

              <li>
                <FooterLink>About Us</FooterLink>
              </li>

              <li>
                <FooterLink>Blogs</FooterLink>
              </li>

              <li>
                <FooterLink>Offers</FooterLink>
              </li>

              <li>
                <FooterLink>Search</FooterLink>
              </li>
            </ul>
          </div>

          {/* ================= HELP CENTER ================= */}
          <div>
            {/* Mobile heading */}
            <button
              type="button"
              onClick={() => toggleSection("help")}
              className="flex w-full items-center justify-between text-base font-semibold text-white lg:hidden"
            >
              <span>Help Center</span>

              <i
                className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {/* Desktop heading */}
            <h3 className="mb-4 hidden text-base font-semibold text-white lg:block">
              Help Center
            </h3>

            {/* Links */}
            <ul
              className={`mt-4 space-y-2 ${
                openSection === "help" ? "block" : "hidden"
              } lg:mt-0 lg:block`}
            >
              <li>
                <FooterLink>My Account</FooterLink>
              </li>

              <li>
                <FooterLink>My Orders</FooterLink>
              </li>

              <li>
                <FooterLink>Wishlist</FooterLink>
              </li>

              <li>
                <FooterLink>Compare</FooterLink>
              </li>

              <li>
                <FooterLink>FAQ's</FooterLink>
              </li>

              <li>
                <FooterLink>Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          {/* ================= CONTACT US ================= */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-5">
              {/* Hotline */}
              <div className="flex gap-3">
                <i className="fa-solid fa-phone mt-1 text-lg text-gray-300"></i>

                <div>
                  <p className="text-sm text-gray-300">Hotline 24/7:</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    +918469461557
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-700"></div>

              {/* Email */}
              <div className="flex gap-3">
                <i className="fa-regular fa-envelope mt-1 text-lg text-gray-300"></i>

                <div>
                  <p className="text-sm text-gray-300">Email Address:</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    megsale.admin@gmail.com
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-700"></div>

              {/* Download App */}
              <div>
                <p className="text-sm text-gray-300">Download App:</p>

                <div className="mt-3 flex gap-2">
                  {/* Google Play */}
                  <a
                    href="#"
                    aria-label="Download on Google Play"
                    className="block h-10 w-[130px] shrink-0"
                  >
                    <img
                      src="/app-store.jpeg.png"
                      alt="Get it on Google Play"
                      className="h-full w-full object-fill"
                    />
                  </a>

                  {/* App Store */}
                  <a
                    href="#"
                    aria-label="Download on the App Store"
                    className="block h-10 w-[130px] shrink-0"
                  >
                    <img
                      src="/app-store-logo.png.svg"
                      alt="Download on the App Store"
                      className="h-full w-full object-fill"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN DIVIDER ================= */}
        <div className="mt-8 border-t border-dashed border-gray-700"></div>

        {/* ================= FOOTER BOTTOM ================= */}
        <div className="flex min-h-[72px] flex-col justify-center gap-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <p>© 2026 Megsale. All rights reserved.</p>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-[66px] items-center justify-center rounded-sm bg-white px-2 text-[10px] font-semibold text-gray-600">
              PayPal
            </span>

            <span className="flex h-8 w-[66px] items-center justify-center rounded-sm bg-white px-2 text-[10px] font-semibold text-gray-600">
              VISA
            </span>

            <span className="flex h-8 w-[66px] items-center justify-center rounded-sm bg-white px-2 text-[10px] font-semibold text-gray-600">
              Mastercard
            </span>

            <span className="flex h-8 w-[66px] items-center justify-center rounded-sm bg-white px-2 text-[10px] font-semibold text-gray-600">
              stripe
            </span>

            <span className="flex h-8 w-[66px] items-center justify-center rounded-sm bg-white px-2 text-[9px] font-semibold text-gray-600">
              AMERICAN
              <br />
              EXPRESS
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="mr-1">Stay connected:</span>

            <a
              href="#"
              aria-label="Facebook"
              className="inline-flex items-center justify-center text-gray-300 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex items-center justify-center text-gray-300 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="inline-flex items-center justify-center text-gray-300 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>

            <a
              href="#"
              aria-label="Pinterest"
              className="inline-flex items-center justify-center text-gray-300 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <i className="fa-brands fa-pinterest"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
