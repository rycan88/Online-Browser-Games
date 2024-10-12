import { useEffect, useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const MovingElement = ({id, element, startPosition, animationEndPosition={left:0, top:0}, animationEndCall, removeMovingElement, transitionDuration=700}) => { 
    const [position, setPosition] = useState(null);

    useEffect(() => {
        let endCalled = false;
        const startTimer = setTimeout(() => {
            setPosition({left: animationEndPosition.left, top: animationEndPosition.top});

        }, 10);

        const endTimer = setTimeout(() => {
            if (animationEndCall) {
                animationEndCall();
            }
            endCalled = true;
        }, transitionDuration - 25);

        const fallbackTimeout = setTimeout(() => {
            if (!endCalled) {
                animationEndCall();
                removeMovingElement(id);
            }

        }, transitionDuration);


        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        }    
    }, [])

    return (
        <div className={`fixed transition-all ease-out`}
            style={{left: position ? position.left : startPosition.left, top: position ? position.top : startPosition.top, transitionDuration: `${transitionDuration}ms`}}
            onTransitionEnd={() => {
                removeMovingElement(id)
            }}
        >
            {element}
        </div>
    );
}