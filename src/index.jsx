// TODO make a reactive model, set it to window.myModel
import { createRoot } from "react-dom/client";
import { observable, configure } from "mobx";
import "../style.css";
import { model } from "./model";
import * as demoSketch from "./sketches/demo";
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
  UI_INPUT_TYPE.CODE_DOWN,
  "ArrowRight",
);

createRoot(document.getElementById("root")).render(
  <RootPage model={reactiveModel}></RootPage>,
);
