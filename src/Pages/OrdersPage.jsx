import { useEffect, useState } from "react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
       const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
          console.log("Orders fetched successfully:", data.orders);
        } else {
          setError(data.message || "Unable to fetch orders");
        }
      } catch (error) {
        console.error("Get orders error:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">My Orders</h1>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-red-600">{error}</p>
          </div>
        )}

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              <i className="fa-solid fa-box-open"></i>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              No Orders Yet
            </h2>

            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                {/* Order Header */}
                <div className="mb-5 flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-bold text-gray-800">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-gray-800">
                      ₹ {order.total?.toFixed(2)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-700">
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Status */}
                <div className="mt-5 flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-sm text-gray-500">Order Status</span>

                    <p className="font-semibold text-green-600">
                      {order.orderStatus}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">
                      Payment Status
                    </span>

                    <p className="font-semibold text-orange-600">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
