import "../../css/Lobby.css";

import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getSocket from "../../socket";
import { TelepathRules } from "../telepath/TelepathRules";

import { AppContext } from "../../App";
import { InfoButton } from "../InfoButton";
import { ThirtyOneRules } from "../thirty-one/ThirtyOneRules";
import { GamesData } from "../GamesData";
import { RPSMeleeRules } from "../rps-melee/RPSMeleeRules";
import { HanabiRules } from "../hanabi/HanabiRules";
import { FullscreenButton } from "../FullscreenButton";
import useFullscreen from "../../hooks/useFullscreen";

const Rules = {"telepath": <TelepathRules />, "thirty_one": <ThirtyOneRules />, "rock_paper_scissors_melee": <RPSMeleeRules />, "hana": <HanabiRules />}

const socket = getSocket();
export const Lobby = ({gameName}) => {
    const navigate = useNavigate();
    const isFullscreen = useFullscreen();
    const location = useLocation();

    const { rooms } = useContext(AppContext);
    const roomArray = Object.keys(rooms);

    const [typedCode, setTypedCode] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(location.state?.error); 

    const gameData = GamesData.find(data => data.id === gameName);

    useEffect(() => {
        socket.on("room_created", (gameName, roomCode) => {
            goToRoom(gameName, roomCode);
        })

        return () => {
            socket.off('room_created');
        };
    }, []);

    const handleTextChange = (event) => {
        setErrorMessage("");
        const inp = event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
        setTypedCode(inp);
    }
  
    const goToRoom = (gameName, roomCode) => {
        navigate(`/${gameName}/lobby/${roomCode}`);
    }
    const createRoom = (gameName, roomCode) => {
        socket.emit('create_room', gameName, roomCode);
    };
  
    const joinRoom = (roomCode) => {
        if (roomCode.length !== 4) {
            setErrorMessage("Code must be exactly 4 characters long");
            return;
        }
        if (roomArray.includes(roomCode)) {
            const gameName = rooms[roomCode];
            goToRoom(gameName, roomCode);
        } else {
            setErrorMessage("Lobby " + roomCode + " does not exist");
        }
    };
  
    const keyDownHandler = (event) => {
        if (event.code === 'Enter') {
            joinRoom(typedCode);
        } 
    };

    const generateRoomCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWYZ"; // NO GOOD X WORDS
        let code = "";
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        return code;
    }

    return (
        <div className={`lobbyPage entirePage place-content-center items-center ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}>
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    {Rules[gameName]}
                </InfoButton>
                <div className="text-slate-200">
                    <FullscreenButton shouldRotate={false}/>
                </div>
            </div>

            <div className="lobbyBox">
                <h1 className="gameTitle">{gameData.title}</h1>

                <div className="flex gap-[16px] w-full h-[15%] pt-[5%] justify-center items-center text-black">
                    <div className="myContainerCardInnerBox bg-sky-900/80 text-white px-[3%] py-[2%] shadow-lg">{gameData.playerLimitText}</div>
                    <div className="myContainerCardInnerBox bg-sky-900/80 text-white px-[3%] py-[2%] shadow-lg ">{gameData.duration}</div>
                </div>

                <div className="flex flex-col gap-[4%] h-[45%] my-4 px-2 text-[1.5em] overflow-y-auto">
                    <div>{gameData.description}</div>
                </div>
                <input className="lobbyInput"
                        type="text" 
                        value={typedCode}
                        placeholder="Enter 4-letter code..."
                        onChange={ handleTextChange } 
                        onKeyDown={ keyDownHandler }
                        maxLength="4"
                ></input>
                <p className="errorText">{errorMessage}</p>
                <div className="buttonsContainer">
                    <button className="gradientButton" onClick={() => {
                        let roomCode = generateRoomCode();
                        // Makes sure room does not already exist
                        while (roomArray.includes(roomCode)) {
                            roomCode = generateRoomCode();
                        }
                        createRoom(gameName, roomCode);
                    }}>
                        <h2>Create</h2>
                    </button>
                    <button className="gradientButton" onClick={() => {
                        joinRoom(typedCode);
                    }}>
                        <h2>Join</h2>
                    </button>
                </div>

 
            </div>
            <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
        </div>
        
    )

}