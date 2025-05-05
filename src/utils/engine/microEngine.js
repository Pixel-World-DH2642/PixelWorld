//const MicroEngine = createMicroEngine();
//const MComponents = MicroEngine.Components;
import { createInputHandler } from "./inputSystem";
import { Scribble } from "./scribble";

export function createMicroEngine(p5) {
  //#############################Global Vars#############################//

  //----------------------------Scenes & Actors-------------------------//
  const scenes = [];

  //-------------------------------Rendering----------------------------//
  const panning = { x: 0, y: 0 };
  const scribbleInstances = [];
  const renderLayers = new Map();
  //Add a render layer object with layers & instantiate map on engine init
  //During update cycle add game objects to render layer buckets
  //Call buckets during render loop

  //---------------------------------Input------------------------------//
  const inputHandler = createInputHandler();

  //--------------------------------Physics-----------------------------//
  let gravityStrength = 0.15;

  //Physics Game Loop
  const actorsWithForceComponents = [];
  const actorsWithColliders = [];
  let collisionBuffer = [];

  const collisionResolverMap = new Map();

  collisionResolverMap.set("GroundRect", (colA, colB) =>
    groundResolver(colA, colB),
  );

  collisionResolverMap.set("RectGround", (colA, colB) =>
    groundResolver(colB, colA),
  );

  //#############################SCENE ACTOR#############################//
  //------------------------Scene Actor Components----------------------//

  function createScene() {
    const actors = [];

    function addActor(actor) {
      actors.push(actor);
    }

    return {
      get actors() {
        return actors;
      },
      get addActor() {
        return addActor;
      },
    };
  }

  function createActorComponent(pos, settings) {
    const tags = [];
    let name = settings?.name || "default actor";
    const components = [];
    let colliderComponent = null;
    let forceComponent = null;

    function initialize() {
      components.forEach((component) => {
        if (component.initialize) component.initialize();
      });
    }

    function update() {
      if (forceComponent)
        forceComponent.addForce(p5.createVector(0, gravityStrength));
      components.forEach((component) => {
        if (component.update) component.update();
      });
    }

    function render() {
      components.forEach((component) => {
        if (component.render) component.render();
      });
    }

    return {
      get type() {
        return "Actor";
      },
      get pos() {
        return pos.copy();
      },
      set pos(val) {
        pos.x = val.x;
        pos.y = val.y;
      },
      get name() {
        return name;
      },
      get addComponent() {
        return function (component, settings) {
          components.push(component(settings, this, pos));
          if (components.at(-1).type === "Collider")
            colliderComponent = components.at(-1);
          if (components.at(-1).type === "Force")
            forceComponent = components.at(-1);
        };
      },
      get findComponent() {
        return function (type, all) {
          for (let i = 0; i < components.length; i++) {
            if (components[i].type === type) return components[i];
          }
        };
      },
      get colliderComponent() {
        return colliderComponent;
      },
      get forceComponent() {
        return forceComponent;
      },
      get initialize() {
        return initialize;
      },
      get update() {
        return update;
      },
      get render() {
        return render;
      },
    };
  }

  //#############################PHYSICS#############################//

  //------------------------Physics Components----------------------//

  function createForceComponent(settings, actor, pos) {
    let vel = p5.createVector();
    let acc = p5.createVector();
    let airFriction = settings?.airFriction || 0.01; //!!!
    let useGravity = true;
    const deltaMult = 0.03;
    const minVel = 0.03;
    const distributeForceOverrides = settings?.distributeForceOverrides || [];

    function checkForceOverrides(
      otherCollider,
      otherForce,
      ownCollider,
      ownForce,
    ) {
      for (let i = 0; i < distributeForceOverrides.length; i++) {
        if (
          distributeForceOverrides[i](
            otherCollider,
            otherForce,
            ownCollider,
            ownForce,
          )
        )
          return true;
      }
    }

    function addForce(force, useDelta) {
      if (useDelta) force.mult(p5.deltaTime * deltaMult);
      acc.add(force);
    }

    function forceUpdate() {
      vel.add(acc);
      acc.mult(0);
      pos.x += vel.x;
      pos.y += vel.y;
      vel.mult(1 - airFriction);
      if (vel.magSq() < minVel * minVel) vel.set(0, 0);
    }

    return {
      get type() {
        return "Force";
      },
      get airFriction() {
        return airFriction;
      },
      get useGravity() {
        return useGravity;
      },
      set useGravity(val) {
        useGravity = val;
      },
      get addForce() {
        return addForce;
      },
      get forceUpdate() {
        return forceUpdate;
      },
      get vel() {
        return vel.copy();
      },
      set vel(val) {
        vel.x = val.x ?? vel.x;
        vel.y = val.y ?? vel.y;
      },
      set acc(val) {
        acc.x = val.x ?? acc.x;
        acc.y = val.y ?? acc.y;
      },
      get checkForceOverrides() {
        return checkForceOverrides;
      },
      get addForceOverride() {
        return function (override) {
          distributeForceOverrides.push(override);
        };
      },
    };
  }

  function createColliderComponent(geometry, settings, actor, pos) {
    let elasticity = settings?.elasticity ?? 1;
    const colliderGeometry = geometry(settings.geometrySettings, actor, pos);

    //Collision Event Buffers
    const eventsToFireBuffer = [];
    let contactBuffer = [];
    let newColliders = [];
    const exitBuffer = [];
    //Events
    const beginEvents = [];
    const remainEvents = [];
    const exitEvents = [];

    function addEvent(type, event) {
      if (type === "begin") beginEvents.push(event);
      if (type === "remain") remainEvents.push(event);
      if (type === "exit") exitEvents.push(event);
    }

    function processCollisionEvents(ownData, otherData) {
      newColliders.push(otherData.ownCollider);

      if (contactBuffer.includes(otherData.ownCollider)) {
        eventsToFireBuffer.push([remainEvents, ownData]);
      } else {
        eventsToFireBuffer.push([beginEvents, ownData]);
      }
    }

    function fireEvents() {
      for (let i = 0; i < contactBuffer.length; i++) {
        if (!newColliders.includes(contactBuffer[i]))
          eventsToFireBuffer.push([exitEvents, contactBuffer[i]]);
      }

      contactBuffer = [...newColliders];
      newColliders.length = 0;

      eventsToFireBuffer.forEach((evArr) => {
        evArr[0].forEach((ev) => {
          ev(evArr[1]);
        });
      });
      eventsToFireBuffer.length = 0;
    }

    return {
      get type() {
        return "Collider";
      },
      get pos() {
        return pos.copy();
      },
      get colliderGeometry() {
        return colliderGeometry;
      },
      get parent() {
        return actor;
      },
      get elasticity() {
        return elasticity;
      },
      get addEvent() {
        return addEvent;
      },
      //Is there a way to make these private?
      get processCollisionEvents() {
        return processCollisionEvents;
      },
      get fireEvents() {
        return fireEvents;
      },
    };
  }

  //-------------------------Collider Types------------------------//
  function createGroundGeometry(settings, actor, pos) {
    let vertexSpacing = settings?.vertexSpacing || 10;
    let smoothOn = settings?.smoothOn;
    let heightMap = settings.heightMap;
    if (!heightMap || !Array.isArray(heightMap))
      throw new Error("Ground Geometry requires heightMap array");
    let useCurveTangentNormal = settings.useCurveTangentNormal;

    function checkCollision(ownCollider, otherCollider) {
      const index = Math.floor(otherCollider.pos.x / vertexSpacing);
      let collisionY = null;
      let bottomCenter = otherCollider.colliderGeometry.bottomCenter;

      if (smoothOn && bottomCenter.y > heightMap[index]) {
        const percentBetween =
          (otherCollider.pos.x - index * vertexSpacing) / vertexSpacing;
        collisionY =
          heightMap[index + 1] * percentBetween +
          heightMap[index] * (1 - percentBetween);
      } else if (bottomCenter.y > heightMap[index])
        collisionY = heightMap[index];

      if (collisionY !== null) {
        const collisionPoint = p5.createVector(bottomCenter.x, collisionY);
        const collisionNormal = useCurveTangentNormal
          ? getCurveTangent()
          : p5.createVector(0, -1);
        return createCollisionData(
          collisionPoint,
          collisionNormal,
          ownCollider,
          otherCollider,
        );
      }
    }

    function querryGroundHeight(xPos) {
      const index = Math.floor(xPos / vertexSpacing);
      if (smoothOn) {
        const percentBetween = (xPos - index * vertexSpacing) / vertexSpacing;
        return (
          heightMap[index + 1] * percentBetween +
          heightMap[index] * (1 - percentBetween)
        );
      } else return heightMap[index];
    }

    function getCurveTangent() {
      //TO DO...
      let tangentNormal = p5.createVector();
      return tangentNormal;
    }

    return {
      get geometryType() {
        return "Ground";
      },
      get checkCollision() {
        return checkCollision;
      },
      get querryGroundHeight() {
        return querryGroundHeight;
      },
    };
  }

  function createRectGeometry(settings, actor, pos) {
    const size = settings.size;
    if (
      !settings.size ||
      settings.size.x === undefined ||
      settings.size.y === undefined
    ) {
      throw new Error(
        "Rect Geometry requires a size object with 'x' and 'y' property",
      );
    }

    function checkCollision(ownCollider, otherCollider) {
      //console.log("rect check")
    }

    return {
      get geometryType() {
        return "Rect";
      },
      get checkCollision() {
        return checkCollision;
      },
      get bottomCenter() {
        return { x: pos.x, y: pos.y + size.y / 2 };
      },
      get size() {
        return size;
      },
    };
  }

  //-------------------------Physics Helpers------------------------//
  //The other geometry type doesn't matter for ground collisions
  function groundResolver(groundData, otherData) {
    otherData.ownCollider.parent.pos = {
      x: otherData.pt.x,
      y: groundData.pt.y - otherData.ownCollider.colliderGeometry.size.y / 2,
    };
  }

  function createCollisionData(pt, normal, ownCollider, otherCollider) {
    let colNormal = normal;

    return [
      {
        get pt() {
          return pt.copy();
        },
        get normal() {
          return colNormal.copy();
        },
        get ownCollider() {
          return ownCollider;
        },
        get otherCollider() {
          return otherCollider;
        },
      },
      {
        get pt() {
          return pt.copy();
        },
        get normal() {
          return colNormal.copy().mult(-1);
        },
        get ownCollider() {
          return otherCollider;
        },
        get otherCollider() {
          return otherCollider;
        },
      },
    ];
  }

  //#############################RENDERING#############################//
  //------------------------Rendering Components----------------------//
  function createRendererComponent(settings, actor, pos) {
    return {
      get type() {
        return "Renderer";
      },
      get render() {
        return settings.render;
      },
    };
  }

  function createAnimatorComponent() {
    return {
      get type() {
        return "Animation";
      },
    };
  }

  //Animator

  //The only global thing we need is the currentTick value, the rest should be contained
  //within individual animator components
  //const renderLayerA = []
  //const renderLayerB = []
  //const renderLayerC = []
  //const renderLayerD = []

  function createClockDriver() {
    let clockRate = 0.2;
    let prevTick = 0;
    let currentTick = 0;
    let deltaTick = 0;
    let animationTick = 0;

    function update() {
      currentTick = performance.now();
      deltaTick += currentTick - prevTick;

      prevTick = currentTick;
    }

    return {
      update,
      clockRate,
    };
  }

  //const clockDriver = createClockDriver();

  //clockDriver.update();

  //----------------------Render Component Helpers--------------------//

  //-----------------------Public Rendering Utils---------------------//
  function createCurveData(settings) {
    const heightMap = [];
    //Vary amplitude & noiseIncrementStep
    let amplitude = settings.amplitude;
    let baseHeight = settings.baseHeight || height;
    let noiseIncrementStep = settings.noiseIncrementStep || 0.1;
    let noiseIndex = 0;
    let vertexIterations = settings.vertexIterations || 100;

    //For curve control pts start
    heightMap[0] = baseHeight;
    heightMap[1] = baseHeight;

    for (let i = 2; i < vertexIterations + 2; i++) {
      heightMap[i] = baseHeight - p5.noise(noiseIndex) * amplitude;
      noiseIndex += noiseIncrementStep;
    }

    //For curve control pts end
    heightMap.push(baseHeight), heightMap.push(baseHeight);

    return heightMap;
  }

  function createImageSlices(img, sliceWidth, sliceHeight) {
    const imageSlices = [];

    for (let x = 0; x < img.width; x += sliceWidth) {
      for (let y = 0; y < img.height; y += sliceHeight) {
        imageSlices.push(
          createSliceData(x, y, p5.createGraphics(sliceWidth, sliceHeight)),
        );
        imageSlices.at(-1).imgSlice.image(img, -x, -y);
      }
    }

    function createSliceData(x, y, pg) {
      return {
        coords: { x, y },
        imgSlice: pg,
      };
    }

    return imageSlices;
  }

  function createScribbleInstance(pg) {
    return new Scribble(pg);
  }

  //deleteScribbleInstance...

  //############################GLOBAL#############################//
  //-----------------------Game Loop Functions--------------------//

  function render() {
    //z-mapping
    p5.push();
    p5.translate(panning.x, panning.y);
    scenes.forEach((scene) => {
      scene.actors.forEach((actor) => {
        actor.render();
      });
    });
    p5.pop();
  }

  function update() {
    scenes.forEach((scene) => {
      scene.actors.forEach((actor) => {
        actor.update();
        if (actor.colliderComponent) actorsWithColliders.push(actor);
        if (actor.forceComponent) actorsWithForceComponents.push(actor);
      });
    });
  }

  function forceUpdate() {
    actorsWithForceComponents.forEach((actor) => {
      actor.forceComponent.forceUpdate();
    });
    actorsWithForceComponents.length = 0;
  }

  function checkCollisions(colliderObjects) {
    if (colliderObjects.length < 2) return;
    for (let i = 0; i < colliderObjects.length; i++) {
      for (let j = i + 1; j < colliderObjects.length; j++) {
        const colData = colliderObjects[
          i
        ].colliderComponent.colliderGeometry.checkCollision(
          colliderObjects[i].colliderComponent,
          colliderObjects[j].colliderComponent,
        );
        if (colData) {
          collisionBuffer.push(colData);
          colData[0].ownCollider.processCollisionEvents(colData[0], colData[1]);
          colData[1].ownCollider.processCollisionEvents(colData[1], colData[0]);
        }
      }
    }
  }

  function resolveCollisions() {
    for (let i = 0; i < collisionBuffer.length; i++) {
      const typeA =
        collisionBuffer[i][0].ownCollider.colliderGeometry.geometryType;
      const typeB =
        collisionBuffer[i][1].ownCollider.colliderGeometry.geometryType;
      collisionResolverMap.get(typeA + typeB)(
        collisionBuffer[i][0],
        collisionBuffer[i][1],
      );
    }
  }

  function fireCollisionEvents() {
    actorsWithColliders.forEach((actor) =>
      actor.colliderComponent.fireEvents(),
    );
    actorsWithColliders.length = 0;
  }

  function distributeForces() {
    for (let i = 0; i < collisionBuffer.length; i++) {
      const dynCols = [];
      const staticCols = [];
      for (let j = 0; j < collisionBuffer[i].length; j++) {
        if (collisionBuffer[i][j].ownCollider.parent.forceComponent)
          dynCols.push(collisionBuffer[i][j]);
        else staticCols.push(collisionBuffer[i][j]);
      }
      if (staticCols.length === 2) return;
      if (staticCols.length === 1)
        distributeStaticDynamic(staticCols[0], dynCols[0]);
      else distributeDynamicDynamic(dynCols[0], dynCols[1]);
    }
    collisionBuffer.length = 0;
  }

  function distributeStaticDynamic(staticColliderData, dynamicColliderData) {
    const dynVel =
      dynamicColliderData.ownCollider.parent.forceComponent.vel.copy();
    //console.log(p5.Vector);
    const velNormal = dynVel.copy().dot(staticColliderData.normal); //p5.Vector.dot(dynVel, staticColliderData.normal);
    const totElasticity =
      staticColliderData.ownCollider.elasticity +
      dynamicColliderData.ownCollider.elasticity;
    const forceOut = staticColliderData.normal.mult(-velNormal * totElasticity);
    if (
      dynamicColliderData.ownCollider.parent.forceComponent.checkForceOverrides(
        staticColliderData.ownCollider,
        p5.createVector(),
        dynamicColliderData.ownCollider,
        forceOut,
      )
    )
      return;
    dynamicColliderData.ownCollider.parent.forceComponent.addForce(forceOut);
  }

  function distributeDynamicDynamic(colliderA, colliderB) {
    console.log("dyn dyn col NOT IMPLMENTED YET!");
  }

  //Full Game Loop
  function engineLoop() {
    forceUpdate();
    checkCollisions(actorsWithColliders);
    resolveCollisions();
    fireCollisionEvents();
    distributeForces();
    update();
    render();
  }

  //--------------------Global Util Functions---------------------//

  function loadScene(scene) {
    scene.actors.forEach((actor) => {
      actor.initialize();
    });
    scenes.push(scene);
  }

  function unloadScene(scene) {
    //scene.unload();
    scenes.splice(scenes.indexOf(scene), 1);
  }

  //--------------------Public Components Access------------------//
  function createGroundGeometryCollider(settings, actor, pos) {
    return createColliderComponent(createGroundGeometry, settings, actor, pos);
  }
  //have geometry as arg?
  function createRectGeometryCollider(settings, actor, pos) {
    return createColliderComponent(createRectGeometry, settings, actor, pos);
  }

  const components = {
    get Actor() {
      return createActorComponent;
    },
    get Force() {
      return createForceComponent;
    },
    get GroundCollider() {
      return createGroundGeometryCollider;
    },
    get RectCollider() {
      return createRectGeometryCollider;
    },
    get Animator() {
      return createAnimatorComponent;
    },
    get Renderer() {
      return createRendererComponent;
    },
  };

  //##########################ENGINE OBJECT###########################//
  return {
    get CreateScene() {
      return createScene;
    },
    get LoadScene() {
      return loadScene;
    },
    get UnloadScene() {
      return unloadScene;
    },
    get GenerateCurveData() {
      return createCurveData;
    },
    get Utils() {
      return {
        GenerateCurveData: createCurveData,
        SliceImage: createImageSlices,
      };
    },
    get CreateScribbleInstance() {
      return createScribbleInstance;
    },
    get Components() {
      return components;
    },
    get InputHandler() {
      return inputHandler;
    },
    get CameraPanning() {
      return panning;
    },
    set CameraPanning(val) {
      panning.x = val.x ?? panning.x;
      panning.y = val.y ?? panning.y;
    },
    get EngineLoop() {
      return engineLoop;
    },
  };
}
