import { Overlay } from "../Overlay";

export const ThirtyOneCrownOverlay = ({winPlayer, isFullscreen}) => {
    
    return (
        <Overlay isOpen={true} fullScreen={isFullscreen}>
            <div className="flex flex-col h-full gap-[10vh] justify-center items-center text-white text-[5vh]">
                <div className="text-[24vh] animate-bounce">👑</div>
                <div className="relative bottom-[12vh]">
                    {winPlayer} wins!
                </div>
            </div>
        </Overlay>
    )
}