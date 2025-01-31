
import { useState } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export const FullscreenButton = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
            console.log(window.screen.orientation)
            if (window.screen.orientation.lock) {
                window.screen.orientation.lock('landscape').catch((err) => {
                    console.error('Orientation lock failed: ', err);
                });
              }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
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
