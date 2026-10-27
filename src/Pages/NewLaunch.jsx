import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://localhost:5000";

function NewLaunch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNewLaunchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("New Launch products load nahi ho paaye.");
        }

        const data = await response.json();

        setProducts(data.filter((product) => product.isNewLaunch === true));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchNewLaunchProducts();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-slate-900">
      {/* New Launch Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#071426] via-[#123b70] to-[#1769aa] text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-12 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-10 lg:px-12">
          {/* Left: Hero content */}
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full border border-cyan-300/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              ✦ Just Arrived at RUROO
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Meet the
              <span className="block text-cyan-300">New Arrivals.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              Discover our latest additions, fresh finds and exciting products
              selected just for you.
            </p>

            <a
              href="#new-launch-products"
              className="mt-7 inline-flex items-center gap-3 rounded-lg bg-cyan-300 px-6 py-3 font-bold text-[#071426] transition hover:bg-white"
            >
              Explore New Launches <span>→</span>
            </a>

            {/* Feature highlights */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl text-cyan-300">✧</span>
                <span>
                  Fresh &amp; Latest
                  <br />
                  Products
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl text-cyan-300">✓</span>
                <span>
                  Quality
                  <br />
                  Assured
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl text-cyan-300">↗</span>
                <span>
                  Great Value
                  <br />
                  Every Day
                </span>
              </div>
            </div>
          </div>

          {/* Right: Product showcase image */}
          <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center lg:max-w-none lg:scale-110">
            <div className="absolute inset-8 rounded-full bg-cyan-400/30 blur-3xl" />

            <img
              src="/new-launch-products.png"
              alt="RUROO new launch products"
              className="relative z-10 h-auto max-h-[440px] w-full object-contain drop-shadow-2xl sm:max-h-[420px] lg:max-h-[460px] [mask-image:radial-gradient(ellipse_at_center,black_48%,transparent_78%)]"
            />

            <div className="absolute right-2 top-3 z-20 rotate-6 rounded-xl border border-cyan-100/40 bg-cyan-300 px-4 py-2 text-center font-extrabold text-[#071426] shadow-lg sm:right-5 sm:top-5">
              NEW
              <br />
              LAUNCH
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection */}
      <section
        id="new-launch-products"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Fresh on the shelf
            </p>

            <h2 className="text-2xl font-bold text-[#102033] sm:text-3xl">
              New Launch Collection
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Be among the first to discover something new.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {loading ? (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            aria-label="Loading new launch products"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center text-red-700"
          >
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              ✨
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#102033]">
              Something New Is Coming!
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Our latest products will appear here soon. Select the New Launch
              checkbox when adding or editing a product in the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="min-w-0 rounded-xl border border-blue-100 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:p-3"
              >
                <ProductCard
                  name={product.name}
                  weight={product.weight}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={
                    product.image?.startsWith("/uploads/")
                      ? `${API_BASE}${product.image}`
                      : product.image
                  }
                  featured={product.featured}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NewLaunch;
