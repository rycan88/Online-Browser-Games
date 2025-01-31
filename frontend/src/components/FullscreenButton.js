
import { useState } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import useFullscreen from "../hooks/useFullscreen";

export const FullscreenButton = ({shouldRotate=false}) => {
    const isFullscreen = useFullscreen();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();

            if (shouldRotate && window.screen.orientation.lock) {
                window.screen.orientation.lock('landscape').catch((err) => {
                    console.error('Orientation lock failed: ', err);
                });
              }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <button className="text-[4vh]" 
                onClick={toggleFullscreen}
        >
            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
        </button>
    );
};
