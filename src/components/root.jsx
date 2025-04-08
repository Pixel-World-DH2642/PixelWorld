import { observer } from "mobx-react-lite";
import { WorldCanvasPresenter } from "../presenters/worldCanvasPresenter";

export const RootPage = observer(({ model }) => {
  function onPositionChange(event) {
    const { id, value } = event.target;
    model.position[id] = parseInt(value);
  }

  function onMove(event) {
    console.log("onMove");
    if (event.key === "ArrowUp") {
      model.position.y -= 3;
    } else if (event.key === "ArrowDown") {
      model.position.y += 3;
    }
    if (event.key === "ArrowLeft") {
      model.position.x -= 3;
    } else if (event.key === "ArrowRight") {
      model.position.x += 3;
    }
  }
  return <WorldCanvasPresenter model={model} />;
});
