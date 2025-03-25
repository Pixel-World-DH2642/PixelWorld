import { observer } from "mobx-react-lite";
import { WorldCanvasPresenter } from "../presenters/worldCanvasPresenter";

export const RootPage = observer(({ model }) => {
  console.log(model);

  return <WorldCanvasPresenter model={model} />;
});
