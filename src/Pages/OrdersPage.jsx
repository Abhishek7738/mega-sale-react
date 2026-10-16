import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = "http://localhost:5000/api/orders";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const getStatus = (status) =>
  String(status || "Processing")
    .trim()
    .toLowerCase();

const getStatusStep = (status) => {
  const value = getStatus(status);

  if (value.includes("cancel")) return -1;
  if (value.includes("deliver")) return 3;
  if (value.includes("ship") || value.includes("out for delivery")) {
    return 2;
  }
  if (value.includes("process") || value.includes("confirm")) {
    return 1;
  }
  if (value.includes("placed") || value.includes("pending")) {
    return 0;
  }

  return 0;
};

const getProductImage = (item) => {
  const image =
    item.image ||
    item.imageUrl ||
    item.product?.image ||
    item.product?.imageUrl ||
    (Array.isArray(item.product?.images)
      ? item.product.images[0]
      : item.product?.images);

  if (typeof image !== "string" || !image.trim()) {
    return "";
  }

  if (image.startsWith("/uploads/")) {
    return `http://localhost:5000${image}`;
  }

  return image;
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your orders.");
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch orders");
        }

        if (!cancelled) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to connect to the server");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const getSubtotal = (order) =>
    Array.isArray(order.items)
      ? order.items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0,
        )
      : 0;

  const getDeliveryCharge = (order) => {
    if (order.deliveryCharge != null) {
      return Number(order.deliveryCharge) || 0;
    }

    if (order.subtotal != null && order.total != null) {
      return Math.max(0, Number(order.total) - Number(order.subtotal));
    }

    return 0;
  };

  const filteredOrders = orders.filter((order) => {
    const status = getStatus(order.orderStatus);
    const matchesFilter =
      filter === "All" ||
      (filter === "Processing" &&
        (status.includes("process") ||
          status.includes("pending") ||
          status.includes("confirm") ||
          status.includes("placed"))) ||
      (filter === "Shipped" &&
        (status.includes("ship") || status.includes("out for delivery"))) ||
      (filter === "Delivered" && status.includes("deliver")) ||
      (filter === "Cancelled" && status.includes("cancel"));

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      String(order._id || "")
        .toLowerCase()
        .includes(query) ||
      (order.items || []).some((item) =>
        String(item.name || "")
          .toLowerCase()
          .includes(query),
      );

    return matchesFilter && matchesSearch;
  });

  const createInvoicePDF = (order) => {
    try {
      setActionError("");

      const doc = new jsPDF();
      const orderId = String(order._id || "N/A");
      const subtotal = getSubtotal(order);
      const delivery = getDeliveryCharge(order);
      const total = Number(order.total ?? subtotal + delivery);

      doc.setFillColor(255, 111, 0);
      doc.rect(0, 0, 210, 37, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("RUROO MegaSale", 15, 17);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("ORDER INVOICE", 15, 27);

      doc.setTextColor(45, 45, 45);
      doc.setFontSize(10);
      doc.text(`Invoice / Order ID: ${orderId}`, 15, 49);
      doc.text(`Order Date: ${formatDate(order.createdAt)}`, 15, 57);
      doc.text(
        `Payment Method: ${
          order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"
        }`,
        15,
        65,
      );
      doc.text(`Order Status: ${order.orderStatus || "Processing"}`, 15, 73);

      autoTable(doc, {
        startY: 82,
        head: [["Product", "Qty", "Unit Price", "Amount"]],
        body: (order.items || []).map((item) => [
          item.name || "Product",
          String(item.quantity || 0),
          `Rs. ${money(item.price)}`,
          `Rs. ${money(Number(item.price || 0) * Number(item.quantity || 0))}`,
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [255, 111, 0],
          textColor: [255, 255, 255],
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
      });

      const finalY = (doc.lastAutoTable?.finalY || 90) + 10;

      autoTable(doc, {
        startY: finalY,
        body: [
          ["Subtotal", `Rs. ${money(order.subtotal ?? subtotal)}`],
          ["Delivery Charge", `Rs. ${money(delivery)}`],
          ["Total", `Rs. ${money(total)}`],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 115 },
          1: { halign: "right" },
        },
        didParseCell(data) {
          if (data.row.index === 2) {
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      const filename = `RUROO-Invoice-${orderId.slice(-8)}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("Invoice PDF error:", err);
      setActionError("Unable to generate PDF invoice. Please try again.");
    }
  };

  const printInvoice = (order) => {
    try {
      setActionError("");

      const orderId = String(order._id || "N/A");
      const subtotal = getSubtotal(order);
      const delivery = getDeliveryCharge(order);
      const total = Number(order.total ?? subtotal + delivery);

      const rows = (order.items || [])
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.name || "Product")}</td>
              <td>${Number(item.quantity || 0)}</td>
              <td>₹ ${money(item.price)}</td>
              <td>₹ ${money(Number(item.price || 0) * Number(item.quantity || 0))}</td>
            </tr>
          `,
        )
        .join("");

      const printWindow = window.open("", "_blank", "width=900,height=700");

      if (!printWindow) {
        setActionError(
          "Print window blocked. Please allow pop-ups for this site.",
        );
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>RUROO Invoice - ${escapeHtml(orderId)}</title>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #292524;
                margin: 35px;
              }
              header {
                background: #ff6f00;
                color: white;
                padding: 22px;
                border-radius: 10px;
              }
              h1 { margin: 0 0 8px; }
              .details { margin: 24px 0; line-height: 1.9; }
              table { width: 100%; border-collapse: collapse; margin-top: 24px; }
              th { background: #fff0df; text-align: left; }
              th, td { padding: 12px; border: 1px solid #e7e5e4; }
              .totals { margin: 24px 0 0 auto; width: 280px; }
              .totals p { display: flex; justify-content: space-between; }
              .grand-total { font-weight: bold; font-size: 19px; }
              .footer { margin-top: 40px; color: #78716c; }
              @media print {
                body { margin: 15mm; }
                header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                th { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <header>
              <h1>RUROO MegaSale</h1>
              <div>ORDER INVOICE</div>
            </header>
            <div class="details">
              <div><strong>Order ID:</strong> ${escapeHtml(orderId)}</div>
              <div><strong>Order Date:</strong> ${escapeHtml(formatDate(order.createdAt))}</div>
              <div><strong>Payment:</strong> ${
                order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"
              }</div>
              <div><strong>Order Status:</strong> ${escapeHtml(order.orderStatus || "Processing")}</div>
            </div>
            <table>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="totals">
              <p><span>Subtotal</span><span>₹ ${money(order.subtotal ?? subtotal)}</span></p>
              <p><span>Delivery</span><span>₹ ${money(delivery)}</span></p>
              <p class="grand-total"><span>Total</span><span>₹ ${money(total)}</span></p>
            </div>
            <div class="footer">Thank you for shopping with RUROO MegaSale!</div>
            <script>
              window.onload = function () {
                window.focus();
                window.print();
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (err) {
      console.error("Print invoice error:", err);
      setActionError("Unable to open the invoice for printing.");
    }
  };

  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-sm sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            RUROO MegaSale
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">My Orders</h1>
              <p className="mt-2 max-w-xl text-sm text-orange-50 sm:text-base">
                Track your purchases, view order details and manage your
                invoices.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm text-orange-50">Total Orders</p>
              <p className="text-3xl font-black">{orders.length}</p>
            </div>
          </div>
        </section>

        {actionError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-stone-900">Order History</h2>
              <p className="mt-1 text-sm text-stone-500">
                Search orders or filter them by status.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or product..."
              aria-label="Search orders"
              className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-orange-500 lg:max-w-xs"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === item
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
            <p className="mt-4 font-medium text-stone-500">
              Loading your orders...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <i className="fa-solid fa-circle-exclamation text-4xl text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-stone-900">
              Unable to load orders
            </h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-orange-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <i className="fa-solid fa-box-open text-3xl" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-stone-900">
              No Orders Yet
            </h2>
            <p className="mt-2 text-stone-500">
              Your purchases will appear here after you place an order.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Explore Products
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <i className="fa-solid fa-magnifying-glass text-3xl text-stone-300" />
              <h2 className="mt-3 text-xl font-bold text-stone-800">
                No matching orders
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Try another search term or select a different filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-4 font-semibold text-orange-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const status = getStatus(order.orderStatus);
              const statusStep = getStatusStep(order.orderStatus);
              const cancelled = statusStep === -1;
              const subtotal = getSubtotal(order);
              const delivery = getDeliveryCharge(order);
              const total = Number(order.total ?? subtotal + delivery);

              const statusStyle = cancelled
                ? "bg-red-50 text-red-700"
                : statusStep === 3
                  ? "bg-green-50 text-green-700"
                  : statusStep === 2
                    ? "bg-blue-50 text-blue-700"
                    : "bg-orange-50 text-orange-700";

              const timeline = [
                { label: "Order Placed", icon: "fa-clipboard-check" },
                { label: "Processing", icon: "fa-box" },
                { label: "Shipped", icon: "fa-truck-fast" },
                { label: "Delivered", icon: "fa-house-circle-check" },
              ];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Order ID
                      </p>
                      <h2 className="mt-1 break-all font-bold text-stone-900">
                        #
                        {String(order._id || "")
                          .slice(-8)
                          .toUpperCase()}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle}`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>
                      <div className="sm:text-right">
                        <p className="text-xs text-stone-500">Order Total</p>
                        <p className="text-xl font-black text-stone-900">
                          ₹ {money(total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section>
                      <h3 className="mb-4 flex items-center gap-2 font-bold text-stone-900">
                        <i className="fa-solid fa-bag-shopping text-orange-500" />
                        Products ({(order.items || []).length})
                      </h3>

                      <div className="space-y-4">
                        {(order.items || []).map((item, index) => {
                          const image = getProductImage(item);

                          return (
                            <div
                              key={item._id || `${item.name}-${index}`}
                              className="flex items-center gap-4 rounded-xl border border-stone-100 p-3"
                            >
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-50">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={item.name || "Ordered product"}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <i className="fa-solid fa-box text-2xl text-orange-300" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="break-words font-bold text-stone-800">
                                  {item.name || "Product"}
                                </p>
                                <p className="mt-1 text-sm text-stone-500">
                                  Qty: {item.quantity || 0}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-orange-600">
                                  ₹ {money(item.price)}
                                </p>
                              </div>

                              <p className="shrink-0 text-right font-bold text-stone-800">
                                ₹{" "}
                                {money(
                                  Number(item.price || 0) *
                                    Number(item.quantity || 0),
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 space-y-3 rounded-xl bg-stone-50 p-4">
                        <div className="flex justify-between gap-3 text-sm text-stone-600">
                          <span>Subtotal</span>
                          <span>₹ {money(order.subtotal ?? subtotal)}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-sm text-stone-600">
                          <span>Delivery Charge</span>
                          <span>₹ {money(delivery)}</span>
                        </div>
                        <div className="flex justify-between gap-3 border-t border-stone-200 pt-3 font-bold text-stone-900">
                          <span>Total Paid / Due</span>
                          <span>₹ {money(total)}</span>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-orange-100 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-stone-900">
                          Order Journey
                        </h3>
                        <i className="fa-solid fa-route text-xl text-orange-500" />
                      </div>

                      {cancelled ? (
                        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                          <i className="fa-solid fa-circle-xmark mr-2" />
                          This order is cancelled.
                        </div>
                      ) : (
                        <div className="mt-6">
                          {timeline.map((step, index) => {
                            const completed = index <= statusStep;
                            const current = index === statusStep;

                            return (
                              <div
                                key={step.label}
                                className="relative flex gap-4 pb-6 last:pb-0"
                              >
                                {index < timeline.length - 1 && (
                                  <div
                                    className={`absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5 ${
                                      index < statusStep
                                        ? "bg-orange-500"
                                        : "bg-stone-200"
                                    }`}
                                  />
                                )}

                                <div
                                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                    completed
                                      ? "bg-orange-500 text-white"
                                      : "border-2 border-stone-200 bg-white text-stone-300"
                                  }`}
                                >
                                  <i
                                    className={`fa-solid ${step.icon} text-xs`}
                                  />
                                </div>

                                <div className="min-w-0 pt-1">
                                  <p
                                    className={`text-sm font-bold ${
                                      completed
                                        ? "text-stone-900"
                                        : "text-stone-400"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  {current && (
                                    <p className="mt-1 text-xs font-medium text-orange-600">
                                      Current status
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-5 space-y-3 border-t border-stone-100 pt-4">
                        <div className="flex items-start justify-between gap-3 text-sm">
                          <span className="text-stone-500">Payment Method</span>
                          <span className="text-right font-semibold text-stone-800">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-3 text-sm">
                          <span className="text-stone-500">Payment Status</span>
                          <span className="text-right font-semibold capitalize text-stone-800">
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-stone-100 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-stone-500">
                      Thank you for shopping with RUROO MegaSale.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => printInvoice(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
                      >
                        <i className="fa-solid fa-print" />
                        Print Invoice
                      </button>

                      <button
                        type="button"
                        onClick={() => createInvoicePDF(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
                      >
                        <i className="fa-solid fa-file-pdf" />
                        Download PDF
                      </button>

                      <Link
                        to={`/track-order/${order._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                      >
                        <i className="fa-solid fa-truck-fast" />
                        Track Order
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-600"
          >
            <i className="fa-solid fa-arrow-left" />
            Back to My Profile
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrdersPage;
