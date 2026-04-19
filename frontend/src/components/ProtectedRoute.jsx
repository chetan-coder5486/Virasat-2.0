import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const navigate = useNavigate();

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>...Loading... </div>;
  }
  if (!user) {
    return navigate("/login");
  }

  //check roles
  if (!roles.length > 0 && !roles.include(user.role)) {
    return navigate("/unauthorised");
  }
  return children;
};

export default ProtectedRoute;
