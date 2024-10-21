import { BsInfoCircleFill } from "react-icons/bs";
import { Overlay } from "./Overlay";
import { useState } from "react";
import { FaGear } from "react-icons/fa6";

const buttonIcon = {"info": <BsInfoCircleFill />, "settings": <FaGear className="text-slate-400"/>}

export const InfoButton = ({buttonStyle, buttonType="info", children}) => {
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
                {buttonIcon[buttonType]}
            </div>
            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                {children}
            </Overlay>
        </>
    )
}