
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (!token) {
          setError("Please log in to track your order.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to fetch your order.");
          return;
        }

        const foundOrder = (data.orders || []).find(
          (item) => item._id === orderId
        );

        if (!foundOrder) {
          setError("Order not found in your account.");
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error("Track order error:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const steps = [
    { status: "Placed", label: "Order Placed", icon: "fa-box" },
    { status: "Processing", label: "Processing", icon: "fa-gears" },
    {
      status: "Out for Delivery",
      label: "Out for Delivery",
      icon: "fa-truck-fast",
    },
    { status: "Delivered", label: "Delivered", icon: "fa-circle-check" },
  ];

  const currentStatus = order?.orderStatus || "Placed";
  const normalizedStatus = currentStatus.toLowerCase();

  const currentStep = normalizedStatus.includes("deliver")
    ? normalizedStatus.includes("out for")
      ? 2
      : 3
    : normalizedStatus.includes("process")
      ? 1
      : normalizedStatus.includes("cancel")
        ? -1
        : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf4] px-4 py-16 text-center">
        <p className="text-stone-500">Loading order tracking...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#fffaf4] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <i className="fa-solid fa-box-open text-4xl text-orange-500" />
          <h1 className="mt-4 text-2xl font-bold text-stone-900">
            Unable to Track Order
          </h1>
          <p className="mt-2 text-stone-500">
            {error || "Order not found."}
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const cancelled = normalizedStatus.includes("cancel");

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-stone-500">
              <Link to="/">Home</Link>
              {" / "}
              <Link to="/orders">My Orders</Link>
              {" / Track Order"}
            </p>
            <h1 className="mt-3 text-3xl font-black text-stone-900">
              Track Your Order
            </h1>
            <p className="mt-2 text-stone-500">
              Follow your order journey.
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50"
          >
            <i className="fa-solid fa-arrow-left" />
            Back to My Orders
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_2fr]">
          {/* Order Summary */}
          <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <i className="fa-solid fa-box text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Order Summary
                </h2>
                <p className="text-sm text-stone-500">Order details</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-stone-50 p-4">
              <p className="break-all font-bold text-stone-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                {currentStatus}
              </span>
              <p className="mt-3 text-sm text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="font-bold text-stone-800">
                  <i className="fa-solid fa-location-dot mr-2 text-orange-500" />
                  Delivery Address
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-600">
                  {order.customer?.name}
                  {"\n"}
                  {order.customer?.address}
                </p>
              </div>

              <div>
                <p className="font-bold text-stone-800">
                  <i className="fa-regular fa-credit-card mr-2 text-orange-500" />
                  Payment Method
                </p>
                <p className="mt-2 text-sm text-stone-600">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>

              <div>
                <p className="font-bold text-stone-800">Order Total</p>
                <p className="mt-2 text-2xl font-black text-stone-900">
                  ₹{Number(order.total || 0).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Payment status: {order.paymentStatus || "Pending"}
                </p>
              </div>
            </div>
          </section>

          {/* Tracking Timeline and Items */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="rounded-xl bg-emerald-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <i className="fa-solid fa-truck-fast text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      {cancelled
                        ? "This order was cancelled"
                        : currentStatus === "Delivered"
                          ? "Your order has been delivered"
                          : "Your order status"}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {cancelled
                        ? "Please contact support if you need assistance."
                        : `Current status: ${currentStatus}`}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="mb-7 mt-8 text-xl font-bold text-stone-900">
                Order Tracking
              </h2>

              {cancelled ? (
                <p className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">
                  <i className="fa-solid fa-circle-xmark mr-2" />
                  Order Cancelled
                </p>
              ) : (
                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const completed = index <= currentStep;
                    const active = index === currentStep;

                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? active
                                  ? "bg-orange-500 text-white"
                                  : "bg-emerald-500 text-white"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <i className={`fa-solid ${step.icon}`} />
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`mt-2 min-h-8 w-1 rounded ${
                                index < currentStep
                                  ? "bg-emerald-500"
                                  : "bg-stone-200"
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-2">
                          <h3
                            className={`font-bold ${
                              active ? "text-orange-600" : "text-stone-900"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className="mt-1 text-sm text-stone-500">
                            {completed
                              ? active
                                ? "This is the current order status."
                                : "This stage has been completed."
                              : "This stage is pending."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-stone-600">
                <i className="fa-solid fa-circle-info mr-2 text-orange-500" />
                Tracking progress reflects the current order status saved by the store.
              </p>
            </section>

            <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-stone-900">
                Items in This Order
              </h2>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item.product || index}
                    className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-stone-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-stone-800">
                      ₹
                      {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TrackOrderPage;
