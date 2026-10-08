import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        login(data.user);

        console.log("Login successful");

        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-[#fffaf4] px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div
        className="
          relative mx-auto
          flex w-full max-w-[1450px]
          overflow-hidden rounded-[24px]
          bg-white
          shadow-[0_20px_60px_rgba(120,53,15,0.14)]
          lg:grid lg:grid-cols-[54%_46%]
        "
      >
        {/* =====================================================
            LEFT IMAGE PANEL
        ====================================================== */}

        <section className="relative hidden min-h-[520px] overflow-hidden lg:block">
          {/* Background image */}
          <div
            className="
              absolute inset-0
              bg-cover bg-center
              animate-login-image
            "
            style={{
              backgroundImage: "url('/login-bg.png')",
            }}
          />

          {/* Orange overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9a3412]/80 via-[#ea580c]/35 to-[#f97316]/10" />

          {/* Bottom dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#7c2d12]/75 via-transparent to-transparent" />

          {/* Decorative circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/20 animate-float-slow" />

          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full border border-white/15 animate-float-reverse" />

          <div className="absolute right-16 top-16 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

          {/* Content */}
          <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 xl:p-10">
            {/* Logo */}
            <div className="animate-fade-down">
              <div className="inline-flex rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur-sm">
                <img
                  src="/RUROO_Logo.png"
                  alt="RUROO"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-50">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Main content */}
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <i className="fa-solid fa-sparkles" />
                Welcome to MegaSale
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white xl:text-5xl">
                Good food.
                <br />
                Great deals.
                <br />
                <span className="text-orange-200">One place.</span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-orange-50 xl:text-base">
                Discover fresh products, everyday essentials and exciting deals
                — all in one convenient shopping experience.
              </p>

              {/* Benefits */}
              <div className="mt-6 grid max-w-lg grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <i className="fa-solid fa-truck-fast text-lg text-white" />

                  <p className="mt-2 text-[11px] font-bold text-white">
                    Fast Delivery
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <i className="fa-solid fa-tags text-lg text-white" />

                  <p className="mt-2 text-[11px] font-bold text-white">
                    Best Deals
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <i className="fa-solid fa-leaf text-lg text-white" />

                  <p className="mt-2 text-[11px] font-bold text-white">
                    Fresh Products
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-xs text-orange-50 animate-fade-up-delay">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <i className="fa-solid fa-shield-halved" />
              </span>

              <span className="font-medium">Secure shopping experience</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-14">
          <div className="w-full max-w-[430px]">
            {/* Mobile Logo */}
            <div className="mb-6 text-center lg:hidden">
              <div className="mx-auto inline-flex rounded-2xl bg-[#fff7ed] px-5 py-3 shadow-sm">
                <img
                  src="/RUROO_Logo.png"
                  alt="RUROO"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Heading */}
            <div className="mb-6 animate-fade-up">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <i className="fa-solid fa-user text-base" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-stone-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-5 text-stone-500">
                Login to your MegaSale account and continue shopping.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-shake">
                <i className="fa-solid fa-circle-exclamation mt-0.5" />

                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-bold text-stone-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <i className="fa-regular fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="
                      h-12 w-full rounded-xl
                      border border-stone-200
                      bg-stone-50
                      pl-11 pr-4
                      text-sm text-stone-900
                      outline-none
                      transition-all duration-200
                      placeholder:text-stone-400
                      hover:border-orange-200
                      focus:border-orange-500
                      focus:bg-white
                      focus:ring-4 focus:ring-orange-500/10
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-stone-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="
                      h-12 w-full rounded-xl
                      border border-stone-200
                      bg-stone-50
                      pl-11 pr-12
                      text-sm text-stone-900
                      outline-none
                      transition-all duration-200
                      placeholder:text-stone-400
                      hover:border-orange-200
                      focus:border-orange-500
                      focus:bg-white
                      focus:ring-4 focus:ring-orange-500/10
                    "
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((current) => !current)}
                    className="
                      absolute right-2 top-1/2
                      flex h-9 w-9
                      -translate-y-1/2
                      items-center justify-center
                      rounded-lg
                      text-stone-400
                      transition
                      hover:bg-orange-50
                      hover:text-orange-600
                    "
                  >
                    <i
                      className={
                        showPassword
                          ? "fa-regular fa-eye-slash"
                          : "fa-regular fa-eye"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="mb-5 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 accent-orange-500"
                  />

                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-orange-600 transition hover:text-orange-700 sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group flex h-12 w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-orange-500
                  px-4
                  text-sm font-bold text-white
                  shadow-lg shadow-orange-500/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-xl
                  hover:shadow-orange-500/25
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  disabled:hover:translate-y-0
                "
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Signup */}
            <p className="mt-5 text-center text-sm text-stone-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-orange-600 transition hover:text-orange-700"
              >
                Create Account
              </Link>
            </p>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <i className="fa-solid fa-lock" />

              <span>Your information is securely protected</span>
            </div>

            {/* Services */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-[#fffaf4] px-2 py-2.5 text-center">
                <i className="fa-solid fa-truck-fast text-sm text-orange-500" />

                <span className="text-[9px] font-semibold text-stone-500">
                  Fast Delivery
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 rounded-xl bg-[#fffaf4] px-2 py-2.5 text-center">
                <i className="fa-solid fa-shield-halved text-sm text-orange-500" />

                <span className="text-[9px] font-semibold text-stone-500">
                  Secure
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 rounded-xl bg-[#fffaf4] px-2 py-2.5 text-center">
                <i className="fa-solid fa-headset text-sm text-orange-500" />

                <span className="text-[9px] font-semibold text-stone-500">
                  Support
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes loginCard {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageZoom {
          from {
            transform: scale(1);
          }

          to {
            transform: scale(1.06);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-10px, 12px, 0);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(12px, -10px, 0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-4px);
          }

          75% {
            transform: translateX(4px);
          }
        }

        .animate-login-card {
          animation: loginCard 0.6s ease-out both;
        }

        .animate-fade-up {
          animation: fadeUp 0.65s ease-out both;
        }

        .animate-fade-up-delay {
          animation: fadeUp 0.8s ease-out 0.12s both;
        }

        .animate-fade-down {
          animation: fadeDown 0.6s ease-out both;
        }

        .animate-login-image {
          animation: imageZoom 12s ease-in-out infinite alternate;
        }

        .animate-float-slow {
          animation: floatSlow 7s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 8s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.35s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

export default LoginPage;
