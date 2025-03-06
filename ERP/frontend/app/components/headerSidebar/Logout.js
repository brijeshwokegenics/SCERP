"use client";
import {ArrowCircleRightIcon } from "@heroicons/react/outline";

const LogoutButton = ({ onClick }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none transition-all duration-300"
      >
        <ArrowCircleRightIcon className="h-5 w-5" />

      </button>
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-max bg-gray-700 text-white text-xs rounded px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ">
        Click to Logout
      </div>
    </div>
  );
};

export default LogoutButton;
