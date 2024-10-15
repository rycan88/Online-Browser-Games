import { useEffect, useRef, useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const MovingElement = ({id, element, startPosition, animationEndPosition={left:0, top:0}, animationEndCall, transitionDuration=700}) => { // Id is important so this element can easily be tracked
    const [position, setPosition] = useState(null);
    const endCalled = useRef(false);
    const isUnmounted = useRef(false);
    useEffect(() => {
        const startTimer = setTimeout(() => {
            setPosition({left: animationEndPosition.left, top: animationEndPosition.top});

        }, 10);

        const endTimer = setTimeout(() => {
            if (animationEndCall && !endCalled.current) {
                animationEndCall();
                console.log("endTimer");
                endCalled.current = true;
            }
 
        }, transitionDuration - 5);

        const fallbackTimeout = setTimeout(() => {
            if (!endCalled.current) {
                endCalled.current = true;
                animationEndCall();
                console.log("fallbackTimeout");
            }


        }, transitionDuration);


        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
            if (isUnmounted.current && !endCalled.current) {
                animationEndCall();
                endCalled.current = true;
                console.log("Destroyed");
            }
            isUnmounted.current = true;
        }    
    }, [])

    return (
        <div className={`fixed transition-all ease-out z-[50]`}
            style={{left: position ? position.left : startPosition.left, top: position ? position.top : startPosition.top, transitionDuration: `${transitionDuration}ms`}}
        >
            {element}
        </div>
    );
}