
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emptyAddress = {
  street: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
};

const emptyForm = {
  name: "",
  email: "",
  mobile: "",
  dateOfBirth: "",
  gender: "",
  address: { ...emptyAddress },
};

function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load profile"
          );
        }

        if (cancelled) return;

        const profile = data.user;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          mobile: profile.mobile || "",
          dateOfBirth: profile.dateOfBirth
            ? profile.dateOfBirth.slice(0, 10)
            : "",
          gender: profile.gender || "",
          address: {
            street: profile.address?.street || "",
            area: profile.address?.area || "",
            city: profile.address?.city || "",
            state: profile.address?.state || "",
            pincode: profile.address?.pincode || "",
          },
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load profile");
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [name]:
          name === "pincode"
            ? value.replace(/\D/g, "").slice(0, 6)
            : value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save profile"
        );
      }

      const profile = data.user;

      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        dateOfBirth: profile.dateOfBirth
          ? profile.dateOfBirth.slice(0, 10)
          : "",
        gender: profile.gender || "",
        address: {
          street: profile.address?.street || "",
          area: profile.address?.area || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          pincode: profile.address?.pincode || "",
        },
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

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

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-stone-600";

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
            Manage your personal information and orders.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile summary and account menu */}
          <section className="h-fit rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <i className="fa-solid fa-user text-4xl" />
              </div>

              <h2 className="mt-4 break-words text-xl font-bold text-stone-900">
                {formData.name || user?.name || "My Account"}
              </h2>

              <p className="mt-1 break-all text-sm text-stone-500">
                {formData.email || user?.email || "Email not available"}
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

          {/* Editable account details */}
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
                  Update your personal information
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-6">
              {message && (
                <p
                  role="status"
                  className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                  {message}
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-name">
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-email">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-mobile">
                    Mobile Number
                  </label>
                  <input
                    id="profile-mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-dob">
                    Date of Birth
                  </label>
                  <input
                    id="profile-dob"
                    type="date"
                    value={formData.dateOfBirth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-gender">
                    Gender
                  </label>
                  <select
                    id="profile-gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        gender: e.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-street">
                    Street Address
                  </label>
                  <input
                    id="profile-street"
                    name="street"
                    type="text"
                    autoComplete="address-line1"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-area">
                    Area / Locality
                  </label>
                  <input
                    id="profile-area"
                    name="area"
                    type="text"
                    autoComplete="address-line2"
                    value={formData.address.area}
                    onChange={handleAddressChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-city">
                    City
                  </label>
                  <input
                    id="profile-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-state">
                    State
                  </label>
                  <input
                    id="profile-state"
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-pincode">
                    Pincode
                  </label>
                  <input
                    id="profile-pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
