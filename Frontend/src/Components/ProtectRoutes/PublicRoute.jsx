import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ user }) => {
  if (user)
    return <Navigate to={user.role == "teacher" ? "/courses" : "/dashboard"} />;
  else {
    <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default PublicRoute;
