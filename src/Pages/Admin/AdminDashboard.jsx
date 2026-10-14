import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const adminSections = [
  {
    title: "Products",
    description: "Add, edit and manage products",
    path: "/admin/products",
  },
  {
    title: "Categories",
    description: "Manage product categories",
    path: "/admin/categories",
  },
  {
    title: "Premium",
    description: "Manage premium products",
    path: "/admin/premium",
  },
  {
    title: "New Launch",
    description: "Manage new launch products",
    path: "/admin/new-launch",
  },
  {
    title: "Orders",
    description: "View and manage customer orders",
    path: "/admin/orders",
  },
  {
    title: "Customers",
    description: "View registered customers",
    path: "/admin/customers",
  },
  {
    title: "Inventory",
    description: "Review product stock",
    path: "/admin/inventory",
  },
  {
    title: "Contact Messages",
    description: "Review customer enquiries",
    path: "/admin/contacts",
  },
  {
    title: "Reports & Analytics",
    description: "Review store performance",
    path: "/admin/reports",
  },
  {
    title: "Settings",
    description: "Manage store settings",
    path: "/admin/settings",
  },
];

const API_BASE = "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: null,
    totalOrders: null,
    totalCustomers: null,
    totalContacts: null,
  });
  const [statsError, setStatsError] = useState("");

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [salesData, setSalesData] = useState([]);
  const [salesError, setSalesError] = useState("");
  const [salesLoading, setSalesLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getToken();

      if (!token) {
        setStatsError("Please log in as admin.");
        setOrdersError("Please log in as admin.");
        setSalesError("Please log in as admin.");
        setOrdersLoading(false);
        setSalesLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const fetchStats = async () => {
        try {
          const response = await fetch(
            `${API_BASE}/api/admin/dashboard-stats`,
            { headers },
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to load statistics.");
          }

          setStats(data);
        } catch (error) {
          console.error("Dashboard stats error:", error);
          setStatsError(error.message || "Unable to load statistics.");
        }
      };

      const fetchOrders = async () => {
        try {
          const response = await fetch(`${API_BASE}/api/admin/recent-orders`, {
            headers,
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to load recent orders.");
          }

          setRecentOrders(data.orders || []);
        } catch (error) {
          console.error("Recent orders error:", error);
          setOrdersError(error.message || "Unable to load recent orders.");
        } finally {
          setOrdersLoading(false);
        }
      };

      const fetchSales = async () => {
        try {
          const response = await fetch(`${API_BASE}/api/admin/sales-overview`, {
            headers,
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to load order value.");
          }

          setSalesData(
            (data.days || []).map((day) => ({
              ...day,
              label: new Date(`${day.date}T00:00:00`).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short" },
              ),
            })),
          );
        } catch (error) {
          console.error("Sales overview error:", error);
          setSalesError(error.message || "Unable to load order value.");
        } finally {
          setSalesLoading(false);
        }
      };

      await Promise.all([fetchStats(), fetchOrders(), fetchSales()]);
    };

    fetchDashboardData();
  }, []);

  const sevenDayOrderValue = salesData.reduce(
    (sum, day) => sum + Number(day.orderValue || 0),
    0,
  );

  const sevenDayOrderCount = salesData.reduce(
    (sum, day) => sum + Number(day.orders || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            RUROO MegaSale
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your store from one place.
          </p>
        </div>

        <Link
          to="/"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          Visit Store
        </Link>
      </header>

      {/* Dashboard statistics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            icon: "▦",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: "▤",
          },
          {
            label: "Customers",
            value: stats.totalCustomers,
            icon: "♙",
          },
          {
            label: "Contact Messages",
            value: stats.totalContacts,
            icon: "✉",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                {stat.icon}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value === null ? "..." : stat.value}
            </p>
          </div>
        ))}

        {statsError && (
          <p className="text-sm text-red-600 sm:col-span-2 xl:col-span-4">
            {statsError}
          </p>
        )}
      </section>

      {/* Seven-day order value chart */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sales Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Daily order value for the last 7 days
            </p>
          </div>
          <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
            Last 7 days
          </span>
        </div>

        {salesLoading ? (
          <p className="p-8 text-sm text-slate-500">
            Loading sales overview...
          </p>
        ) : salesError ? (
          <p className="p-8 text-sm text-red-600">{salesError}</p>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-slate-600">7-day order value</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(sevenDayOrderValue)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Orders in this period</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {sevenDayOrderCount}
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 10, right: 12, left: 8, bottom: 4 }}
                  cursor={false}
                >
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={75}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Order value",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="orderValue"
                    name="Order value"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Order value excludes cancelled orders. This is not confirmed
              payment revenue; unpaid online orders may be included.
            </p>
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest orders received by your store
            </p>
          </div>
          <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
            Latest 5
          </span>
        </div>

        {ordersLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading orders...</p>
        ) : ordersError ? (
          <p className="p-6 text-sm text-red-600">{ordersError}</p>
        ) : recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No orders found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {order.customer?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.customer?.email || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod === "online"
                            ? "Online"
                            : order.paymentMethod || "—"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.paymentStatus || "Pending"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {order.orderStatus || "Placed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Store management */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Store Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Quick access to your store tools
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">
                  {section.title}
                </h3>
                <span className="text-orange-600 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {section.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-orange-600">
                Open section
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
