import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/global.css";
import { NavBar } from "../components/NavBar";

export function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="font-pixel min-h-[calc(100vh-8rem)] flex flex-col">
      <div>{user ? <NavBar className="w-full p-8 px-6 pt-6" /> : ""}</div>
      <div className="flex-grow flex flex-col justify-center items-center space-y-4">
        {user ? <h4></h4> : <h4>Welcome to</h4>}
        <h1 className="text-6xl">Pixel World</h1>
        <h1>
          {user ? (
            user.displayName ? (
              `Welcome back, ${user.displayName}`
            ) : (
              `Welcome back, ${user.email}`
            )
          ) : (
            <div className="flex items-center">
              <Link
                className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                to="/login"
              >
                Login/ Sign up
              </Link>
            </div>
          )}
        </h1>
        <div>
          <h3 className="px-8">
            Become a pixel artist! Pixel World allows you to paint pixelated
            images to later display them in a digital gallery. Accompanied by
            real-time weather and inspirational quotes.
          </h3>
        </div>
        <div className="flex">
          <img
            src="public\assets\Krisztina portfolio.jpeg.jpg"
            className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
          ></img>
          <h3>Krisztina Biro</h3>
        </div>
      </div>
    </div>
  );
}
