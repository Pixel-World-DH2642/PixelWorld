import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";
//import { Link } from "react-router-dom";
import { Menu } from "../components/Menu";
import { PixelEditor } from "../components/PixelEditor";
import { WeatherDashboard } from "../components/weatherDashboard";
import { useEffect } from "react";

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
  console.log(weather);
  function getNewQuote() {
    onGetQuote();
  }

  useEffect(() => {
    onGetWeather();
  }, []);

  return (
    <div>
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
      </div>
      <div className="flex">
        <PixelEditor />
        <WeatherDashboard />
      </div>
    </div>
  );
}
