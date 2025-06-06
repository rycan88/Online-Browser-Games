import { BsInfoCircleFill } from "react-icons/bs";
import { Overlay } from "./Overlay";
import React, { useState } from "react";
import { FaGear } from "react-icons/fa6";

const buttonIcon = {"info": <BsInfoCircleFill />, "settings": <FaGear className="text-slate-400"/>}

export const InfoButton = ({buttonStyle, buttonType="info", children, fullScreen=false}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    }

    const closeOverlay = () => {
        setIsOpen(false);
    }

    const childrenWithClose = React.Children.map(children, (child) => {
        return React.cloneElement(child, { closeOverlay: closeOverlay});
    });

    return (
        <>
            <div className={`flex items-center justify-center text-sky-700 text-[3vh] hover:cursor-pointer shadow-xl ${buttonStyle}`}
                onClick={() => {
                    toggleOverlay();
                }}
            >
                {buttonIcon[buttonType]}
            </div>
            <Overlay isOpen={isOpen} onClose={toggleOverlay} fullScreen={fullScreen}>
                { childrenWithClose }
            </Overlay>
        </>
    )
}