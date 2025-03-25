//Import Resources
import { observer } from "mobx-react-lite";
import { WorldCanvasView } from "../views/worldCanvasView";

export const WorldCanvasPresenter = observer(function WorldCanvasRender({
  model,
}) {
  return (
    <WorldCanvasView
      sketch={model.sketch}
      x={model.position.x}
      y={model.position.y}
    />
  );
});
