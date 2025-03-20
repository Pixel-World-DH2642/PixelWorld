// TODO make a reactive model, set it to window.myModel
import { createRoot } from "react-dom/client";
import { observable, configure } from "mobx";
import "../style.css";
import { model } from "./model";
import * as demoSketch from "./sketches/demo";
import { RootPage } from "./components/root";

configure({ enforceActions: "never" });

const reactiveModel = observable(model);
reactiveModel.sketch = demoSketch.sketch;

createRoot(document.getElementById("root")).render(
  <RootPage model={reactiveModel}></RootPage>
);
