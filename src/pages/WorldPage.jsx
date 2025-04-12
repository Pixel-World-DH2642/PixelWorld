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
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1>World Page</h1>
      <Link to="/">Back to welcome</Link>
      <Link to="/profile">To profile</Link>
      <ReactP5Wrapper sketch={sketch} />
      <Link to="/museum">To museum</Link>
    </div>
  );
}
