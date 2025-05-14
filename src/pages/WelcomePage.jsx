import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/global.css";

export function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 8600);
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <img
          src="/assets/pixelWorld-intro-gif.gif"
          alt="Loading..."
          className="w-100 h-100"
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <h1>Welcome Page</h1>
      <div className="flex items-center justify-start">
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/login"
        >
          Login
        </Link>
        <br />
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/world"
        >
          World
        </Link>
        <br />
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/profile"
        >
          Profile
        </Link>
      </div>
      <h1>
        {user
          ? user.displayName
            ? `Welcome back, ${user.displayName}`
            : `Welcome back, ${user.email}`
          : "Welcome to Pixelworld!"}
      </h1>
      {user && (
        <button
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
          onClick={() => {
            onLogout(navigate);
          }}
        >
          Sign out
        </button>
      )}
    </div>
  );
}
