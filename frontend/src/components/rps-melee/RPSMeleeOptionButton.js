import { useEffect } from "react";
import getSocket from "../../socket";

const keyLetter = {"Up": "W", "Left": "A", "Right": "D", "UpLeft": "Q", "UpRight": "E"}; // Must be uppercase since ArrowLeft is how we check the left keypress
const buttonKeyPlacement = {"Up": "bottom-[100%] left-1/2  translate-y-1/2 -translate-x-1/2", "Left": "right-[100%] top-1/2  translate-x-1/2 -translate-y-1/2", "Right": "left-[100%] top-1/2 -translate-x-1/2 -translate-y-1/2", "UpLeft": "right-[70%] bottom-[70%]", "UpRight": "left-[70%] bottom-[70%]"};
const colours = {"rock": "bg-red-500", "paper": "bg-blue-500", "scissors": "bg-green-500", "gun": "bg-slate-800", "reflector": "bg-slate-400"};

const socket = getSocket();

export const RPSMeleeOptionButton = ({roomCode, icon, direction="Down", type="rock", isDisabled=false}) => {
    const buttonClickAction = () => {
        if (isDisabled) { return; }
        socket.emit("rps_melee_choose", roomCode, type);
    }

    useEffect(() => {
        const keyDownHandler = (event) => {
            const arrowKey = "Arrow" + direction
            if (event.key === keyLetter[direction].toLowerCase() || event.key === arrowKey) {
                buttonClickAction();
            }
        };

        window.addEventListener("keydown", keyDownHandler);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    }, [isDisabled]);



    return (
        <div className={`optionButton  ${colours[type]} ${!isDisabled ? "cursor-pointer hover:scale-[110%]" : "opacity-[50%]"} transition transform `}
            onClick={ buttonClickAction }
        >   
            { icon }
            <div className={`absolute ${buttonKeyPlacement[direction]}`}>
                <div className={`flex justify-center items-center text-black text-[2.3vh] w-[3.5vh] h-[3.5vh] rounded-full shadow-xl bg-slate-300 border-[2px] border-slate-800/80`}>
                    {keyLetter[direction]}   
                </div>             
            </div>
        </div>
    );

}