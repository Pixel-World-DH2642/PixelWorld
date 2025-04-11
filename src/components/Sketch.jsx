import { createMicroEngine } from "../utils/engine/microEngine";
import { createActorList } from "../utils/engine/actors";

export function sketch(p5) {
  const MicroEngine = createMicroEngine(p5);
  const ActorList = createActorList(p5, MicroEngine);

  const mainScene = MicroEngine.CreateScene();
  MicroEngine.LoadScene(mainScene);

  //############################--DEFINE ACTORS--############################//
  let recto, easel;
  //############################-----------------############################//

  p5.preload = () => {
    //testPlant1 = p5.loadImage("../assets/flower01.png");
    //testPlant2 = p5.loadImage("../assets/grass01.png");
    //testPlant3 = p5.loadImage("../assets/moss01.png");
  };

  p5.setup = () => {
    p5.createCanvas(600, 300, p5.WEBGL);
    p5.rectMode(p5.CENTER);
    p5.background(30, 40, 220);

    ActorList.createGroundActor();
    easel = ActorList.createCanvasActor(p5.createVector(900, 150), {
      x: 128,
      y: 128,
    });
    recto = ActorList.createRectActor();

    MicroEngine.LoadScene(ActorList.mainScene);
  };

  p5.updateWithProps = (props) => {
    console.log(props);
  };

  p5.draw = () => {
    p5.background(30, 40, 220);
    p5.translate(-p5.width / 2, -p5.height / 2);
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
