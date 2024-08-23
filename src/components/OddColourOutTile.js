import { useContext } from "react";
import { OddColourOutContext } from "../pages/OddColourOut";
import '../css/OddColourOut.css';

export const OddColourOutTile = (props) => {
    const { isGameRunning, correctAction, wrongAction } = useContext(OddColourOutContext);
    const clickAction = (isOdd) => {

        if (isOdd) {
            correctAction();
        } else {
            wrongAction();
        }
    }

    const gridSize = props.gridSize; 
    const size = 90 / (gridSize);

    return (
        <div className="tile" 
            style={{width: size+"%", height: size+"%", backgroundColor: props.color}}
            onClick={() => {
            if (isGameRunning) {
                clickAction(props.isOdd);
            }
            }}>
        </div>
    )
}