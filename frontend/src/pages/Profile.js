import { getNickname, refreshPage } from "../utils";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import getSocket from "../socket";
import '../css/Profile.css';
import { useNavigate } from "react-router-dom";

const socket = getSocket();

export const Profile = () => {
    const [typedWord, setTypedWord] = useState("")
    const navigate = useNavigate();

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
        }
    }
  
    const goBackToPreviousPage = () => {
        navigate(-1);
    }
    const fName = useRef('');

    return (
        <div className="profilePage entirePage justify-center items-center">
            <div className="relative w-full max-w-md bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl">
        
            <div className="no-wrap absolute -top-[10vh] left-1/2 -translate-x-[50%] text-[4vh] font-semibold text-slate-200">
                <div>{getNickname()}</div>
            </div>

            <div className="text-[2vh] font-semibold text-slate-200">
                Set New Username
            </div>

            <div className="h-[5vh] mt-5 mb-2"> 
                <input ref={fName}
                       onChange={handleTextChange}
                       onKeyDown={keyDownHandler} 
                       maxLength="12"
                       placeholder="Enter new username"
                       className="myInputBar w-full h-full px-4 py-2 mb-4"
                />

            </div>

            <button
                onClick={changeNickname}
                className="gradientButton w-full py-2 font-medium text-slate-200 rounded-lg transition shadow-sm"
            >
                Set Username
            </button>     

            <div className="absolute -bottom-[10vh] left-1/2 -translate-x-1/2 w-full">

                <button
                    onClick={goBackToPreviousPage}
                    className="w-[80%] bg-slate-700 hover:bg-slate-600 border border-slate-500 text-slate-200 font-medium py-2 rounded-lg transition"
                >
                    Return to previous page
                </button>
            </div>

        </div>
        <div className={`entirePage bg-black/70 z-[-10]`}></div>
      </div>
    )
}