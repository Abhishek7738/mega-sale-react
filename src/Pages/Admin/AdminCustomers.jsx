import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/admin/customers";
const PAGE_SIZE = 8;

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

function CustomerDetailsModal({ customer, onClose }) {
  useEffect(() => {
    if (!customer) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [customer, onClose]);

  if (!customer) return null;

  const address = customer.address || {};

  const fullAddress = [
    address.street,
    address.area,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const initials = (customer.name || "C")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="customer-details-title"
              className="text-xl font-bold text-gray-900"
            >
              Customer Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Registered customer information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-4 rounded-xl bg-green-50 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-lg font-bold text-gray-900">
                {customer.name || "Unnamed Customer"}
              </h3>
              <p className="break-all text-sm text-gray-600">
                {customer.email || "No email available"}
              </p>
            </div>
          </div>

          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard label="Full Name" value={customer.name} />
              <InfoCard label="Email Address" value={customer.email} />
              <InfoCard label="Mobile Number" value={customer.mobile} />
              <InfoCard label="Gender" value={customer.gender} />
              <InfoCard
                label="Date of Birth"
                value={formatDate(customer.dateOfBirth)}
              />
              <InfoCard
                label="Registration Date"
                value={formatDate(customer.createdAt)}
              />
            </div>
          </section>

          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700">
              Address
            </h3>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm leading-6 text-gray-700">
                {fullAddress || "Address not provided"}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700">
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard label="Account ID" value={customer._id} />
              <InfoCard
                label="Last Updated"
                value={formatDate(customer.updatedAt)}
              />
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCustomers() {
      try {
        setLoading(true);
        setError("");

        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in as an administrator.");
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load customers.");
        }

        setCustomers(Array.isArray(data.customers) ? data.customers : []);
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

    fetchCustomers();

    return () => controller.abort();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.mobile,
        customer._id,
      ].some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [customers, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedCustomers = filteredCustomers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-full p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View registered customers and their account information.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Registered Customers
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "—" : customers.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Search Results</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "—" : filteredCustomers.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, email, mobile or account ID..."
              aria-label="Search customers"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading customers...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Unable to load customers</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs">
              Check that the backend is running and your admin session is valid.
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-gray-700">
              {customers.length === 0
                ? "No registered customers found."
                : "No customers match your search."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-semibold text-green-700 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <th className="px-4 py-4 font-semibold">Customer</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold">Mobile</th>
                    <th className="px-4 py-4 font-semibold">Account ID</th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {customer.name || "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {customer.email || "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {customer.mobile || "—"}
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-500">
                        {customer._id || "—"}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          className="whitespace-nowrap rounded-lg bg-green-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filteredCustomers.length)} of{" "}
                {filteredCustomers.length} customers
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-2 text-sm text-gray-600">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomerDetailsModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}

export default AdminCustomers;
