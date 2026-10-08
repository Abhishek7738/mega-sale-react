import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
