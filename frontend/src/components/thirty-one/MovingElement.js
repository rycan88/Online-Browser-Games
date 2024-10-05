import { useEffect, useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const MovingElement = ({id, element, startPosition, animationEndPosition={left:0, top:0}, animationEndCall, removeMovingElement}) => { 
    const [position, setPosition] = useState(null);

    useEffect(() => {

        const startTimer = setTimeout(() => {
            setPosition({left: animationEndPosition.left, top: animationEndPosition.top - NAVBAR_HEIGHT / 2});

        }, 10);

        const endTimer = setTimeout(() => {
            if (animationEndCall) {
                animationEndCall();
            }

        }, 675);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        }    
    }, [])

    return (
        <div className={`absolute transition-all duration-700 ease-out`}
            style={{left: position ? position.left : startPosition.left, top: position ? position.top - NAVBAR_HEIGHT / 2 : startPosition.top}}
            onTransitionEnd={() => {
                removeMovingElement(id)
            }}
        >
            {element}
        </div>
    );
}