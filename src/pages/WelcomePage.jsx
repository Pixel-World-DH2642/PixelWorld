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
                <div className="mt-4  flex justify-center">
                  <Link
                    to="/world"
                    className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Go to the World
                  </Link>
                </div>
              </>
            ) : (
              <>
                Welcome back <span className="font-bold">{user.email}</span>
                <div className="mt-4  flex justify-center">
                  <Link
                    to="/world"
                    className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Go to the World
                  </Link>
                </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-10">
            {/* Card 1 */}
            <div className="flex flex-col items-center pb-4">
              <img
                src="/assets/worldViewscreen.png"
                alt="Pixel World View"
                className="h-48 w-auto shadow"
              />
              <div className="mt-2 w-full max-w-[12rem] text-center">
                <h2 className="text-md sm:text-lg font-semibold mb-1">
                  Get inspired by the Pixel World!
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time weather and quotes to fuel your creations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center pb-4">
              <img
                src="/assets/examplePainting.png"
                alt="Pixel Painting"
                className="h-48 w-auto shadow"
              />
              <div className="mt-2 w-full max-w-[12rem] text-center">
                <h2 className="text-md sm:text-lg font-semibold mb-1">
                  Grab the paint brush!
                </h2>
                <p className="text-sm text-gray-600">
                  Master the art of pixels and make it yours.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center pb-4">
              <img
                src="/assets/exampleQuote.png"
                alt="Inspirational Quote"
                className="h-48 w-auto shadow"
              />
              <div className="mt-2 w-full max-w-[12rem] text-center">
                <h2 className="text-md sm:text-lg font-semibold mb-1">
                  Having a creative block?
                </h2>
                <p className="text-sm text-gray-600">
                  Spark your imagination with an inspirational quote.
                </p>
              </div>
            </div>
          </div>
        </ScrollFade>

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
                <p className="text-sm text-gray-600">
                  Creator of the museum page, the hall of fame and the look and
                  feel of the app.
                </p>
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
                  Creator of the painting details page, welcome page and look
                  and feel of the app.
                </p>
              </div>
            </div>
            <div className="flex pb-5">
              <img
                src="\assets\David.png"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  David Segal
                </h2>
                <div className="max-w-xl">
                  <p className="text-sm text-gray-600">
                    Creator of pixelated world and all the magic in it!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex pb-10">
              <img
                src="\assets\Lambo.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Lambo Zhuang
                </h2>
                <p className="text-sm text-gray-600">
                  esponsible for the code structure, back-end and dynamic
                  interactions.
                </p>
              </div>
            </div>
          </div>
        </ScrollFade>
      </div>
    </div>
  );
}
