import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const getPrice = (price) => {
    return Number(String(price).replace(/[^\d.]/g, ""));
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + getPrice(item.price) * item.quantity;
  }, 0);

  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const totalAmount = subtotal + deliveryCharge;
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: item.id,
            name: item.name,
            price: getPrice(item.price),
            quantity: item.quantity,
          })),
          customer,
          subtotal,
          deliveryCharge,
          total: totalAmount,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Order placed successfully:", data);
        navigate("/orders");
      } else {
        console.error("Order failed:", data);
      }
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-6xl">🛒</div>

          <h1 className="mb-3 text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="mb-6 text-gray-500">
            Aapke cart mein abhi koi product nahi hai.
          </p>

          <Link
            to="/"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Checkout</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Details */}
          <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Delivery Details
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  placeholder="Enter your complete address"
                  rows="4"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  required
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between gap-4 border-b pb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-700">
                    ₹ {(getPrice(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹ {deliveryCharge.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:underline"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
