import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";

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

  //Axios instance with interceptors

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, //Send cookies with every request
  });

  //Request interceptor to add access token to headers
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - handle token refresh

  api.interceptors.response.use(
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
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, log out user
          setUser(null);
          setAccessToken(null);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  // Login function

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Login error", error);
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setUser(userResponse.data.user);
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    api, // Expose the Axios instance for making authenticated requests
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
