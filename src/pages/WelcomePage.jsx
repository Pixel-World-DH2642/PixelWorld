import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/global.css";
import { NavBar } from "../components/NavBar";
import { ScrollFade } from "../components/ScrollFade";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MuseumIcon from "@mui/icons-material/Museum";

export function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(() => {
    return sessionStorage.getItem("hasShownLoader") !== "true";
  });

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        sessionStorage.setItem("hasShownLoader", "true");
      }, 5900);

      return () => clearTimeout(timer);
    }
  }, [showLoader]);

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

  const FancyButton = ({ children, onClick }) => {
    return (
      <button
        onClick={onClick}
        className="my-2 text-4xl py-2 font-semibold hover:bg-gray-100 transition duration-300 ease-in-out text-gray-800 flex items-center gap-4 relative group cursor-pointer"
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-1 bg-gray-800 group-hover:w-full transition-all duration-300 ease-in-out"></span>
      </button>
    );
  };

  const FeatureCard = ({ icon, title, description }) => {
    return (
      <div className="flex flex-col items-center pb-4">
        <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full shadow">
          {icon}
        </div>
        <div className="mt-2 w-full text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-1">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="font-pixel max-h-[calc(100vh-4rem)] overflow-y-auto flex flex-col p-4 sm:p-8">
      <div>
        <NavBar
          enableBack={false}
          title="Pixel World"
          className="w-full p-8 px-6 pt-10 "
        />
      </div>
      <ScrollFade></ScrollFade>
      <div className="flex-grow flex flex-col justify-center items-start space-y-4 pt-24">
        <h1 className="text-6xl justify-center items-center ">Pixel World</h1>
        <ScrollFade>
          <h3 className="text-lg text-start w-2/3 pb-12">
            Become a pixel artist! Pixel World allows you to paint pixelated
            images to later display them in a digital gallery. Accompanied by
            real-time weather and inspirational quotes.
          </h3>

          <div className="pb-10">
            {user ? (
              <>
                {user.displayName ? (
                  <div className="text-xl">
                    Welcome back,{" "}
                    <span className="font-bold">{user.displayName}</span>
                  </div>
                ) : (
                  <>
                    Welcome back <span className="font-bold">{user.email}</span>
                  </>
                )}
                <FancyButton
                  onClick={() => {
                    navigate("/world");
                  }}
                >
                  <p className="text-start">Enter the Pixel World</p>
                  <img src="/assets/forward_arrow.png" className="h-8"></img>
                </FancyButton>
              </>
            ) : (
              <FancyButton
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
                <img src="/assets/forward_arrow.png" className="h-8"></img>
              </FancyButton>
            )}
            <FancyButton
              onClick={() => {
                navigate("/museum");
              }}
            >
              Museum
              <img src="/assets/forward_arrow.png" className="h-8"></img>
            </FancyButton>
          </div>
        </ScrollFade>
        <ScrollFade className="pt-5 w-full">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-10 gap-8">
            {/* Card 1 */}
            <FeatureCard
              icon={<SportsEsportsIcon fontSize="large" />}
              title="Get inspired by the Pixel World!"
              description="Explore the pixelated world and let your creativity flow."
            />
            {/* Card 2 */}
            <FeatureCard
              icon={<ColorLensIcon fontSize="large" />}
              title="Grab the paint brush!"
              description="Master the art of pixels and make it yours."
            />
            {/* Card 3 */}
            <FeatureCard
              icon={<FormatQuoteIcon fontSize="large" />}
              title="Having a creative block?"
              description="Spark your imagination with an inspirational quote."
            />
            {/* Card 4 */}
            <FeatureCard
              icon={<WbSunnyIcon fontSize="large" />}
              title="Real-time weather"
              description="Stay updated with the current weather in the pixelated world."
            />
            {/* Card 5 */}
            <FeatureCard
              icon={<MuseumIcon fontSize="large" />}
              title="Museum"
              description="Explore the digital gallery of pixelated art craeted by other players. You can submit your own art to the museum as well!"
            />
          </div>
        </ScrollFade>

        <ScrollFade>
          <div className="">
            <h1 className="pb-4 text-lg">Meet the Team</h1>
            <div className="flex pb-4">
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
            <div className="flex pb-4">
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
            <div className="flex pb-4">
              <img
                src="\assets\pixidave.png"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  David Segal
                </h2>
                <div className="max-w-xl">
                  <p className="text-sm text-gray-600">
                    Creator of MicroEngine game engine, the pixel editor and
                    general design & dev.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex pb-4">
              <img
                src="\assets\Lambo.jpg"
                className=" flex w-13 h-13 sm:w-16 sm:h-16 aspect-square bg-gray-400 rounded-full border border-black "
              ></img>
              <div className="ml-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Lambo (Jingwen Zhuang)
                </h2>
                <p className="text-sm text-gray-600">
                  Project architect, redux and tailwind wizard
                </p>
              </div>
            </div>
          </div>
        </ScrollFade>
      </div>
    </div>
  );
}
