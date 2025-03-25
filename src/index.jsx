//Import Root
import { createRoot } from "react-dom/client";
import { observable, configure } from "mobx";
import "./style.css";
//Import Model
import { model } from "./model_data/model";

//Import Utils
import { UI_INPUT_TYPE } from "/src/utils/inputSystem";

import { RootPage } from "./components/root";

configure({ enforceActions: "never" });

//Persistence
//import { connectToPersistence } from "../firestoreModel.js";

//-------------------------------Bootstrapping------------------------------//
//Instantiate Reactive Model
const reactiveModel = observable(model);

reactiveModel.inputHandler.addBinding(
  () => {
    console.log(reactiveModel.position);
    reactiveModel.position.x += 10;
  },
  UI_INPUT_TYPE.CODE_DOWN,
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

//Firebase
//connectToPersistence(reactiveModel, reaction);

//Simple Reaction Model
//reaction(checkChangeACB, sideEffectACB);
/*
function checkChangeACB(){
    return [reactiveModel...]
}

function sideEffectACB(){
    reactiveModel...;
}
*/

window.model = reactiveModel;
