import { useEffect, useRef, useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const MovingElement = ({id, element, startPosition, animationEndPosition={left:0, top:0}, animationEndCall, removeMovingElement, transitionDuration=700}) => { 
    const [position, setPosition] = useState(null);
    const endCalled = useRef(false);
    useEffect(() => {
        const startTimer = setTimeout(() => {
            setPosition({left: animationEndPosition.left, top: animationEndPosition.top});

        }, 10);

        const endTimer = setTimeout(() => {
            if (animationEndCall) {
                animationEndCall();
                console.log("endTimer", Date.now())
            }
            endCalled.current = true;
        }, transitionDuration - 25);

        const fallbackTimeout = setTimeout(() => {
            if (!endCalled.current) {
                animationEndCall();
                removeMovingElement(id);
                console.log("fallbackTimer")
            }

        }, transitionDuration);


        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        }    
    }, [])

    return (
        <div className={`fixed transition-all ease-out z-[50]`}
            style={{left: position ? position.left : startPosition.left, top: position ? position.top : startPosition.top, transitionDuration: `${transitionDuration}ms`}}
            onTransitionEnd={() => {
                removeMovingElement(id);
                console.log("movingElementRemoved", Date.now());
            }}
        >
            {element}
        </div>
    );
}