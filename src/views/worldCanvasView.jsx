import "/src/style.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";

export function WorldCanvasView({ sketch, x, y }) {
  return (
    <div>
      <ReactP5Wrapper sketch={sketch} translateX={x} translateY={y} />
    </div>
  );
}
