import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";
import { Menu } from "../components/Menu";
import { PixelEditor } from "../components/PixelEditor";
import { WeatherDashboard } from "../components/weatherDashboard";
import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { SubmitModal } from "../components/SubmitModal";

export function WorldPage({
  quote,
  selectedColor,
  painting,
  weather,
  player,
  onGetWeather,
  onGetQuote,
  onSelectQuote,
  onDeleteQuote,
  onDrawPixel,
  onSelectColor,
  onSubmitPainting,
  onResetPainting,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(weather);
  function getNewQuote() {
    onGetQuote();
  }

  useEffect(() => {
    onGetWeather();
  }, []);

  return (
    <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar />
      <div className="flex flex-col items-center justify-center text-center">
        <Menu />
        <h1>World Page</h1>

        <ReactP5Wrapper sketch={sketch} />

        <div className="flex items-center justify-center">
          <button
            className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={getNewQuote}
          >
            Get a new quote
          </button>
          <p>Quote of the day: {quote.content}</p>
        </div>

        <button
          className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Submit Painting
        </button>
      </div>
      <div className="flex">
        <PixelEditor />
        <WeatherDashboard />
      </div>

      <SubmitModal
        quote={quote}
        painting={painting}
        onSubmitPainting={onSubmitPainting}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
