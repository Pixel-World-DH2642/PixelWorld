export function createActorList(p5, MicroEngine) {
  const mainScene = MicroEngine.CreateScene();

  function createCanvasActor(pos, size) {
    const actor = MicroEngine.Components.Actor(pos);
    actor.addComponent(CanvasComponent, null);

    function CanvasComponent(settings, actor, pos) {
      let pixelSize = 16;
      let rows = Math.floor(size.x / 16);
      let columns = Math.floor(size.y / 16);

      const pixelArray = [];

      for (let x = 0; x < rows; x++) {
        pixelArray[x] = [];
        for (let y = 0; y < columns; y++) {
          pixelArray[x][y] = 0;
        }
      }

      function processInput(/*draw info*/) {
        const mx = p5.mouseX - MicroEngine.CameraPanning.x;
        const my = p5.mouseY - MicroEngine.CameraPanning.y;

        if (mx < pos.x - size.x / 2 || mx > pos.x + size.x / 2) return;
        if (my < pos.y - size.y / 2 || my > pos.y + size.y / 2) return;

        const pixCoordX = Math.floor((mx - pos.x + size.x / 2) / pixelSize);
        const pixCoordY = Math.floor((my - pos.y + size.y / 2) / pixelSize);
        pixelArray[pixCoordX][pixCoordY] = !pixelArray[pixCoordX][pixCoordY];
      }

      function render() {
        p5.stroke(0);
        p5.strokeWeight(4);
        p5.line(pos.x, pos.y - 95, pos.x + 70, pos.y + 100);
        p5.line(pos.x, pos.y - 95, pos.x - 70, pos.y + 100);

        p5.fill(222, 230, 200);
        p5.stroke(0);
        p5.strokeWeight(0);
        p5.rect(pos.x, pos.y, size.x, size.y);
        p5.noStroke();

        for (let x = 0; x < pixelArray.length; x++) {
          for (let y = 0; y < pixelArray[x].length; y++) {
            if (pixelArray[x][y]) {
              p5.fill(200, 100, 40);
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
      };
    }

    mainScene.addActor(actor);
    return actor;
  }

  function createRectActor() {
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

  function createGroundActor(testPlants) {
    //Make sure vertex spacing gets passed through to the collider & renderer...
    //Make it available

    const hmap = MicroEngine.GenerateCurveData({
      amplitude: 130,
      baseHeight: p5.height - 20,
      noiseIncrementStep: 0.1,
      vertexIterations: 300,
    });

    function GroundRendererComponent(settings, actor, pos) {
      const hmap = settings.hmap;
      let groundCanvas = p5.createGraphics(p5.width, p5.height);

      //PLANT BIZZ

      //const plantRefs = [testPlant1, testPlant2, testPlant3];
      const plants = [];

      for (let i = 0; i < 100; i++) {
        const xpos = p5.random(2000);
        const ypos = actor
          .findComponent("Collider")
          .colliderGeometry.querryGroundHeight(xpos);
        const plantIndex = Math.floor(p5.random(3));
        plants.push({ xpos, ypos, plantIndex });
      }

      //RESTRICT PLAYER FROM MOVING TO EDGES

      //ONLY RE-RENDER WHEN PLAYER MOVES
      function drawCurve(heightMap, settings) {
        const pg = settings?.pg || p5.instance;

        //Params
        let vertexSpacing = settings?.vertexSpacing || 20;

        //Panning
        let xOffset = MicroEngine.CameraPanning.x / vertexSpacing;
        let indexOffset = -Math.floor(xOffset);
        xOffset = (xOffset + indexOffset) * vertexSpacing;
        let indexWidth = Math.floor(pg.width / vertexSpacing) + indexOffset + 2;

        pg.beginShape();
        pg.noStroke();

        if (indexOffset > 4) {
          pg.curveVertex(-80, pg.height + 100);
          pg.curveVertex(-80, pg.height + 100);
          pg.curveVertex(-50, heightMap[indexOffset - 2]);
          pg.curveVertex(-50, heightMap[indexOffset - 1]);
        }

        for (let i = indexOffset; i < indexWidth; i++) {
          pg.curveVertex(
            (i - indexOffset) * vertexSpacing + xOffset,
            heightMap[i],
          );
        }

        pg.curveVertex(pg.width + 20, pg.height + 100);
        pg.curveVertex(pg.width + 20, pg.height + 100);
        pg.endShape();
      }

      return {
        type: "GroundRenderer",

        initialize: function () {},
        update: function () {},

        render: function () {
          groundCanvas.clear();
          groundCanvas.fill(40, 220, 39);
          groundCanvas.push();
          drawCurve(hmap, { pg: groundCanvas, vertexSpacing: 20 });
          //drawGroundDetail(hmap, {pg: groundCanvas, vertexSpacing: 20 })
          groundCanvas.pop();

          p5.push();
          p5.translate(-MicroEngine.CameraPanning.x, 0);
          p5.image(groundCanvas, 0, 0);
          p5.pop();

          plants.forEach((plant) => {
            p5.image(testPlants[plant.plantIndex], plant.xpos, plant.ypos - 12);
          });
        },
      };
    }

    const colliderSettings = {
      elasticity: 1,
      geometrySettings: { vertexSpacing: 20, heightMap: hmap, smoothOn: true },
    };

    let actor = MicroEngine.Components.Actor(p5.createVector(0, 0));
    actor.addComponent(MicroEngine.Components.GroundCollider, colliderSettings);
    actor.addComponent(GroundRendererComponent, { hmap });
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
          pg.image(testPlants[plant.plantIndex], plant.xpos, plant.ypos - 12);
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
        console.log(MicroEngine.CameraPanning);
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

  function createSkyLayer() {
    const actor = MicroEngine.Components.Actor(createVector());

    const skyCanvas = p5.createGraphics(p5.width, p5.height);
    const scribble = MicroEngine.CreateScribbleInstance(skyCanvas); //new Scribble(skyCanvas);
    scribble.bowing = 5;

    function renderSky() {
      for (let i = 0; i < 8; i++) {
        skyCanvas.strokeWeight(20 + p5.random(-7, 30));
        skyCanvas.stroke(
          30 + p5.random(-20, 20),
          40 + p5.random(-10, 10),
          220 + p5.random(-30, 10),
        );
        scribble.scribbleLine(0, i * 20, p5.width, i * 20);
      }
    }

    function displaySky() {
      p5.image(skyCanvas, actor.pos.x, actor.pos.y);
    }
  }

  //--------------------------------ACTORS-------------------------------------
  return {
    mainScene,
    createCanvasActor,
    createRectActor,
    createGroundActor,

    createGroundSliceActor,
  };
}
