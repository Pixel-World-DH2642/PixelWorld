import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";

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
    <div>
      <h1>World Page</h1>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}
