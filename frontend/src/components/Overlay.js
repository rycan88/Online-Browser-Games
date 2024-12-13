import { useState } from "react";
import "../css/Overlay.css";
import { IoMdClose } from "react-icons/io";

export function Overlay({ isOpen, onClose, children }) {
    return (
        <div>
            {isOpen ? (
                <div className="overlay entirePage"> 
                    <div className="background" 
                        onClick={(e) => {
                            if (e.target.classList.contains("overlayContainer")) {
                                if (onClose) {
                                    onClose();
                                }
                            }
                        }}>
                        {   onClose && 
                            <div className="absolute top-4 right-4 text-slate-200 text-[40px]"
                                onClick={(e) => {
                                    if (onClose) {
                                        onClose();
                                    }
                                }}
                            >
                                <IoMdClose />
                            </div>
                        }
                        <div className="overlayContainer">
                            {children}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}