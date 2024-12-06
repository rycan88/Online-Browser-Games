import { useContext } from "react";
import { OddColourOutContext } from "../../pages/OddColourOut";
import '../../css/OddColourOut.css';
import { getOddColourOutIsMarked } from "./OddColourOutSettings";
import { IoMdClose } from "react-icons/io";


// props
// gridSize: int
// color: string
// isOdd:  bool

export const OddColourOutTile = ({gridSize, color, isOdd}) => {
    const { isGameRunning, correctAction, wrongAction, isShow } = useContext(OddColourOutContext);
    const clickAction = (isOdd) => {
        if (isOdd) {
            correctAction();
        } else {
            wrongAction();
        }
    } 

    const isMarked = getOddColourOutIsMarked();
    const size = 90 / (gridSize);

    return (
        <div className="tile" 
            style={{width: `${size}%`, height: `${size}%`, backgroundColor: color}}
            onClick={() => {
            if (isGameRunning) {
                clickAction(isOdd);
            }
            }}>

            { isOdd &&
                <IoMdClose className="text-black w-[75%] h-[75%]" 
                            style={{color: (!isGameRunning && isMarked && !isShow) ? "black" : color, transition: !isGameRunning ? "color 0.75s ease" : ""}}
                />
            }
        </div>
    )
}