
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf4] px-4 py-16">
        <p className="text-center text-stone-500">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fffaf4] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <i className="fa-solid fa-user-lock text-4xl text-orange-500" />
          <h1 className="mt-4 text-2xl font-bold text-stone-900">
            Login Required
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
            RUROO MegaSale
          </p>
          <h1 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-stone-500">
            Manage your account and explore your orders.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile summary */}
          <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <i className="fa-solid fa-user text-4xl" />
              </div>

              <h2 className="mt-4 break-words text-xl font-bold text-stone-900">
                {user?.name || "My Account"}
              </h2>

              <p className="mt-1 break-all text-sm text-stone-500">
                {user?.email || "Email not available"}
              </p>

              <span className="mt-4 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                <i className="fa-solid fa-circle-check mr-1" />
                Logged In
              </span>
            </div>

            <div className="mt-6 border-t border-stone-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Account Menu
              </p>

              <Link
                to="/profile"
                className="mt-3 flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3 font-semibold text-orange-600"
              >
                <i className="fa-solid fa-user w-5" />
                My Profile
              </Link>

              <Link
                to="/orders"
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <i className="fa-solid fa-box w-5" />
                My Orders
              </Link>

              <Link
                to="/"
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <i className="fa-solid fa-house w-5" />
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={logout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
              >
                <i className="fa-solid fa-right-from-bracket w-5" />
                Logout
              </button>
            </div>
          </section>

          {/* Account details */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <i className="fa-solid fa-id-card text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Account Details
                  </h2>
                  <p className="text-sm text-stone-500">
                    Your registered information
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">Full Name</p>
                  <p className="mt-2 break-words font-semibold text-stone-900">
                    {user?.name || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">Email Address</p>
                  <p className="mt-2 break-all font-semibold text-stone-900">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-stone-400">
                Your profile information is taken from your logged-in account.
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  <i className="fa-solid fa-box-open text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your Orders</h2>
                  <p className="mt-1 text-sm text-orange-50">
                    Check your purchases and order status.
                  </p>
                </div>
              </div>

              <Link
                to="/orders"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
              >
                View My Orders
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
