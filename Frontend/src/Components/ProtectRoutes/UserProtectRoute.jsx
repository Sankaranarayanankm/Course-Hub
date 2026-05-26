import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import LoadingScreen from "../LoadingScreen";
import { CloudCog } from "lucide-react";

const UserProtectRoute = ({ user, allowedRoutes, loading }) => {
  if (!user) return <Navigate to="/login" />;
  if (loading) return <LoadingScreen />;
  if (allowedRoutes && allowedRoutes !== user.role) {
    return (
      <Navigate
        to={user.role === "teacher" ? "/courses" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default UserProtectRoute;
