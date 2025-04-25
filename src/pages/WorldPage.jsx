import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";
//import { Link } from "react-router-dom";
import { Menu } from "../components/Menu";

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
  function getNewQuote() {
    onGetQuote();
  }

  function getWeather() {
    onGetWeather();
    console.log("weather button");
  }

  return (
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
      <div className="flex items-center justify-center">
        <button
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={getWeather}
        >
          Get Weather
        </button>
        <p>{JSON.stringify(weather)}</p>
      </div>
    </div>
  );
}
