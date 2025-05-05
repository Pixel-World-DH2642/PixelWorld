export const UI_INPUT_TYPE = {
    KEY_DOWN: { inputType: "key", actionType: "down" },
    KEY_UP: { inputType: "key", actionType: "up" },
    KEY_HOLD: { inputType: "key", actionType: "hold" },
    CODE_DOWN: { inputType: "code", actionType: "down" },
    CODE_UP: { inputType: "code", actionType: "up" },
    CODE_HOLD: { inputType: "code", actionType: "hold" },
    POINTER_DOWN: { inputType: "pointer", actionType: "down" },
    POINTER_UP: { inputType: "pointer", actionType: "up" },
    POINTER_HOLD: { inputType: "pointer", actionType: "hold" },
    POINTER_MOVE: { inputType: "pointer", actionType: "move" },
    /*
      PAD_BUTTON_DOWN:
      PAD_BUTTON_UP:
      PAD_BUTTON_HOLD:
      PAD_JOYSTICK:
      */
  };
  
  function InputHandler() {
    this.update = null;
    this.addBinding = null;
    this.addPtrToElement = null;
    this.clearBindings = null;
    this.mouseIsDown = null;
  }
  
  export function createInputHandler() {
    const keyDownEvents = [];
    const keyUpEvents = [];
    const keyHoldEvents = [];
    const codeHoldEvents = [];
    const keys = new Map(); //[]//= [...InputKeys];
    const codes = new Map(); //[]// = [...InputCodes];
    const pointerDownEvents = [];
    const pointerUpEvents = [];
    const pointerHoldEvents = [];
    const pointerMoveEvents = [];
    const pointerRelativeToElement = [];
  
    //const gamePadEvents = [];
  
    //For accessing/ removing listeners
    let id = 0;
  
    let mouseIsDown = false;
    let ptrX = 0; //not implemented yet
    let ptrY = 0; //not implemented yet
    let prevPtrX = 0;
    let prevPtrY = 0;
  
    function update() {
      keys.forEach((keyData, key) => {
        if (keyData.pressed) keyHoldEvents.forEach((ev) => ev(keyData));
      });
  
      codes.forEach((codeData, key) => {
        if (codeData.pressed) codeHoldEvents.forEach((ev) => ev(codeData));
      });
  
      if (mouseIsDown)
        pointerHoldEvents.forEach((ev) => {
          ev();
        });
    }
  
    //Binding delegator
    function addBinding(_event, _type, _binding) {
      id++;
      if (_type.inputType === "key" || _type.inputType === "code")
        addKBD_Binding(_event, _type, _binding);
      if (_type.inputType === "pointer") addPtr_Binding(_event, _type, _binding);
      //Sensors
      //Gamepad
    }
  
    function addPtrToElement(_element) {
      const elRelPos = {
        ptrX: 0,
        ptrY: 0,
        prevPtrX: 0,
        prevPtrY: 0,
      };
  
      pointerRelativeToElement.push({ element: _element, elRelPos });
  
      //Handle
      return {
        get ptrX() {
          return elRelPos.ptrX;
        },
        get ptrY() {
          return elRelPos.ptrY;
        },
        get prevPtrX() {
          return elRelPos.prevPtrX;
        },
        get prevPtrY() {
          return elRelPos.prevPtrY;
        },
      };
    }
  
    function addKBD_Binding(_event, _type, _binding) {
      let userEv = function (_e, _key, _code) {
        //Handle Hold Events
        if (_type.actionType === "hold") {
          if (_type.inputType === "key" && _e.key === _binding) _event();
          else if (_type.inputType === "code" && _e.code === _binding) _event();
        }
  
        //Handle Keydown and Keyup Events
        if (_e.repeat) return;
  
        switch (_type) {
          case UI_INPUT_TYPE.KEY_DOWN:
          case UI_INPUT_TYPE.KEY_UP:
            if (_e.key === _binding) _event();
            break;
          case UI_INPUT_TYPE.CODE_DOWN:
          case UI_INPUT_TYPE.CODE_UP:
            if (_e.code === _binding) _event();
            break;
        }
  
        if (_e.code !== "Tab") _e.preventDefault;
      };
  
      if (_type.actionType === "down") keyDownEvents.push(userEv);
      else if (_type.actionType === "up") keyUpEvents.push(userEv);
      else {
        if (_type.inputType === "key") keyHoldEvents.push(userEv);
        else codeHoldEvents.push(userEv);
      }
  
      return { id: id, type: _type.actionType }; //Return data if we want to access or remove binding later
    }
  
    function addPtr_Binding(_event, _type, _binding) {
      switch (_type) {
        case UI_INPUT_TYPE.POINTER_DOWN:
          pointerDownEvents.push(_event);
          break;
        case UI_INPUT_TYPE.POINTER_UP:
          pointerUpEvents.push(_event);
          break;
        case UI_INPUT_TYPE.POINTER_HOLD:
          pointerHoldEvents.push(_event);
          break;
        case UI_INPUT_TYPE.POINTER_MOVE:
          pointerMoveEvents.push(_event);
          break;
      }
    }
  
    function getRelativeCoordinates(event, element) {
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
      return { x, y };
    }
  
    //Clears binding passed in otherwise clears all bindings
    function clearBindings(_binding) {
      for (const ev of keyDownEvents) window.removeEventListener(ev);
      for (const ev of keyUpEvents) window.removeEventListener(ev);
      keyDownEvents.length = 0;
      keyUpEvents.length = 0;
      keyHoldEvents.length = 0;
      codeHoldEvents.length = 0;
    }
  
    let keyDown_HoldHandler = function (_e) {
      keys.set(_e.key, { key: _e.key, pressed: true });
      codes.set(_e.code, { code: _e.code, pressed: true });
    };
  
    let keyUp_HoldHandler = function (_e) {
      keys.set(_e.key, { key: _e.key, pressed: false });
      codes.set(_e.code, { code: _e.code, pressed: false });
    };
  
    window.addEventListener("keydown", keyDown_HoldHandler);
    window.addEventListener("keyup", keyUp_HoldHandler);
    window.addEventListener("keydown", (e) => {
      for (const ev of keyDownEvents) ev(e);
    });
    window.addEventListener("keyup", (e) => {
      for (const ev of keyUpEvents) ev(e);
    });
    window.addEventListener("pointerdown", (e) => {
      mouseIsDown = true;
      pointerDownEvents.forEach((usrEv) => {
        usrEv(e);
      });
    });
    window.addEventListener("pointerup", (e) => {
      mouseIsDown = false;
      pointerUpEvents.forEach((usrEv) => {
        usrEv(e);
      });
    });
    window.addEventListener("pointermove", (e) => {
      prevPtrX = ptrX;
      prevPtrY = ptrY;
      ptrX = e.clientX;
      ptrY = e.clientY;
  
      pointerMoveEvents.forEach((usrEv) => {
        usrEv(e);
      });
  
      pointerRelativeToElement.forEach((ptrData) => {
        const ptrpos = getRelativeCoordinates(e, ptrData.element);
        ptrData.elRelPos.prevPtrX = ptrData.elRelPos.ptrX;
        ptrData.elRelPos.prevPtrY = ptrData.elRelPos.ptrY;
        ptrData.elRelPos.ptrX = ptrpos.x;
        ptrData.elRelPos.ptrY = ptrpos.y;
      });
    });
  
    const inputHandler = new InputHandler();
  
    Object.defineProperties(inputHandler, {
      update: {
        get() {
          return update;
        },
      },
      addBinding: {
        get() {
          return addBinding;
        },
      },
      addPtrToElement: {
        get() {
          return addPtrToElement;
        },
      },
      clearBindings: {
        get() {
          return clearBindings;
        },
      },
      mouseIsDown: {
        get() {
          return mouseIsDown;
        },
      },
    });
  
    return inputHandler;
  }
  