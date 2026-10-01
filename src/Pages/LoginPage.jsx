import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      console.log("Login successful");

      navigate("/");
    } else {
      console.log(data.message);
    }
  };

  return (
    <div className="bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        {/* Left side */}
        <div className="relative hidden bg-blue-600 p-10 text-white md:flex md:flex-col md:justify-center">
          <h1 className="text-4xl font-bold">Shop Smarter.</h1>

          <p className="mt-4 max-w-md text-lg text-blue-100">
            Discover fresh products, better deals and everything you need in one
            place.
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-center p-8">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>

              <p className="mt-2 text-sm text-gray-500">
                Login to continue shopping with Megasale
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
