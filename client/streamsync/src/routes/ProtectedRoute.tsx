// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

export const ProtectedRoute = ({ children }: { children: any }) => {
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get("/auth/verify-token");
        setValid(true);
      } catch (err) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.token) verifyToken();
    else setLoading(false);
  }, [cookies.token]);

  if (loading) return <div className="text-white">Checking authentication...</div>;

  return valid ? children : <Navigate to="/login" />;
};
