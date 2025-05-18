import { createMicroEngine } from "../utils/engine/microEngine";
import { createActorList } from "../utils/engine/actors";

export function sketch(p5) {
  //Globals
  let sketchIsSetup = false;
  let objectsInitializedWithProps = false;
  let initialPropsBuffer = null;
  let canvasGarbageCollector;

  //Micro Engine Setup
  const MicroEngine = createMicroEngine(p5);
  const ActorList = createActorList(p5, MicroEngine);
  const mainScene = MicroEngine.CreateScene();
  //MicroEngine.LoadScene(mainScene);

  //############################--DEFINE ACTORS--############################//
  let mainCharacter, easel, skyCanvas, scribble;

  //Preload items
  let testPlant1, testPlant2, testPlant3;
  let mainCharSpriteSheet, mainCharSpriteData;

  let skyLayerActor;
  //############################-----------------############################//

  //--------------------------------Helpers----------------------------------//
  function canvasCleaner() {
    let canvasCount = 2;

    return function () {
      if (canvasCount < 2) return;
      console.log("clearing canvases");
      let badCanvases = document.getElementsByTagName("canvas");
      for (let i = 1; i < badCanvases.length; i++) {
        badCanvases[i].remove();
      }
      canvasCount = badCanvases.length;
    };
  }

  function initializeWithProps(propBuffer) {
    skyLayerActor = ActorList.createSkyLayerActor();
    ActorList.createGroundSliceActor([testPlant1, testPlant2, testPlant3]);

    easel = ActorList.createCanvasActor(p5.createVector(900, 220), {
      x: 192,
      y: 192,
    });
    const canvasComponent = easel.findComponent("CanvasComponent");
    canvasComponent.setOnPlayerPaintingUpdate(
      propBuffer.onPlayerPaintingUpdate,
    );
    canvasComponent.setCurrentColor(propBuffer.currentColor);
    canvasComponent.setCurrentTool(propBuffer.currentTool);
    canvasComponent.setPaintingData(propBuffer.playerPainting);

    mainCharacter = ActorList.createMainCharacterActor(
      mainCharSpriteSheet,
      mainCharSpriteData,
    );

    MicroEngine.LoadScene(ActorList.mainScene);
    canvasGarbageCollector = canvasCleaner();
    objectsInitializedWithProps = true;
  }

  p5.preload = () => {
    testPlant1 = p5.loadImage("/assets/flower01.png");
    testPlant2 = p5.loadImage("/assets/grass01.png");
    testPlant3 = p5.loadImage("/assets/moss01.png");
    mainCharSpriteSheet = p5.loadImage("/assets/game_assets/F_01.png");
    mainCharSpriteData = p5.loadJSON("/assets/game_assets/character.json");
  };

  p5.setup = () => {
    console.log("setup 1");
    p5.createCanvas(700, 400);
    p5.rectMode(p5.CENTER);
    p5.noSmooth();
    //p5.background(30, 40, 220);

    if (initialPropsBuffer) {
      initializeWithProps(initialPropsBuffer);
    }

    sketchIsSetup = true;
  };

  p5.updateWithProps = (props) => {
    console.log("updating props 1");
    if (!sketchIsSetup) initialPropsBuffer = props;

    ActorList.setEnvironmentWeather(props.weather.parsedData, skyLayerActor);

    //I hate this, but it has to be like this for now...
    if (!easel) return;
    const canvasComponent = easel.findComponent("CanvasComponent");
    canvasComponent.setCurrentColor(props.currentColor);
    canvasComponent.setCurrentTool(props.currentTool);

    canvasComponent.setPaintingData(props.playerPainting);
  };

  //Super ugly please be time to make better (Use the nice input system)
  let lastKeyPress;

  p5.draw = () => {
    p5.background(30, 40, 220);
    //p5.translate(-p5.width / 2, -p5.height / 2);

    MicroEngine.EngineLoop();

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      mainCharacter.findComponent("Animation").setAnimationState("WalkLeft");
      mainCharacter.findComponent("GroundMove").move(-1);
      lastKeyPress = p5.LEFT_ARROW;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      mainCharacter.findComponent("Animation").setAnimationState("WalkRight");
      mainCharacter.findComponent("GroundMove").move(1);
      lastKeyPress = p5.RIGHT_ARROW;
    } else if (lastKeyPress == p5.LEFT_ARROW) {
      mainCharacter.findComponent("Animation").setAnimationState("IdleLeft");
    } else if (lastKeyPress == p5.RIGHT_ARROW) {
      mainCharacter.findComponent("Animation").setAnimationState("IdleRight");
    }

    if (p5.mouseIsPressed) {
      //Future: use input system
      easel.findComponent("CanvasComponent").processInput();
    }

    if (canvasGarbageCollector) canvasGarbageCollector();
  };

  p5.windowResized = () => {
    const parentElement = document.getElementById("viewport-container");
    p5.resizeCanvas(Math.min(800, parentElement.clientWidth), 400);
  };

  p5.mouseReleased = () => {
    //Future: use input system
    // easel.findComponent("CanvasComponent").inputComplete();
  };

  p5.keyPressed = () => {
    //console.log("kdjb")
    if (p5.keyIsDown(p5.UP_ARROW))
      mainCharacter.forceComponent.addForce(p5.createVector(0, -3));
  };
}
