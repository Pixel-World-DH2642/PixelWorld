import * as reactSketch from "./sketches/sketch";
//Import Utils
import { createInputHandler } from "./utils/inputSystem";

export const model = {
  inputHandler: createInputHandler(),
  sketch: reactSketch.sketch,
  position: { x: 0, y: 0 },
};
