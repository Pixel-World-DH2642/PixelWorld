import { createMicroEngine } from "../utils/engine/microEngine";
import { createActorList } from "../utils/engine/actors";

export function sketch(p5) {
  const MicroEngine = createMicroEngine(p5);
  const ActorList = createActorList(p5, MicroEngine);

  const mainScene = MicroEngine.CreateScene();
  MicroEngine.LoadScene(mainScene);

  //############################--DEFINE ACTORS--############################//
  let recto, easel, testPlant1, testPlant2, testPlant3, skyCanvas, scribble;

  //############################-----------------############################//

  p5.preload = () => {
    testPlant1 = p5.loadImage("/assets/flower01.png");
    testPlant2 = p5.loadImage("/assets/grass01.png");
    testPlant3 = p5.loadImage("/assets/moss01.png");
  };

  p5.setup = () => {
    p5.createCanvas(600, 300, p5.WEBGL);
    p5.rectMode(p5.CENTER);
    p5.background(30, 40, 220);

    //ActorList.createGroundActor([testPlant1, testPlant2, testPlant3]);
    ActorList.createGroundSliceActor([testPlant1, testPlant2, testPlant3]);
    easel = ActorList.createCanvasActor(p5.createVector(900, 150), {
      x: 128,
      y: 128,
    });
    recto = ActorList.createRectActor();

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
    console.log(props);
  };

  p5.draw = () => {
    p5.background(30, 40, 220);
    p5.translate(-p5.width / 2, -p5.height / 2);

    //p5.image(skyCanvas, 0, 0);
    MicroEngine.EngineLoop();

    if (p5.keyIsDown(p5.LEFT_ARROW)) recto.findComponent("GroundMove").move(-1);
    if (p5.keyIsDown(p5.RIGHT_ARROW)) recto.findComponent("GroundMove").move(1);
  };

  p5.mousePressed = () => {
    easel.findComponent("CanvasComponent").processInput();
  };

  p5.keyPressed = () => {
    //console.log("kdjb")
    if (p5.keyIsDown(p5.UP_ARROW))
      recto.forceComponent.addForce(p5.createVector(0, -3));
  };
}
