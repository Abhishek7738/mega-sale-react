import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ThankYouPage() {
  const location = useLocation();
const navigate = useNavigate();
const order = location.state?.order;

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const timer = setTimeout(() => {
    navigate("/", { replace: true });
  }, 5000);

  return () => clearTimeout(timer);
}, [navigate]);

  return (
    <main className="thankyou-page relative min-h-screen overflow-hidden bg-[#fff8f0] px-4 py-8 sm:py-10">
      <style>{`
        .ty-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(2px);
          pointer-events: none;
          animation: tyFloat 6s ease-in-out infinite;
        }

        .ty-orb-one {
          width: 150px;
          height: 150px;
          background: #ffdfbd;
          top: 70px;
          left: -70px;
          opacity: .6;
        }

        .ty-orb-two {
          width: 180px;
          height: 180px;
          background: #ffe8d5;
          right: -80px;
          bottom: 60px;
          opacity: .7;
          animation-delay: -3s;
        }

        .ty-success {
          animation: tyPop .65s cubic-bezier(.18,.89,.32,1.45) both;
        }

        .ty-check {
          stroke-dasharray: 55;
          stroke-dashoffset: 55;
          animation: tyDraw .7s .35s ease forwards;
        }

        .ty-card {
          animation: tyRise .7s .12s ease both;
        }

        .ty-confetti {
          position: absolute;
          top: -20px;
          width: 8px;
          height: 13px;
          border-radius: 3px;
          animation: tyConfetti 3.5s ease-in forwards;
          pointer-events: none;
        }

        .ty-button {
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .ty-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(234, 88, 12, .17);
        }

        @keyframes tyPop {
          0% { transform: scale(.3) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        @keyframes tyDraw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes tyRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes tyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }

        @keyframes tyConfetti {
          0% { transform: translateY(-10px) rotate(0); opacity: 0; }
          10% { opacity: .9; }
          100% { transform: translateY(400px) rotate(600deg); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ty-orb, .ty-success, .ty-check, .ty-card, .ty-confetti {
            animation: none !important;
          }
          .ty-check { stroke-dashoffset: 0; }
          .ty-card { opacity: 1; }
        }
      `}</style>

      <div className="ty-orb ty-orb-one" />
      <div className="ty-orb ty-orb-two" />

      {/* Celebration confetti */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[410px] overflow-hidden">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className="ty-confetti"
            style={{
              left: `${(index * 37 + 7) % 100}%`,
              backgroundColor: [
                "#f97316",
                "#fbbf24",
                "#22c55e",
                "#fb7185",
                "#60a5fa",
              ][index % 5],
              animationDelay: `${(index % 8) * 0.18}s`,
              animationDuration: `${2.7 + (index % 4) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="ty-card relative z-10 mx-auto max-w-2xl">
        {/* Brand */}
        <div className="mb-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-black tracking-tight text-stone-900"
          >
            <span className="text-orange-600">RUROO</span>
            <span className="text-orange-500">MegaSale</span>
          </Link>
        </div>

        {/* Main Card */}
        <section className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(124,45,18,0.09)]">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600" />

          <div className="px-5 py-7 text-center sm:px-8 sm:py-9">
            {/* Animated Success Icon */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-60" />

              <div className="ty-success relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200">
                <svg
                  viewBox="0 0 52 52"
                  className="h-12 w-12"
                  fill="none"
                  aria-label="Order successful"
                >
                  <path
                    className="ty-check"
                    d="M13 27 L22 36 L40 17"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              <i className="fa-solid fa-circle-check" />
              ORDER CONFIRMED
            </div>

            <h1 className="mt-4 text-2xl font-black leading-tight text-stone-900 sm:text-4xl">
              Thank You for
              <span className="mt-1 block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Your Order!
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500 sm:text-base">
              Great choice! Your order has been placed successfully.
              We’re excited to get your fresh picks to you.
            </p>

            {/* Order Details */}
            {order?._id ? (
              <div className="mx-auto mt-6 max-w-sm rounded-xl border border-dashed border-orange-200 bg-orange-50/70 p-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-stone-500">Order ID</span>
                  <span className="break-all text-right text-sm font-bold text-stone-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-orange-100 pt-3">
                  <span className="text-sm text-stone-500">Total Amount</span>
                  <span className="text-lg font-black text-orange-600">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-orange-100 pt-3">
                  <span className="text-sm text-stone-500">Order Status</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700">
                    {order.orderStatus || "Placed"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-6 max-w-sm rounded-xl bg-stone-50 p-3 text-sm text-stone-500">
                Your order confirmation details will appear here after checkout.
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {order?._id && (
                <Link
                  to={`/track-order/${order._id}`}
                  className="ty-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
                >
                  <i className="fa-solid fa-truck-fast" />
                  Track Your Order
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              )}

              <Link
                to="/"
                className="ty-button inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700"
              >
                <i className="fa-solid fa-bag-shopping text-orange-500" />
                Continue Shopping
              </Link>
            </div>

            <p className="mt-5 text-xs text-stone-400">
              <i className="fa-solid fa-heart mr-1 text-orange-400" />
              Thank you for choosing RUROO MegaSale
            </p>
          </div>
        </section>

        {/* Trust Labels */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-stone-500 sm:text-sm">
          <span>
            <i className="fa-solid fa-shield-halved mr-1.5 text-green-600" />
            Secure Checkout
          </span>
          <span>
            <i className="fa-solid fa-box mr-1.5 text-orange-500" />
            Order Tracking
          </span>
          <span>
            <i className="fa-solid fa-headset mr-1.5 text-blue-500" />
            Customer Support
          </span>
        </div>
      </div>
    </main>
  );
}

export default ThankYouPage;
