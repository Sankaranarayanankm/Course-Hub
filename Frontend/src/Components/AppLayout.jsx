import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = ({ user }) => {
  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <Navbar user={user} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user?.role} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
