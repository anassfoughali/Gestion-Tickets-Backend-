import React from "react";
import { FiUser, FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const BLUE = "#2784c1";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center h-16 gap-4 px-6 bg-white border-b border-gray-200">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600 transition">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: BLUE }}>
            <FiUser size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.username}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;