import { createRoot } from "react-dom/client";
import { observable, configure } from "mobx";
import "./style.css";
import { model } from "./model";
import * as demoSketch from "./sketches/sketch";
import { RootPage } from "./components/root";
import { UI_INPUT_TYPE } from "/src/utils/inputSystem";

configure({ enforceActions: "never" });

const reactiveModel = observable(model);
reactiveModel.sketch = demoSketch.sketch;

reactiveModel.inputHandler.addBinding(
  () => {
    console.log(reactiveModel.position);
    reactiveModel.position.x += 10;
  },
  UI_INPUT_TYPE.KEY_DOWN,
  "ArrowRight",
);
reactiveModel.inputHandler.addBinding(
  () => {
    console.log(reactiveModel.position);
    reactiveModel.position.x -= 10;
  },
  UI_INPUT_TYPE.CODE_DOWN,
  "ArrowLeft",
);
reactiveModel.inputHandler.addBinding(
  () => {
    console.log(reactiveModel.position);
    reactiveModel.position.y -= 10;
  },
  UI_INPUT_TYPE.CODE_DOWN,
  "ArrowUp",
);
reactiveModel.inputHandler.addBinding(
  () => {
    console.log(reactiveModel.position);
    reactiveModel.position.y += 10;
  },
  UI_INPUT_TYPE.CODE_DOWN,
  "ArrowDown",
);

createRoot(document.getElementById("root")).render(
  <RootPage model={reactiveModel}></RootPage>,
);
