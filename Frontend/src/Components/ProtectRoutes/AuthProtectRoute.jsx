import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";

const AuthProtectRoute = ({ user, loading }) => {
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AuthProtectRoute;
