import { createMicroEngine } from "../utils/engine/microEngine";
import { createActorList } from "../utils/engine/actors";

export function sketch(p5) {
  const MicroEngine = createMicroEngine(p5);
  const ActorList = createActorList(p5, MicroEngine);

  const mainScene = MicroEngine.CreateScene();
  MicroEngine.LoadScene(mainScene);

  //############################--DEFINE ACTORS--############################//
  let mainCharacter, easel, skyCanvas, scribble;

  //Preload items
  let testPlant1, testPlant2, testPlant3;
  let mainCharSpriteSheet, mainCharSpriteData;

  let skyLayerActor;
  //############################-----------------############################//

  p5.preload = () => {
    testPlant1 = p5.loadImage("/assets/flower01.png");
    testPlant2 = p5.loadImage("/assets/grass01.png");
    testPlant3 = p5.loadImage("/assets/moss01.png");
    mainCharSpriteSheet = p5.loadImage("/assets/game_assets/F_01.png");
    mainCharSpriteData = p5.loadJSON("/assets/game_assets/character.json");
  };

  p5.setup = () => {
    p5.createCanvas(600, 300);
    p5.rectMode(p5.CENTER);
    p5.noSmooth();
    //p5.background(30, 40, 220);

    skyLayerActor = ActorList.createSkyLayerActor();
    ActorList.createGroundSliceActor([testPlant1, testPlant2, testPlant3]);
    easel = ActorList.createCanvasActor(p5.createVector(900, 150), {
      x: 128,
      y: 128,
    });
    mainCharacter = ActorList.createMainCharacterActor(
      mainCharSpriteSheet,
      mainCharSpriteData,
    );

    MicroEngine.LoadScene(ActorList.mainScene);

    //move to an actor object
    /*
    skyCanvas = p5.createGraphics(p5.width, p5.height);
    scribble = MicroEngine.CreateScribbleInstance(skyCanvas); //new Scribble(skyCanvas);

    scribble.bowing = 5;
    for (let i = 0; i < 8; i++) {
      skyCanvas.strokeWeight(20 + p5.random(-7, 30));
      skyCanvas.stroke(
        30 + p5.random(-20, 20),
        40 + p5.random(-10, 10),
        220 + p5.random(-30, 10),
      );
      scribble.scribbleLine(0, i * 20, p5.width, i * 20);
    }
    */
  };

  p5.updateWithProps = (props) => {
    //console.log(props.weatherData.parsedData);
    ActorList.setEnvironmentWeather(
      props.weatherData.parsedData,
      skyLayerActor,
    );
  };

  //Super ugly please be time to make better
  let lastKeyPress;

  p5.draw = () => {
    p5.background(30, 40, 220);
    //p5.translate(-p5.width / 2, -p5.height / 2);

    //p5.image(skyCanvas, 0, 0);
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
  };

  p5.mousePressed = () => {
    easel.findComponent("CanvasComponent").processInput();
  };

  p5.keyPressed = () => {
    //console.log("kdjb")
    if (p5.keyIsDown(p5.UP_ARROW))
      mainCharacter.forceComponent.addForce(p5.createVector(0, -3));
  };
}
