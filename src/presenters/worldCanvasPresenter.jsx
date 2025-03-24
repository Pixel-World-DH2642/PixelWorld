//Import Resources
import { observer } from "mobx-react-lite";
import { WorldCanvasView } from "/src/views/WorldCanvasView";


export const WorldCanvasPresenter = observer(
    function WorldCanvasRender(props){
        //Functions & Properties

        //Route To Views
        return <WorldCanvasView
            props = {props}
        />
    }
);