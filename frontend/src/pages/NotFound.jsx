import React from "react";
import { useNavigate } from "react-router-dom";
import sharkImage from "../assets/images/logo_shark.png";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="text-center">
        <div className="flex justify-center">
          <img src={sharkImage} alt="Shark Logo" className="h-48 w-48" />
        </div>
        <h1 className="text-9xl font-bold text-blue-600 mt-4">404</h1>
        <p className="mt-0 text-l text-gray-700 mt-2">
          The page you have been looking for might have been removed,
        </p>
        <p className="mt-0 text-l text-gray-700 mt-2">
          had its name changed, or is temporarily unavailable.
        </p>
        <button
          className="mt-4 px-6 py-2 text-3xl text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
