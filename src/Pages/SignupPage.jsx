import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully. You can now login.");

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-[#fffaf4] px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="relative mx-auto flex w-full max-w-[1450px] overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(120,53,15,0.14)] lg:grid lg:grid-cols-[54%_46%]">

        {/* =========================================================
            LEFT SIDE - BRAND / SIGNUP PROMOTIONAL PANEL
        ========================================================== */}

        <section
          className="relative hidden min-h-[520px] overflow-hidden lg:block"
          style={{
            backgroundImage: "url('/signup-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9a3412]/75 via-[#ea580c]/35 to-[#f97316]/10" />

          {/* Decorative circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/25" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/20" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">

            {/* Brand */}
            <div>
              <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3 shadow-lg">
                <img
                  src="/RUROO_Logo.png"
                  alt="RURCO"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-white">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <i className="fa-solid fa-user-plus" />
                Join MegaSale
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-white xl:text-5xl">
                Create your
                <br />
                account.
                <br />
                Start shopping.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/90">
                Create your MegaSale account and enjoy a faster,
                simpler and more convenient shopping experience.
              </p>

              {/* Benefits */}
              <div className="mt-6 grid max-w-md grid-cols-3 gap-2.5">

                <div className="rounded-2xl border border-white/15 bg-white/15 p-3 backdrop-blur-sm">
                  <i className="fa-solid fa-truck-fast text-lg text-white" />
                  <p className="mt-2 text-xs font-semibold text-white">
                    Fast Delivery
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/15 p-3 backdrop-blur-sm">
                  <i className="fa-solid fa-tag text-lg text-white" />
                  <p className="mt-2 text-xs font-semibold text-white">
                    Best Deals
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/15 p-3 backdrop-blur-sm">
                  <i className="fa-solid fa-leaf text-lg text-white" />
                  <p className="mt-2 text-xs font-semibold text-white">
                    Fresh Products
                  </p>
                </div>

              </div>
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-sm text-white/90">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <i className="fa-solid fa-shield-halved" />
              </span>

              <span>Secure shopping experience</span>
            </div>

          </div>
        </section>

        {/* =========================================================
            RIGHT SIDE - SIGNUP FORM
        ========================================================== */}

        <section className="flex items-center justify-center px-5 py-7 sm:px-8 sm:py-8 lg:px-10 xl:px-12">

          <div className="w-full max-w-[460px]">

            {/* Mobile Brand */}
            <div className="mb-5 text-center lg:hidden">
              <div className="mx-auto inline-flex items-center rounded-2xl bg-[#fff7ed] px-5 py-3">
                <img
                  src="/RUROO_Logo.png"
                  alt="RURCO"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Heading */}
            <div className="mb-5">

              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1e6] text-[#ea580c]">
                <i className="fa-solid fa-user-plus text-base" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
                Create account
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-stone-500">
                Join MegaSale and start shopping with us.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <i className="fa-solid fa-circle-exclamation mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <i className="fa-solid fa-circle-check mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSignup}>

              {/* Full Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-stone-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <i className="fa-regular fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="h-12 w-full rounded-xl border border-stone-200 bg-[#fffaf7] pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-stone-700"
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
                    className="h-12 w-full rounded-xl border border-stone-200 bg-[#fffaf7] pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-stone-700"
                >
                  Password
                </label>

                <div className="relative">
                  <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="h-12 w-full rounded-xl border border-stone-200 bg-[#fffaf7] pl-11 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-orange-50 hover:text-[#ea580c]"
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

                <p className="mt-1.5 text-[11px] text-stone-400">
                  Password must be at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-stone-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="h-12 w-full rounded-xl border border-stone-200 bg-[#fffaf7] pl-11 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-orange-50 hover:text-[#ea580c]"
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "fa-regular fa-eye-slash"
                          : "fa-regular fa-eye"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-xl hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <i className="fa-solid fa-arrow-right text-xs" />
                  </>
                )}
              </button>

            </form>

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-stone-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#ea580c] transition hover:text-[#c2410c]"
              >
                Login
              </Link>
            </p>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <i className="fa-solid fa-lock" />
              <span>Your information is securely protected</span>
            </div>

          </div>
        </section>

      </div>

      {/* Service Strip */}
      <div className="mx-auto mt-4 grid w-full max-w-[1450px] grid-cols-2 gap-2.5 sm:grid-cols-4">

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 shadow-sm">
          <i className="fa-solid fa-truck-fast text-[#f97316]" />
          <span className="text-xs font-semibold text-stone-600">
            Fast Delivery
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 shadow-sm">
          <i className="fa-solid fa-shield-halved text-[#f97316]" />
          <span className="text-xs font-semibold text-stone-600">
            Secure Payment
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 shadow-sm">
          <i className="fa-solid fa-headset text-[#f97316]" />
          <span className="text-xs font-semibold text-stone-600">
            Support
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 shadow-sm">
          <i className="fa-solid fa-rotate-left text-[#f97316]" />
          <span className="text-xs font-semibold text-stone-600">
            Easy Returns
          </span>
        </div>

      </div>
    </main>
  );
}

export default SignupPage;