import { useState } from "react";
import "../css/Overlay.css";
import { IoMdClose } from "react-icons/io";

export function Overlay({ isOpen, onClose, children, fullScreen=false }) {
    return (
        <div>
            {isOpen ? (
                <div className={`overlay entirePage ${fullScreen && "h-[100vh] md:h-[calc(100vh-60px)]"}`}> 
                    <div className={`background ${fullScreen && "h-[100vh] md:h-[calc(100vh-60px)]"}`} 
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