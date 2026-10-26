import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

const ORDER_STATUSES = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads/")) {
    return `${API_BASE}${image}`;
  }

  return image.startsWith("/") ? image : `/${image}`;
}
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClass(status) {
  const classes = {
    Placed: "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
  };

  return classes[status] || "bg-slate-100 text-slate-700";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [notice, setNotice] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Login session nahi mila. Please login again.");
      }

      const response = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Orders fetch nahi ho paaye.");
      }

      const fetchedOrders = Array.isArray(data.orders) ? data.orders : [];

      setOrders(fetchedOrders);

      setSelectedOrder((current) => {
        if (!current) return null;

        return fetchedOrders.find((order) => order._id === current._id) || null;
      });
    } catch (err) {
      setError(err.message || "Orders load karte waqt error aaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const customer = order.customer || {};
    const account = order.user || {};

    const searchText = [
      order._id,
      customer.name,
      customer.email,
      customer.phone,
      account.name,
      account.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    const matchesPayment =
      paymentFilter === "All" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  async function updateOrderStatus(orderId, orderStatus) {
    const previousOrders = orders;
    setUpdatingId(orderId);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ orderStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order status update nahi hua.");
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, ...data.order } : order,
        ),
      );

      setSelectedOrder((current) =>
        current?._id === orderId ? { ...current, ...data.order } : current,
      );

      setNotice("Order status successfully update ho gaya.");
    } catch (err) {
      setOrders(previousOrders);
      setError(err.message || "Status update karte waqt error aaya.");
    } finally {
      setUpdatingId("");
    }
  }

  function downloadInvoice(order) {
    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const rows = items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.name || item.product?.name || "Product")}</td>
            <td>${Number(item.quantity) || 0}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0))}</td>
          </tr>`,
      )
      .join("");

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Invoice - ${escapeHtml(order._id)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; padding: 32px; }
          h1 { color: #ea580c; margin-bottom: 4px; }
          .muted { color: #64748b; font-size: 13px; }
          .section { margin-top: 28px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
          .totals { margin: 22px 0 0 auto; width: 280px; }
          .totals p { display: flex; justify-content: space-between; gap: 20px; }
          .grand-total { font-size: 19px; font-weight: bold; border-top: 2px solid #cbd5e1; padding-top: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>RUROO MegaSale</h1>
        <div class="muted">Order Invoice</div>

        <div class="section">
          <h2>Invoice Details</h2>
          <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
          <p><strong>Order Date:</strong> ${escapeHtml(formatDate(order.createdAt))}</p>
          <p><strong>Order Status:</strong> ${escapeHtml(order.orderStatus || "Placed")}</p>
          <p><strong>Payment Method:</strong> ${escapeHtml(order.paymentMethod || "—")}</p>
          <p><strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus || "Pending")}</p>
        </div>

        <div class="section">
          <h2>Bill To</h2>
          <p><strong>Name:</strong> ${escapeHtml(customer.name || order.user?.name || "—")}</p>
          <p><strong>Email:</strong> ${escapeHtml(customer.email || order.user?.email || "—")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(customer.phone || "—")}</p>
          <p><strong>Address:</strong> ${escapeHtml(customer.address || "—")}</p>
        </div>

        <div class="section">
          <h2>Order Items</h2>
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="totals">
          <p><span>Subtotal</span><strong>${formatCurrency(order.subtotal)}</strong></p>
          <p><span>Delivery</span><strong>${formatCurrency(order.deliveryCharge)}</strong></p>
          <p class="grand-total"><span>Total</span><strong>${formatCurrency(order.total)}</strong></p>
        </div>

        <p class="muted section">Thank you for shopping with RUROO MegaSale.</p>
        <script>window.onload = () => window.print();<\/script>
      </body>
      </html>
    `;

    const invoiceWindow = window.open("", "_blank");

    if (!invoiceWindow) {
      setError(
        "Invoice window block ho gayi. Browser mein pop-ups allow karo.",
      );
      return;
    }

    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, delivery status and invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Loading..." : "↻ Refresh Orders"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Orders", orders.length],
          ["Placed", orders.filter((o) => o.orderStatus === "Placed").length],
          [
            "Processing",
            orders.filter((o) => o.orderStatus === "Processing").length,
          ],
          [
            "Delivered",
            orders.filter((o) => o.orderStatus === "Delivered").length,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search order ID, customer, phone..."
          className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 md:col-span-1"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="All">All Order Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="All">All Payment Statuses</option>
          {[
            ...new Set(
              orders.map((order) => order.paymentStatus).filter(Boolean),
            ),
          ].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {notice && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {notice}
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchOrders}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-slate-800">All Orders</h3>
          <span className="text-sm text-slate-500">
            {filteredOrders.length} result(s)
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {orders.length === 0
              ? "Abhi koi order nahi mila."
              : "Search ya filters ke liye koi matching order nahi mila."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">PRODUCT</th>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={getImageUrl(
                            order.items?.[0]?.image ||
                              order.items?.[0]?.product?.image,
                          )}
                          alt={order.items?.[0]?.name || "Product"}
                          className="h-12 w-12 rounded-lg border border-slate-200 bg-white object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />

                        <div className="min-w-0">
                          <p className="max-w-36 truncate text-sm font-medium text-slate-800">
                            {order.items?.[0]?.name ||
                              order.items?.[0]?.product?.name ||
                              "Product"}
                          </p>

                          {order.items?.length > 1 && (
                            <p className="text-xs text-slate-500">
                              +{order.items.length - 1} more
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      <span title={order._id}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {order.customer?.name || order.user?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.customer?.phone || order.customer?.email || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <p>{order.paymentMethod || "—"}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(order.paymentStatus)}`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus || "Placed"}
                        disabled={updatingId === order._id}
                        onChange={(event) =>
                          updateOrderStatus(order._id, event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold disabled:opacity-50"
                        aria-label={`Update order ${order._id} status`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <p className="mt-1 text-xs text-slate-500">
                          Updating...
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadInvoice(order)}
                          className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                        >
                          Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 pt-28">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3
                  id="order-detail-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Order Details
                </h3>
                <p className="mt-1 text-xs text-slate-500 break-all">
                  {selectedOrder._id}
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="mt-1 font-semibold">
                    {selectedOrder.customer?.name ||
                      selectedOrder.user?.name ||
                      "—"}
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedOrder.customer?.email ||
                      selectedOrder.user?.email ||
                      "—"}
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedOrder.customer?.phone || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Delivery Address</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {selectedOrder.customer?.address || "—"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(selectedOrder.orderStatus)}`}
                >
                  Order: {selectedOrder.orderStatus || "Placed"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(selectedOrder.paymentStatus)}`}
                >
                  Payment: {selectedOrder.paymentStatus || "Pending"}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[450px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedOrder.items || []).map((item, index) => (
                      <tr
                        key={
                          item._id ||
                          `${item.product?._id || item.name}-${index}`
                        }
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(
                                item.image ||
                                  item.product?.image ||
                                  "/placeholder.png",
                              )}
                              alt={item.name || item.product?.name || "Product"}
                              className="h-12 w-12 rounded-lg border border-slate-200 bg-white object-contain"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />

                            <span className="font-medium text-slate-800">
                              {item.name || item.product?.name || "Product"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(
                            (Number(item.price) || 0) *
                              (Number(item.quantity) || 0),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto max-w-sm space-y-2 text-sm">
                <p className="flex justify-between gap-4">
                  <span className="text-slate-500">Subtotal</span>
                  <strong>{formatCurrency(selectedOrder.subtotal)}</strong>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-500">Delivery</span>
                  <strong>
                    {formatCurrency(selectedOrder.deliveryCharge)}
                  </strong>
                </p>
                <p className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-lg">
                  <span>Total</span>
                  <strong>{formatCurrency(selectedOrder.total)}</strong>
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => downloadInvoice(selectedOrder)}
                  className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Download / Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm self-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
