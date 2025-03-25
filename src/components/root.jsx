import { observer } from "mobx-react-lite";
import { ReactP5Wrapper } from "@p5-wrapper/react";

export const RootPage = observer(({ model }) => {
  function onPositionChange(event) {
    const { id, value } = event.target;
    model.position[id] = parseInt(value);
  }

  function onMove(event) {
    console.log("onMove");
    if (event.key === "ArrowUp") {
      model.position.y -= 3;
    } else if (event.key === "ArrowDown") {
      model.position.y += 3;
    }
    if (event.key === "ArrowLeft") {
      model.position.x -= 3;
    } else if (event.key === "ArrowRight") {
      model.position.x += 3;
    }
  }

  return (
    <div tabIndex={0}>
      <ReactP5Wrapper
        sketch={model.sketch}
        translateX={model.position.x}
        translateY={model.position.y}
      />
      <input
        id="x"
        type="range"
        defaultValue={model.position.x}
        min="-300"
        max="300"
        step="1"
        onChange={onPositionChange}
      />
      <input
        id="y"
        type="range"
        defaultValue={model.position.y}
        min="-300"
        max="300"
        step="1"
        onChange={onPositionChange}
      />
    </div>
  );
});
