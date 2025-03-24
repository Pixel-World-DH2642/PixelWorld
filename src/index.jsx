// TODO make a reactive model, set it to window.myModel
//-------------------------------IMPORT------------------------------//
//Import React + Mobx Functions
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import {observable, configure, reaction} from "mobx";

//Import Root
import{ReactRoot} from "./ReactRoot.jsx";

//Import Model
import { worldModel } from "./model_data/world_model";

//Persistence
//import { connectToPersistence } from "../firestoreModel.js";

//-------------------------------Bootstrapping------------------------------//
//Instantiate Reactive Model
const reactiveWorldModel = observable(worldModel);
//Mount The App
createRoot(document.getElementById('root')).render(<ReactRoot model={reactiveWorldModel} />);

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
