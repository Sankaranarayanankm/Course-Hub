import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TEACHER_SIDEBAR } from "../data/teacherData";
import { STUDENT_SIDEBAR } from "../data/student";
import { PanelLeft, PanelRight } from "lucide-react";

const Sidebar = ({ role }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();

  const sidebarItems = role === "teacher" ? TEACHER_SIDEBAR : STUDENT_SIDEBAR;

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-200 transition-all duration-300 ${
        showSidebar ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h2
          className={`font-bold text-slate-900 transition-all ${
            showSidebar ? "block" : "hidden"
          }`}
        >
          Menu
        </h2>

        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="p-2 rounded-xl hover:bg-slate-100 transition"
        >
          {showSidebar ? (
            <PanelLeft size={20} className="text-slate-700" />
          ) : (
            <PanelRight size={20} className="text-slate-700" />
          )}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex flex-col gap-1 p-3">
        {sidebarItems.map((item) => {
          const Icon = item?.icon;
          const label = item?.label;

          const path = `/${label.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <li key={label}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition group
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-black"
                  }
                  ${!showSidebar ? "justify-center" : ""}
                `}
              >
                {/* ICON */}
                {Icon ? (
                  <Icon size={20} />
                ) : (
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                )}

                {/* LABEL */}
                {showSidebar && (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
