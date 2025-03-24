//Import Views...
import{WorldCanvasPresenter} from "./presenters/worldCanvasPresenter";

//Import Reactive Resources
import { observer } from "mobx-react-lite";
//Router Setup

//Instantiate React Root
export const ReactRoot = observer(function ReactRoot(props){
    return <div className="WorldCanvas">
        <WorldCanvasPresenter model={props.model}/>
    </div>
});