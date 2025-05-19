import { createMicroEngine } from "../utils/engine/microEngine";
import { createActorList } from "../utils/engine/actors";
import { PANEL_STATES } from "../app/slices/worldSlice";

export function sketch(p5) {
  //Globals
  let sketchIsSetup = false;
  let objectsInitializedWithProps = false;
  let initialPropsBuffer = null;
  let canvasGarbageCollector;
  let zoneState = PANEL_STATES.WORLD;
  let onPanelStateChange = null;

  let handleSketchReady = null;

  //Micro Engine Setup
  const MicroEngine = createMicroEngine(p5);
  const ActorList = createActorList(p5, MicroEngine);
  const mainScene = MicroEngine.CreateScene();
  //MicroEngine.LoadScene(mainScene);

  //############################--DEFINE ACTORS--############################//
  let mainCharacter,
    easelActor,
    skyLayerActor,
    museumActor,
    billboardActor,
    weatherStationActor;

  //Preload items
  let testPlant1, testPlant2, testPlant3;
  let mainCharSpriteSheet, mainCharSpriteData;
  let museum, billboard, weatherStation;

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

  function onZoneChange(zone) {
    if (zoneState == zone || !onPanelStateChange) return;
    //console.log(zone + " " + zoneState);
    zoneState = zone;

    //console.log(zone);

    switch (zoneState) {
      case PANEL_STATES.EDITOR:
        onPanelStateChange(zoneState);
        break;
      case PANEL_STATES.QUOTE:
        onPanelStateChange(zoneState);
        break;
      case PANEL_STATES.WEATHER:
        onPanelStateChange(zoneState);
        break;
      case PANEL_STATES.WORLD:
        onPanelStateChange(zoneState);
        break;
      case "MUSEUM":
        //Navigate to museum...
        break;
    }
  }

  function initializeWithProps(propBuffer) {
    //Handlers
    handleSketchReady = propBuffer.onSketchReady;
    onPanelStateChange = propBuffer.onPanelStateChange;

    //Actors
    skyLayerActor = ActorList.createSkyLayerActor();
    ActorList.setEnvironmentWeather(
      propBuffer.weather.parsedData,
      skyLayerActor,
    );
    ActorList.createGroundSliceActor([testPlant1, testPlant2, testPlant3]);

    easelActor = ActorList.createCanvasActor(
      p5.createVector(1300, 220),
      {
        x: 192,
        y: 192,
      },
      propBuffer.onPlayerPaintingUpdate,
    );
    const canvasComponent = easelActor.findComponent("CanvasComponent");

    canvasComponent.setCurrentColor(propBuffer.currentColor);
    canvasComponent.setCurrentTool(propBuffer.currentTool);
    canvasComponent.setPaintingData(propBuffer.playerPainting);

    museumActor = ActorList.createImageActor(p5.createVector(150, 220), museum);

    billboardActor = ActorList.createImageActor(
      p5.createVector(700, 220),
      billboard,
      { scale: 1 },
    );
    weatherStationActor = ActorList.createImageActor(
      p5.createVector(1800, 190),
      weatherStation,
      { scale: 1.5, tint: () => p5.tint(220) },
    );

    mainCharacter = ActorList.createMainCharacterActor(
      mainCharSpriteSheet,
      mainCharSpriteData,
    );

    //ADD WORLD ZONES
    const worldZones = mainCharacter.findComponent("ZoneCallback");

    function exit(name) {
      onZoneChange("world");
    }
    worldZones.addZone(
      PANEL_STATES.EDITOR,
      easelActor.pos.x,
      300,
      onZoneChange,
      exit,
    );
    worldZones.addZone("museum", museumActor.pos.x, 80, onZoneChange, exit);
    worldZones.addZone(
      PANEL_STATES.QUOTE,
      billboardActor.pos.x,
      300,
      onZoneChange,
      exit,
    );
    worldZones.addZone(
      PANEL_STATES.WEATHER,
      weatherStationActor.pos.x,
      300,
      onZoneChange,
      exit,
    );

    MicroEngine.LoadScene(ActorList.mainScene);
    canvasGarbageCollector = canvasCleaner();
    objectsInitializedWithProps = true;
  }

  function onNewPropsRecieved(props) {
    if (!sketchIsSetup) return;

    if (props.weather.timestamp !== initialPropsBuffer.weather.timestamp) {
      ActorList.setEnvironmentWeather(props.weather.parsedData, skyLayerActor);
    }

    const canvasComponent = easelActor.findComponent("CanvasComponent");
    canvasComponent.setCurrentColor(props.currentColor);
    canvasComponent.setCurrentTool(props.currentTool);
    canvasComponent.setPaintingData(props.playerPainting);

    if (props.isPaintingLocked) {
      canvasComponent.lockPainting();
    } else {
      canvasComponent.unlockPainting();
    }
  }

  p5.preload = () => {
    testPlant1 = p5.loadImage("/assets/flower01.png");
    testPlant2 = p5.loadImage("/assets/grass01.png");
    testPlant3 = p5.loadImage("/assets/moss01.png");
    mainCharSpriteSheet = p5.loadImage("/assets/game_assets/F_01.png");
    mainCharSpriteData = p5.loadJSON("/assets/game_assets/character.json");
    museum = p5.loadImage("/assets/museum.png");
    billboard = p5.loadImage("/assets/billboard.png");
    weatherStation = p5.loadImage("assets/weatherStation.png");
  };

  p5.setup = () => {
    p5.createCanvas(700, 400);
    p5.rectMode(p5.CENTER);
    p5.noSmooth();
    //Set unique seed per user!
    p5.randomSeed(42);
    p5.noiseSeed(42);
    //p5.background(30, 40, 220);

    initializeWithProps(initialPropsBuffer);
    sketchIsSetup = true;

    //console.log("Handle sketch ready", handleSketchReady);
    if (handleSketchReady) {
      handleSketchReady();
    }
  };

  p5.updateWithProps = (props) => {
    //console.log("updating props 1");
    if (!sketchIsSetup) initialPropsBuffer = props;
    onNewPropsRecieved(props);
  };

  //Super ugly please be time to make better (Use the nice input system I made :|)
  let lastKeyPress;

  p5.draw = () => {
    p5.background(30, 40, 220);
    //p5.translate(-p5.width / 2, -p5.height / 2);

    MicroEngine.EngineLoop();

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      mainCharacter.findComponent("Animation").setAnimationState("WalkLeft");
      mainCharacter.findComponent("GroundMove").move(-2);
      lastKeyPress = p5.LEFT_ARROW;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      mainCharacter.findComponent("Animation").setAnimationState("WalkRight");
      mainCharacter.findComponent("GroundMove").move(2);
      lastKeyPress = p5.RIGHT_ARROW;
    } else if (lastKeyPress == p5.LEFT_ARROW) {
      mainCharacter.findComponent("Animation").setAnimationState("IdleLeft");
    } else if (lastKeyPress == p5.RIGHT_ARROW) {
      mainCharacter.findComponent("Animation").setAnimationState("IdleRight");
    }

    if (p5.mouseIsPressed) {
      //Future: use input system
      easelActor.findComponent("CanvasComponent").processInput();
    }

    if (canvasGarbageCollector) canvasGarbageCollector();
  };

  p5.windowResized = () => {
    const parentElement = document.getElementById("viewport-container");
    p5.resizeCanvas(Math.min(800, parentElement.clientWidth), 400);
  };

  p5.mouseReleased = () => {
    //Future: use input system
    easelActor.findComponent("CanvasComponent").inputComplete();
  };

  p5.keyPressed = () => {
    if (p5.keyIsDown(p5.UP_ARROW))
      mainCharacter.findComponent("GroundMove").jump(4);
    //mainCharacter.forceComponent.addForce(p5.createVector(0, -3));
  };
}
