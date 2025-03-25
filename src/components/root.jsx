import { observer } from "mobx-react-lite";
import { ReactP5Wrapper } from "@p5-wrapper/react";

export const RootPage = observer(({ model }) => {
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
