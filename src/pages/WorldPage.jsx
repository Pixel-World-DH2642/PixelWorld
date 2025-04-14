import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";
import { Link } from "react-router-dom";

export function WorldPage({
  quote,
  selectedColor,
  painting,
  weather,
  player,
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

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1>World Page</h1>
      <div className="flex items-center justify-center">
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/"
        >
          Back to welcome
        </Link>
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/museum"
        >
          To museum
        </Link>
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/profile"
        >
          To profile
        </Link>
      </div>

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
  );
}
