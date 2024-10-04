import { useEffect, useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const ThirtyOneMovingCard = ({element, setIsMoving, position, setPosition, animationEndPosition={left:0, top:0}, animationEndCall}) => {    
    useEffect(() => {
        setPosition({left: animationEndPosition.left, top: animationEndPosition.top - NAVBAR_HEIGHT / 2});
    }, [])

    return (
        <div className={`absolute transition-all duration-700 ease-out`}
            style={{left: position.left, top: position.top - NAVBAR_HEIGHT / 2}}
            onTransitionEnd={() => {
                setIsMoving(false);
                if (animationEndCall.current) {
                    animationEndCall.current();
                }
            }}
        >
            {element.current}
        </div>
    );
}