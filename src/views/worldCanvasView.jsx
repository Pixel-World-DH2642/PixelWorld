import "/src/style.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";

export function WorldCanvasView({ model }) {
  function onPositionChange(event) {
    const { id, value } = event.target;
    model.position[id] = parseInt(value);
  }
  return (
    <div>
      <ReactP5Wrapper
        sketch={model.sketch}
        translateX={model.position.x}
        translateY={model.position.y}
        onPositionChange={onPositionChange}
      />
    </div>
  );
}
