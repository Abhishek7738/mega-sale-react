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
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] lg:grid-cols-2">
        {/* Left Promotional Section */}
        <div className="relative hidden min-h-[720px] overflow-hidden bg-blue-600 lg:block">
          <img
            src="/bg_dryfruits.jfif"
            alt="Fresh products"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/95 via-blue-600/75 to-blue-500/40" />

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/20" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
            {/* Brand */}
            <div>
              <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3 shadow-lg">
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-red-500">RU</span>
                  <span className="text-blue-600">R</span>
                  <span className="text-green-500">C</span>
                  <span className="text-yellow-500">O</span>
                </span>
              </div>

              <p className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-blue-100">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Join Megasale
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Create your account.
                <br />
                Start shopping.
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-blue-50">
                Create your Megasale account and enjoy a faster, simpler and
                more convenient shopping experience.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <i className="fa-solid fa-truck-fast text-xl text-white"></i>
                  <p className="mt-3 text-xs font-semibold text-white">
                    Fast Delivery
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <i className="fa-solid fa-tag text-xl text-white"></i>
                  <p className="mt-3 text-xs font-semibold text-white">
                    Best Deals
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <i className="fa-solid fa-leaf text-xl text-white"></i>
                  <p className="mt-3 text-xs font-semibold text-white">
                    Fresh Products
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <i className="fa-solid fa-shield-halved"></i>
              </span>

              <span>Secure shopping experience</span>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto inline-flex items-center rounded-2xl bg-blue-50 px-5 py-3">
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-red-500">RU</span>
                  <span className="text-blue-600">R</span>
                  <span className="text-green-500">C</span>
                  <span className="text-yellow-500">O</span>
                </span>
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Fresh • Fast • Reliable
              </p>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <i className="fa-solid fa-user-plus text-lg"></i>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Create account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join Megasale and start shopping with us.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <i className="fa-solid fa-circle-exclamation mt-0.5"></i>

                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                <i className="fa-solid fa-circle-check mt-0.5"></i>

                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSignup}>
              {/* Name */}
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <i className="fa-regular fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <i className="fa-regular fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <i
                      className={
                        showPassword
                          ? "fa-regular fa-eye-slash"
                          : "fa-regular fa-eye"
                      }
                    ></i>
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Password must be at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "fa-regular fa-eye-slash"
                          : "fa-regular fa-eye"
                      }
                    ></i>
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Login
              </Link>
            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <i className="fa-solid fa-lock"></i>
              <span>Your information is securely protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Strip */}
      <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 shadow-sm">
          <i className="fa-solid fa-truck-fast text-blue-600"></i>
          <span className="text-xs font-semibold text-slate-600">
            Fast Delivery
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 shadow-sm">
          <i className="fa-solid fa-shield-halved text-blue-600"></i>
          <span className="text-xs font-semibold text-slate-600">
            Secure Payment
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 shadow-sm">
          <i className="fa-solid fa-headset text-blue-600"></i>
          <span className="text-xs font-semibold text-slate-600">Support</span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 shadow-sm">
          <i className="fa-solid fa-rotate-left text-blue-600"></i>
          <span className="text-xs font-semibold text-slate-600">
            Easy Returns
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
