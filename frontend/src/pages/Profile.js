import { getNickname, refreshPage, sendRefreshBroadcast } from "../utils";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import getSocket from "../socket";
import { ToggleSwitch } from "../components/ToggleSwitch";

const socket = getSocket();

export const Profile = () => {
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
            socket.nickname = typedWord;
            fName.current.value = "";
            setTypedWord("");
            refreshPage();
            socket.emit("nickname_changed", typedWord);
        }
    }
  
    const fName = useRef('');

    return (
        <div className="entirePage">
            <div className="flex flex-col h-full w-full items-center">
                <h1 className="text-6xl py-6">Hello {getNickname()}</h1>
                <div className="flex w-full h-[70px] justify-center">
                    <input className="w-[300px]" onChange={handleTextChange} onKeyDown={ keyDownHandler } ref={fName} maxLength="20"></input>
                    <button className="w-[100px] gradientButton text-white" onClick={changeNickname}>Change Username</button>
                </div>
            </div>
        </div>
    );
}