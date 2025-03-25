//Import Resources
import { observer } from "mobx-react-lite";
import { WorldCanvasView } from "../views/worldCanvasView";

export const WorldCanvasPresenter = observer(function WorldCanvasRender({
  model,
}) {
  //Functions & Properties
  console.log(model);

  //Route To Views
  return <WorldCanvasView model={model} />;
});
