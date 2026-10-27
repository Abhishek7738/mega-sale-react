import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://localhost:5000";

function Premium() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPremiumProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Premium products load nahi ho paaye.");
        }

        const data = await response.json();

        setProducts(data.filter((product) => product.isPremium === true));
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

    fetchPremiumProducts();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-slate-900">
      {/* Luxury Hero Banner */}
      <section className="relative isolate overflow-hidden bg-[#071426] text-white">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(7,20,38,0.96) 0%, rgba(7,20,38,0.84) 45%, rgba(7,20,38,0.35) 100%), url('/premium-bg.png')",
          }}
        />

        <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border border-[#c8a75b]/20 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-8 -top-12 -z-10 h-64 w-64 rounded-full border border-[#c8a75b]/20 sm:h-96 sm:w-96" />

        <div className="mx-auto grid min-h-[390px] max-w-7xl items-center gap-8 px-5 py-14 sm:min-h-[450px] sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c8a75b]/50 bg-white/5 px-4 py-2">
              <span className="text-[#e3c779]">✦</span>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e3c779]">
                RUROO Exclusive Collection
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A little more
              <span className="block font-serif italic text-[#e3c779]">
                extraordinary.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Discover carefully selected premium products that bring
              exceptional quality, thoughtful design and everyday luxury to your
              shopping experience.
            </p>

            <a
              href="#premium-products"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#c8a75b] px-6 py-3.5 text-sm font-bold text-[#071426] transition hover:bg-[#e3c779] focus:outline-none focus:ring-2 focus:ring-[#e3c779] focus:ring-offset-2 focus:ring-offset-[#071426]"
            >
              Explore Collection
              <span aria-hidden="true">→</span>
            </a>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span>Curated selections</span>
              <span className="text-[#c8a75b]">✦</span>
              <span>Quality you can trust</span>
            </div>
          </div>

          <div className="relative hidden min-h-[270px] items-center justify-center lg:flex">
            <div className="absolute h-64 w-64 rounded-full border border-[#c8a75b]/30" />
            <div className="absolute h-52 w-52 rounded-full border border-[#c8a75b]/20" />

            <div className="relative flex h-44 w-44 rotate-[-8deg] items-center justify-center rounded-2xl border border-[#e3c779]/50 bg-gradient-to-br from-[#d7bd79] via-[#a98742] to-[#6b5125] shadow-2xl shadow-black/40">
              <div className="absolute inset-2 rounded-xl border border-white/30" />
              <div className="text-center text-[#071426]">
                <div className="text-4xl">✦</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.3em]">
                  Premium
                </div>
                <div className="mt-1 text-[10px] tracking-[0.18em]">
                  BY RUROO
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-5 rounded-full border border-[#c8a75b]/30 bg-[#071426]/70 px-4 py-2 text-xs tracking-widest text-[#e3c779]">
              SELECTED FOR YOU
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#c8a75b] to-transparent" />
      </section>

      {/* Premium Product Collection */}
      <section
        id="premium-products"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfd7c5] pb-5 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9a7835]">
              The premium edit
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#102033] sm:text-3xl">
              Premium Collection
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Exceptional picks, all in one place.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full border border-[#d7c69c] bg-white px-4 py-2 text-sm font-medium text-[#725a2a]">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {loading ? (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            aria-label="Loading premium products"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-xl border border-[#eee6d6] bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-700"
          >
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d7c69c] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0df] text-2xl text-[#9a7835]">
              ✦
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#102033]">
              Something special is on its way
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Our premium collection is being curated. Select the Premium
              Product checkbox when adding a product in the Admin Panel to
              feature it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="min-w-0 rounded-xl border border-[#eee6d6] bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c8a75b]/70 hover:shadow-lg sm:p-3"
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

        {!loading && !error && products.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Thoughtfully selected. Made for your everyday.
            </p>
            <div className="mx-auto mt-4 h-px w-24 bg-[#c8a75b]" />
          </div>
        )}
      </section>
    </main>
  );
}

export default Premium;
