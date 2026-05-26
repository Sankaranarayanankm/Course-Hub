import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    queryClient.invalidateQueries(["authUser"]);
  };

  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      {/* Brand */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">
        CourseHub
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
          {user?.role}
        </span>

        {/* User name */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl cursor-pointer border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-md transition-all duration-200">
          <span
            onClick={() => navigate("me")}
            className="text-sm cursor-pointer font-medium text-slate-700"
          >
            {user?.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm px-4  cursor-pointer py-2 rounded-xl bg-black text-white hover:opacity-90 transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
