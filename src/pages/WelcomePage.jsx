import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/global.css";
import { NavBar } from "../components/NavBar";
import { ScrollFade } from "../components/ScrollFade";

export function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="font-pixel max-h-[80vh] overflow-y-auto flex flex-col px-9 pt-3">
      <div>
        {user ? (
          <NavBar
            enableBack={false}
            title="Pixel World"
            className="w-full p-8 px-6 pt-10 "
          />
        ) : (
          ""
        )}
      </div>
      <ScrollFade></ScrollFade>
      <div className="flex-grow flex flex-col justify-center items-center space-y-4 pt-20">
        {user ? <h4></h4> : <h4>Welcome to</h4>}
        <h1 className="text-6xl justify-center items-center ">Pixel World</h1>
        <ScrollFade>
          <div className="max-w-xl text-center">
            <h3 className="px-10 text-sm sm:text-lg">
              Become a pixel artist! Pixel World allows you to paint pixelated
              images to later display them in a digital gallery. Accompanied by
              real-time weather and inspirational quotes.
            </h3>
          </div>
        </ScrollFade>
        <h1 className="pb-10">
          {user ? (
            user.displayName ? (
              <>
                Welcome back,{" "}
                <span className="font-bold">{user.displayName}</span>
              </>
            ) : (
              <>
                Welcome back <span className="font-bold">{user.email}</span>
              </>
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
        <ScrollFade>
          <div className="">
            <h1 className="pb-3">Meet the Team</h1>
            <div className="flex pb-5">
              <img
                src="\assets\Krisztina portfolio.jpeg.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Krisztina Biro
                </h2>
                <div className="max-w-xl text-center">
                  <p className="text-sm text-gray-600">
                    Designer of the Museum Page and the look and feel of the
                    app!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex pb-5">
              <img
                src="\assets\GABA.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Gabi Kiryluk
                </h2>
                <p className="text-sm text-gray-600">
                  Creator of the painting details page, the look and feel and
                  the welcome page!
                </p>
              </div>
            </div>
            <div className="flex pb-5">
              <img
                src="\assets\Krisztina portfolio.jpeg.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  David Segal
                </h2>
                <div className="max-w-xl text-center">
                  <p className="text-sm text-gray-600">
                    Designer of the Museum Page and the look and feel of the
                    app!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex pb-5">
              <img
                src="\assets\GABA.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Lambo Zhuang
                </h2>
                <p className="text-sm text-gray-600">
                  Creator of the painting details page, the look and feel and
                  the welcome page!
                </p>
              </div>
            </div>
          </div>
        </ScrollFade>
      </div>
    </div>
  );
}
