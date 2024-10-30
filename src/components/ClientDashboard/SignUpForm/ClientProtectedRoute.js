import React from "react";
import { Navigate } from "react-router-dom";

const ClientProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/user" />;
};

export default ClientProtectedRoute;
