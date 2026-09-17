import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const getPrice = (price) => {
    return Number(String(price).replace(/[^\d.]/g, ""));
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + getPrice(item.price) * item.quantity;
  }, 0);

  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const totalAmount = subtotal + deliveryCharge;

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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Shopping Cart
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Products */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {/* Product Image */}
                <div className="flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 sm:w-28">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full rounded-lg object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.weight}
                  </p>

                  <p className="mt-2 font-semibold text-blue-600">
                    ₹ {getPrice(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.name)}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-lg font-bold text-gray-700 transition hover:bg-gray-300"
                  >
                    −
                  </button>

                  <span className="min-w-5 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.name)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-lg font-bold text-white transition hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.name)}
                  className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
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

            {/* Checkout Link */}
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-md bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <Link
              to="/"
              className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;