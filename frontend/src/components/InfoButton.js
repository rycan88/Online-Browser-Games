import { BsInfoCircleFill } from "react-icons/bs";
import { Overlay } from "./Overlay";
import { useState } from "react";

export const InfoButton = ({buttonStyle, children}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div className={`text-sky-700 text-[3vh] hover:cursor-pointer shadow-xl ${buttonStyle}`}
                onClick={() => {
                    toggleOverlay();
                }}
            >
                <BsInfoCircleFill />
            </div>
            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                {children}
            </Overlay>
        </>
    )
}