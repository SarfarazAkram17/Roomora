"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${window.location.origin}/api/auth/check`);
        setUser(res.data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  // register function
  const register = async (name, email, password, photo) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${window.location.origin}/api/auth/register`,
        {
          name,
          email,
          password,
          photo,
          role: "user",
        }
      );

      if (res.status === 201) {
        toast.success("Registration successful!");
        setUser(res.data.user);
        router.push("/");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${window.location.origin}/api/auth/login`, {
        email,
        password,
      });
      if (res.status === 200) {
        setUser(res.data.user);
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${window.location.origin}/api/auth/logout`);
      if (res.status === 200) {
        setUser(null);
        toast.success("Logged out successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isOpen, setIsOpen, user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
