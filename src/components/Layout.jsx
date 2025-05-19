import React from "react";
import { useLocation } from "react-router-dom";

export function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div
      className="min-h-screen w-full h-full bg-cover bg-center bg-no-repeat p-8 flex justify-center items-center min-w-min"
      style={{
        backgroundImage: 'url("/assets/background.png")',
        imageRendering: "pixelated",
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-lg ${isLoginPage ? "w-auto" : "lg:min-w-3xl lg:max-w-6xl"} overflow-auto text-base`}
      >
        {children}
      </div>
    </div>
  );
}
