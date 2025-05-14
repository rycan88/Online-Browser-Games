import { getNickname, refreshPage, sendRefreshBroadcast } from "../utils";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import getSocket from "../socket";
import { ToggleSwitch } from "../components/ToggleSwitch";
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
            socket.nickname = typedWord;
            fName.current.value = "";
            setTypedWord("");
            refreshPage();
            socket.emit("nickname_changed", typedWord);
        }
    }
  
    const goBackToPreviousPage = () => {
        navigate(-1);
    }
    const fName = useRef('');

    return (
        <div className="entirePage">
            <div className="flex flex-col h-full w-full items-center">
                <div className="flex flex-col gap-2 text-[calc(min(5vh,5vw))] py-6">
                    <h2>Hello {getNickname()}!</h2>
                </div>

                <div className="flex w-full h-[calc(min(70px,10vh))] justify-center">
                    <input className="w-[200px] sm:w-[300px] text-center" onChange={handleTextChange} onKeyDown={ keyDownHandler } ref={fName} maxLength="12"></input>
                    <button className="w-[100px] sm:w-[100px] gradientButton text-white" onClick={changeNickname}>Change Username</button>
                </div>
                <div className="flex h-[70%] items-center justify-center">
                    <button className="gradientButton p-[10px] rounded-[5%] text-white"
                            onClick={goBackToPreviousPage}
                    >
                        Return to previous screen
                    </button>
                </div>
            </div>
        </div>
    );
}