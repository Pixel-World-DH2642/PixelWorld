//
import * as reactSketch from "../sketches/sketch";
//Import Utils
import { createInputHandler } from "../utils/inputSystem";
import { UI_INPUT_TYPE } from "/src/utils/inputSystem";

export function createWorldModel() {
  const inputHandler = createInputHandler();
  let sketch = reactSketch.sketch;

  //Input Mapping
  //reactiveModel.sketch = demoSketch.sketch;

  return {
    inputHandler,
    sketch,
    position: { x: 0, y: 0 },
  };
}

export const model = {
  inputHandler: createInputHandler(),
  sketch: reactSketch.sketch,
  position: { x: 0, y: 0 },
};
