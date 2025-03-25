//Import Root
import { createRoot } from "react-dom/client";
import { observable, configure } from "mobx";
import "./style.css";
//Import Model
import { model } from "./model_data/model";
import * as demoSketch from "./sketches/demo";
import { RootPage } from "./components/root";

configure({ enforceActions: "never" });

//Persistence
//import { connectToPersistence } from "../firestoreModel.js";

//-------------------------------Bootstrapping------------------------------//
//Instantiate Reactive Model
const reactiveModel = observable(model);
reactiveModel.sketch = demoSketch.sketch;

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
