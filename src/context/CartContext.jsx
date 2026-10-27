import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartError, setCartError] = useState("");

  const addToCart = (product) => {
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) {
      setCartError(`${product.name} is currently out of stock.`);
      return;
    }

    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct && existingProduct.quantity >= stock) {
      setCartError(
        `Only ${stock} units of ${product.name} are available. Please reduce the quantity to continue.`,
      );
      return;
    }

    setCartError("");

    setCartItems((previousItems) => {
      const existing = previousItems.find((item) => item.id === product.id);

      if (existing) {
        return previousItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, stock }
            : item,
        );
      }

      return [
        ...previousItems,
        {
          ...product,
          stock,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find((product) => product.id === productId);

    if (!item) return;

    const stock = Number(item.stock ?? 0);

    if (item.quantity >= stock) {
      setCartError(
        `Only ${stock} units of ${item.name} are available. You cannot add more than this.`,
      );
      return;
    }

    setCartError("");

    setCartItems((previousItems) =>
      previousItems.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    );
  };

  const decreaseQuantity = (productId) => {
    setCartError("");

    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCartError("");

    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== productId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartError("");
  };

  const clearCartError = () => {
    setCartError("");
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartError,
        setCartError,
        clearCartError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
