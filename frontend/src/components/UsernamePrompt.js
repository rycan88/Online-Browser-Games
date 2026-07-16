import { useRef, useState } from "react";
import { Overlay } from "./Overlay";
import Cookies from "js-cookie";
import { refreshPage } from "../utils";
import getSocket from "../socket";

const socket = getSocket();

const hasSetUsernameCookieName = "hasSetUsername";
export const UsernamePrompt = () => {
    const [isOpen, setIsOpen] = useState(!hasSetUsername());
    const [typedWord, setTypedWord] = useState("")

    const handleTextChange = (event) => {
      setTypedWord(event.target.value);
    }
  
    const keyDownHandler = (event) => {
        if (event.key === "Enter") {
            changeNickname();
        }
    }
  
    const changeNickname = () => {
        if (typedWord.trim() !== "") {
            Cookies.set('nickname', typedWord, { expires: 365});

            refreshPage();

            socket.emit("nickname_changed", typedWord);

            Cookies.set(hasSetUsernameCookieName, true, { expires: 365});
        }
    }
  
    const keepUsername = () => {
        Cookies.set(hasSetUsernameCookieName, true, { expires: 365});
        setIsOpen(false)
    }
    const fName = useRef('');


    return (
        <Overlay isOpen={isOpen} fullScreen={true}>

            <div className="flex flex-col items-center justify-between w-[90%] max-w-[600px] min-h-[40%] text-[1.8vh] bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="text-[2vh] font-semibold text-slate-200">
                    Choose Your Username
                </div>
                <div className="text-[1.75vh] font-semibold text-slate-400">
                    Used in lobbies and on leaderboards.
                </div>

                <div className="relative w-full h-[5vh] mt-[20px] mb-2"> 
                    <input ref={fName}
                        onChange={handleTextChange}
                        onKeyDown={keyDownHandler} 
                        maxLength="12"
                        placeholder="Enter new username"
                        className="myInputBar w-full h-full px-4 py-2 mb-4"
                    />
                    <span className={`absolute right-2 bottom-1 text-[10px] font-mono text-slate-400 ${typedWord.length > 0 ? "opacity-100" : "opacity-0"}    `}>
                        {typedWord.length}/12
                    </span>
                </div>

                <button
                    onClick={changeNickname}
                    className="gradientButton w-full py-2 mb-2 font-medium text-slate-200 rounded-lg transition shadow-sm"
                >
                    Set Username
                </button>     

                <button
                    onClick={keepUsername}
                    className="w-full bg-transparent hover:text-slate-200 border border-slate-600 text-slate-400 font-medium py-2 rounded-lg transition"
                >
                    Continue as "{socket.nickname}"
                </button>
                

            </div>

        </Overlay>
    );
}

export const hasSetUsername = () => {
    return Cookies.get(hasSetUsernameCookieName) === "true" || socket.nickname.slice(0, 5) !== "guest";
}
