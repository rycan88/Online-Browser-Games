import { FaHandBackFist } from "react-icons/fa6";
import { Overlay } from "../Overlay";

export const ThirtyOneKnockOverlay = ({knockPlayer}) => {
    return (
        <Overlay isOpen={true}>
            <div className="flex flex-col h-full justify-center items-center text-white text-[5vh]">
                <div className="relative bottom-[12vh]">
                    {knockPlayer} knocks!
                </div>
                <FaHandBackFist className="h-[12vh] w-[12vh] animate-ping"/>
            </div>
        </Overlay>
    )
}