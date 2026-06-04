import { useContext, useEffect, useMemo } from "react";
import { createContext, useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  console.log("AuthProvider mounted");
  // ✅ FIXED: Create axios instance only once using useMemo
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        // ⚠️ We'll fix this part below
        const token = accessToken;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const { data } = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true },
            );
            setAccessToken(data.accessToken);
            originalRequest.headers["Authorization"] =
              `Bearer ${data.accessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setAccessToken(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, []); // ✅ Empty dependency array - create once

  // ✅ FIXED: Update interceptor when accessToken changes
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Cleanup - remove interceptor on unmount or when token changes
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, api]);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      console.log("Login successful:", data);
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.table(error.response);
      toast.error(error.response?.data?.message || "Registration failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      <ToastContainer />;
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  // ✅ Initialize auth on mount - this is CORRECT placement
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Attempting to refresh token...");
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        console.log("✅ Token refreshed");
        setAccessToken(data.accessToken);

        const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        console.log("✅ User data loaded:", userResponse.data.user);
        setUser(userResponse.data.user);
      } catch (error) {
        console.log("ℹ️ No valid session found");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []); // ✅ Run once on mount

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
