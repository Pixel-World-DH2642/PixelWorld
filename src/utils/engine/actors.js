import { createMicroEngine } from "./microEngine";
import { TOOL_MODE } from "../../app/slices/pixelEditorSlice";

export function createActorList(p5, MicroEngine) {
  const mainScene = MicroEngine.CreateScene();

  function createCanvasActor(pos, size) {
    const actor = MicroEngine.Components.Actor(pos);
    actor.addComponent(CanvasComponent, null);

    function CanvasComponent(settings, actor, pos) {
      let pixelSize = 12;
      let rows = Math.floor(size.x / pixelSize);
      let columns = Math.floor(size.y / pixelSize);
      let currentColor = { r: 0, g: 0, b: 0, a: 255 };
      let currentTool = TOOL_MODE.PENCIL;

      const pixelArray = [];

      for (let x = 0; x < rows; x++) {
        pixelArray[x] = [];
        for (let y = 0; y < columns; y++) {
          pixelArray[x][y] = { r: 0, g: 0, b: 0, a: 0 };
        }
      }

      function processInput(/*draw info*/) {
        const mx = p5.mouseX - MicroEngine.CameraPanning.x;
        const my = p5.mouseY - MicroEngine.CameraPanning.y;

        if (mx < pos.x - size.x / 2 || mx > pos.x + size.x / 2) return;
        if (my < pos.y - size.y / 2 || my > pos.y + size.y / 2) return;

        const pixCoordX = Math.floor((mx - pos.x + size.x / 2) / pixelSize);
        const pixCoordY = Math.floor((my - pos.y + size.y / 2) / pixelSize);
        if (currentTool === TOOL_MODE.ERASER)
          pixelArray[pixCoordX][pixCoordY] = { r: 0, g: 0, b: 0, a: 0 };
        else pixelArray[pixCoordX][pixCoordY] = currentColor;
      }

      //Make a pg so we only have to re-render when user paints
      function render() {
        p5.stroke(120, 100, 20);
        p5.strokeWeight(8);

        //Right Leg
        p5.line(
          pos.x,
          pos.y - size.y * 0.7,
          pos.x + size.x * 0.5,
          pos.y + size.y * 0.8,
        );
        //Left Leg
        p5.line(
          pos.x,
          pos.y - size.y * 0.7,
          pos.x - size.x * 0.5,
          pos.y + size.y * 0.8,
        );
        //Top Bracket
        p5.line(
          pos.x - size.x * 0.2,
          pos.y - size.y * 0.6,
          pos.x + size.x * 0.2,
          pos.y - size.y * 0.6,
        );
        //Bottom Bracket
        p5.line(
          pos.x - size.x * 0.6,
          pos.y + size.y * 0.5,
          pos.x + size.x * 0.6,
          pos.y + size.y * 0.5,
        );

        p5.fill(222, 230, 200);
        //p5.stroke(0);
        p5.strokeWeight(4);
        p5.stroke(150, 120, 20);
        p5.rect(pos.x, pos.y, size.x, size.y);
        p5.noStroke();

        for (let x = 0; x < pixelArray.length; x++) {
          for (let y = 0; y < pixelArray[x].length; y++) {
            if (pixelArray[x][y]) {
              p5.fill(
                pixelArray[x][y].r,
                pixelArray[x][y].g,
                pixelArray[x][y].b,
                pixelArray[x][y].a,
              );
              p5.rect(
                x * pixelSize + pixelSize / 2 + pos.x - size.x / 2,
                y * pixelSize + pixelSize / 2 + pos.y - size.y / 2,
                pixelSize,
                pixelSize,
              );
            }
          }
        }
      }

      return {
        type: "CanvasComponent",
        render,
        processInput,
        setCurrentColor: function (color) {
          currentColor = color;
        },
        setCurrentTool: function (tool) {
          currentTool = tool;
          console.log(tool);
        },
      };
    }

    mainScene.addActor(actor);
    return actor;
  }

  function createMainCharacterActor(spriteSheet, spriteData) {
    const actor = MicroEngine.Components.Actor(p5.createVector(450, 50));
    actor.addComponent(MicroEngine.Components.RectCollider, {
      geometrySettings: { size: { x: 20, y: 50 } },
    });
    //actor.colliderComponent.addEvent('begin', () => console.log("begin"));
    //actor.colliderComponent.addEvent('remain', () => console.log("remain"));
    //actor.colliderComponent.addEvent('exit', () => console.log("exit"));

    actor.colliderComponent.addEvent("begin", (data) => {
      //data.ownCollider.parent.findComponent("Force").vel = p5.createVector(0, 0);
      //data.ownCollider.parent.findComponent("Force").acc = p5.createVector(0, 0);
    });

    function playerGroundOverride(
      otherCollider,
      otherForce,
      ownCollider,
      ownForce,
    ) {
      if (otherCollider.colliderGeometry.geometryType === "Ground") {
        //ownCollider.parent.forceComponent.vel = {y:0}
        if (ownCollider.parent.forceComponent.vel.y > 0) {
          ownCollider.parent.forceComponent.vel = { x: 0, y: 0 };
          ownCollider.parent.forceComponent.acc = { x: 0, y: 0 };
        }
        return true;
      }
    }
    actor.addComponent(MicroEngine.Components.Force, {
      distributeForceOverrides: [playerGroundOverride],
    });
    actor.addComponent(GroundMoveComponent);

    /*
    actor.addComponent(MicroEngine.Components.Renderer, {
      render: function () {
        p5.stroke(0);
        p5.fill(45);
        p5.rect(
          actor.pos.x,
          actor.pos.y,
          actor.colliderComponent.colliderGeometry.size.x,
          actor.colliderComponent.colliderGeometry.size.y,
        );
      },
    });
    */

    actor.addComponent(MicroEngine.Components.Animator, { scale: 4 });
    const animatorRef = actor.findComponent("Animation");
    const rightFrames = animatorRef.extractFramesFromSpriteSheet(
      spriteSheet,
      spriteData,
      3,
      6,
    );
    const leftFrames = animatorRef.extractFramesFromSpriteSheet(
      spriteSheet,
      spriteData,
      9,
      12,
    );
    animatorRef.addAnimationState(rightFrames, "WalkRight");
    animatorRef.addAnimationState(leftFrames, "WalkLeft");
    animatorRef.addAnimationState([rightFrames[0]], "IdleRight");
    animatorRef.addAnimationState([leftFrames[0]], "IdleLeft");
    animatorRef.setAnimationState("WalkRight");
    //Add Idle...

    function GroundMoveComponent(settings, actor, pos) {
      let groundMode = false;

      actor.colliderComponent.addEvent("begin", () => {
        groundMode = true;
      });

      function ghettoMover(dir) {
        const oldPos = actor.pos;
        oldPos.x += dir;
        actor.pos = oldPos;

        let camX = MicroEngine.CameraPanning.x;
        camX -= dir;
        MicroEngine.CameraPanning = { x: camX };
      }

      return {
        type: "GroundMove",
        move: ghettoMover,
      };
    }

    MicroEngine.CameraPanning = { x: -330 };

    mainScene.addActor(actor);
    return actor;
  }

  ///%%%%%%%%%%%%%%%%%%%%%%%% WIP %%%%%%%%%%%%%%%%%%%%%%%%///
  function createGroundSliceActor(testPlants) {
    //Make sure vertex spacing gets passed through to the collider & renderer...
    //Make it available

    const hmap = MicroEngine.Utils.GenerateCurveData({
      amplitude: 130,
      baseHeight: p5.height,
      noiseIncrementStep: 0.1,
      vertexIterations: 300,
    });

    let vertexSpacing = 20;

    //Add vertex spacing to hmap object for renderer & collider...

    function GroundRendererComponent(settings, actor, pos) {
      const plants = spawnPlants();
      const backgroundSlices = generateSlices();

      function spawnPlants() {
        let plantArr = [];

        for (let i = 0; i < 500; i++) {
          const xpos = p5.random(10000);
          const ypos = actor
            .findComponent("Collider")
            .colliderGeometry.querryGroundHeight(xpos);
          const plantIndex = Math.floor(p5.random(3));
          plantArr.push({ xpos, ypos, plantIndex });
        }

        return plantArr;
      }

      function generateSlices() {
        //Generate background, chop into slices, garbage collect big image
        //Temp canvas
        let groundCanvasFull = p5.createGraphics(
          hmap.length * vertexSpacing,
          p5.height,
        );
        groundCanvasFull.noSmooth();
        renderCurve(hmap, groundCanvasFull);
        const backgroundSlices = MicroEngine.Utils.SliceImage(
          groundCanvasFull,
          300,
          p5.height,
        );
        groundCanvasFull.remove();
        groundCanvasFull = undefined;

        return backgroundSlices;
      }

      function renderCurve(heightMap, pg) {
        pg.beginShape();
        pg.noStroke();
        pg.fill(40, 220, 39);

        const offset = pos.x - 2 * vertexSpacing;

        for (let i = 0; i < heightMap.length; i++) {
          pg.curveVertex(offset + i * vertexSpacing, heightMap[i]);
        }

        pg.endShape();

        //Render plants
        plants.forEach((plant) => {
          pg.push();
          pg.translate(
            plant.xpos,
            plant.ypos -
              testPlants[plant.plantIndex].height -
              Math.random() * 12,
          );
          pg.scale(2, 2);
          pg.image(testPlants[plant.plantIndex], 0, 0);
          pg.pop();
        });
      }

      return {
        type: "GroundRenderer",

        initialize: function () {},
        update: function () {},

        render: function () {
          backgroundSlices.forEach((slice) => {
            if (
              MicroEngine.CameraPanning.x + slice.coords.x <
              -slice.imgSlice.width
            )
              return;
            if (MicroEngine.CameraPanning.x + slice.coords.x > p5.width) return;

            p5.image(slice.imgSlice, slice.coords.x, slice.coords.y);
          });
        },
      };
    }

    const colliderSettings = {
      elasticity: 1,
      geometrySettings: {
        vertexSpacing: 20,
        heightMap: hmap.slice(2, hmap.length - 1),
        smoothOn: true,
      },
    };

    let actor = MicroEngine.Components.Actor(p5.createVector(0, 0));
    actor.addComponent(MicroEngine.Components.GroundCollider, colliderSettings);
    actor.addComponent(GroundRendererComponent, {});
    mainScene.addActor(actor);
    return actor;
  }

  function TileGroundRendererComponent(settings, actor, pos) {
    //Layers
    //Add parallax as component
    //Paralax manager
    //Background system, slice up large images into smaller tiles
    //Tile background component
    //1 - Generate tile map image
    //2 - Slice tile map into tile slices
    //3 - Render tile map by managing which slices rendered based on player position

    let tileStackWidth = settings.tileStackWidth;
    let tileStackHeight = settings.tileStackHeight;
    //To deterimine tile placement
    let tileRules = []; //{tile: tileImage, rule: function}

    let tileSize = settings?.tileSize || 10;
    const hmap = settings.hmap;
    let vertexSpacing = settings?.vertexSpacing || 20;

    function drawTiles() {
      //Params

      //Panning
      let xOffset = MicroEngine.CameraPanning.x / vertexSpacing;
      let indexOffset = -Math.floor(xOffset);
      xOffset = (xOffset + indexOffset) * vertexSpacing;
      let indexWidth = Math.floor(pg.width / vertexSpacing) + indexOffset + 2;

      for (let i = indexOffset; i < indexWidth; i++) {
        pg.curveVertex(
          (i - indexOffset) * vertexSpacing + xOffset,
          heightMap[i],
        );
      }
    }

    return {
      type: "TileRenderer",
      initialize: function () {},
      update: function () {},
      render: drawTiles(),
    };
  }

  function createGroundObject(settings) {
    //---------------------------------------------Object vars
    const hmap = MicroEngine.GenerateCurveData({
      amplitude: 130,
      baseHeight: p5.height - 20,
      noiseIncrementStep: 0.1,
      vertexIterations: 160,
    });

    //let tileStackWidth = settings.tileStackWidth;
    //let tileStackHeight = settings.tileStackHeight;
    //To deterimine tile placement
    //let tileRules = []; //{tile: tileImage, rule: function}

    let tileSize = settings?.tileSize || 8;
    let vertexSpacing = tileSize;

    //---------------------------------------------Initialization functions
    function quantizeHeightMap(heightMap) {
      heightMap.forEach((val) => (val = val - (val % tileSize)));
    }
    //---------------------------------------------Object initialization
    quantizeHeightMap(hmap);

    //---------------------------------------------Add/ define components
    function TileGroundRendererComponent(settings, actor, pos) {
      function drawTiles() {
        //Params

        //Panning
        /*
        let xOffset = MicroEngine.CameraPanning.x / vertexSpacing;
        let indexOffset = -Math.floor(xOffset);
        xOffset = (xOffset + indexOffset) * vertexSpacing;
        let indexWidth = Math.floor(vertexSpacing) + indexOffset + 2;
        */
        MicroEngine.CameraPanning = { x: 0, y: 0 };
        //console.log(MicroEngine.CameraPanning);
        for (let i = 0; i < hmap.length; i += vertexSpacing) {
          p5.stroke(0);
          p5.strokeWeight(1);
          /*
          p5.rect(
            (i - indexOffset) * vertexSpacing + xOffset,
            hmap[i],
            tileSize,
            tileSize,
          );
          */

          p5.rect(i * vertexSpacing, hmap[i], tileSize, tileSize);
        }
      }

      return {
        type: "TileRenderer",
        initialize: function () {},
        update: function () {},
        render: drawTiles(),
      };
    }

    let actor = MicroEngine.Components.Actor(p5.createVector(0, 0));
    //actor.addComponent(MicroEngine.Components.GroundCollider, colliderSettings);
    actor.addComponent(TileGroundRendererComponent, {});

    //---------------------------------------------Return
    mainScene.addActor(actor);
    return actor;
  }
  ////////////////////////////////////////////////////////////

  /* Render Example */
  /*  
  
  //The image to slice
  const bigImg = createGraphics(300, 300);
  bigImg.circle(width/2, height/2, 300);
  
  //Slice it up
  const sliced = createImageSlices(bigImg, 100, 100);

  //Render it
  sliced.forEach((slice) => {
    console.log(slice.coords)
    image(slice.imgSlice, slice.coords.x, slice.coords.y);
  });
   */

  function createSkyLayerActor() {
    const actor = MicroEngine.Components.Actor(p5.createVector());
    actor.addComponent(SkyRendererComponent);

    function SkyRendererComponent(settings, actor, pos) {
      const skyCanvas = p5.createGraphics(p5.width, p5.height);
      const scribble = MicroEngine.CreateScribbleInstance(skyCanvas); //new Scribble(skyCanvas);
      scribble.bowing = 5;
      let baseColor = { r: 30, g: 40, b: 220 };
      let colorRandomization = {
        r: { min: -20, max: 20 },
        g: { min: -10, max: 10 },
        b: { min: -30, max: 10 },
      };

      generateSky();

      function generateSky() {
        skyCanvas.background(baseColor.r, baseColor.g, baseColor.b);
        for (let i = 0; i < 8; i++) {
          skyCanvas.strokeWeight(20 + p5.random(-7, 30));
          skyCanvas.stroke(
            baseColor.r +
              p5.random(colorRandomization.r.min, colorRandomization.r.max),
            baseColor.g +
              p5.random(colorRandomization.g.min, colorRandomization.g.max),
            baseColor.b +
              p5.random(colorRandomization.b.min, colorRandomization.b.max),
          );
          scribble.scribbleLine(0, i * 20, p5.width, i * 20);
        }
      }

      function displaySky() {
        p5.image(
          skyCanvas,
          -MicroEngine.CameraPanning.x,
          MicroEngine.CameraPanning.y,
        );
      }

      return {
        type: "SkyRenderer",
        render: displaySky,
        generateSky,
        setColors: function (colorSettings) {
          baseColor = colorSettings.baseColor ?? baseColor;
          colorRandomization =
            colorSettings.colorRandomization ?? colorRandomization;
          generateSky();
        },
      };
    }

    mainScene.addActor(actor);
    return actor;
  }

  function setEnvironmentWeather(weatherData, skyActor) {
    if (!weatherData || !skyActor) return;

    const skyRenderer = skyActor.findComponent("SkyRenderer");
    const cloudLevel6_BaseColor = { r: 190, g: 190, b: 190 };
    //console.log(weatherData.cloudAmt);
    switch (weatherData.cloudAmt) {
      case 0:
        skyRenderer.setColors({ baseColor: cloudLevel6_BaseColor });
        break;
      case 1:
        skyRenderer.setColors({ baseColor: cloudLevel6_BaseColor });
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        skyRenderer.setColors({ baseColor: cloudLevel6_BaseColor });
        break;
      case 6:
        skyRenderer.setColors({ baseColor: cloudLevel6_BaseColor });
        break;
    }
  }

  //--------------------------------ACTORS-------------------------------------
  return {
    //Scene
    mainScene,
    //Actors
    createCanvasActor,
    createMainCharacterActor,
    createGroundSliceActor,
    createSkyLayerActor,
    //Helpers
    setEnvironmentWeather,
  };
}
