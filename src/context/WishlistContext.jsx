import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const API_URL = "http://localhost:5000/api/wishlist";

export function WishlistProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !getToken()) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Wishlist load nahi hui.");
      }

      setWishlistItems(data.wishlist || []);
    } catch (err) {
      setError(err.message || "Wishlist load nahi hui.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setError("");
    }
  }, [authLoading, isAuthenticated, fetchWishlist]);

  const addToWishlist = async (productId) => {
    const token = getToken();

    if (!isAuthenticated || !token) {
      return { success: false, message: "Wishlist ke liye login karo." };
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product add nahi hua.");
      }

      await fetchWishlist();

      return { success: true, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Product add nahi hua.",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getToken();

    if (!isAuthenticated || !token) {
      return { success: false, message: "Wishlist ke liye login karo." };
    }

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product remove nahi hua.");
      }

      setWishlistItems((items) =>
        items.filter((item) => {
          const product = item.product || item;
          return String(product._id || product.id) !== String(productId);
        }),
      );

      return { success: true, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Product remove nahi hua.",
      };
    }
  };

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => {
      const product = item.product || item;
      return String(product._id || product.id) === String(productId);
    });

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        error,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
