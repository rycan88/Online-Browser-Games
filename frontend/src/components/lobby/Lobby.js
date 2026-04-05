import "../../css/Lobby.css";

import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getSocket from "../../socket";
import { AppContext } from "../../App";
import { InfoButton } from "../InfoButton";
import { GamesData } from "../GamesData";
import { FullscreenButton } from "../FullscreenButton";
import useFullscreen from "../../hooks/useFullscreen";
import { Rules } from "./Room";
import { FaCalendarDays, FaUserPlus } from "react-icons/fa6";

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
                <div className="flex justify-center items-center text-slate-200">
                    <FullscreenButton shouldRotate={false}/>
                </div>
            </div>

            <div className="lobbyBox">
                <h1 className="text-[3.5vh]">{gameData ? gameData.title : ""}</h1>

                <div className="flex gap-[16px] w-full h-[15%] pt-[5%] justify-center items-center text-black">
                    <div className="myContainerCardInnerBox bg-sky-900/80 text-white px-[3%] py-[2%] shadow-lg">{gameData.playerLimitText}</div>
                    <div className="myContainerCardInnerBox bg-sky-900/80 text-white px-[3%] py-[2%] shadow-lg ">{gameData.duration}</div>
                </div>

                <div className="flex-1 flex flex-col gap-[6vh] justify-center items-center w-[90%] pb-[3vh]">                    
                    <button className="gradientButton flex items-center justify-center gap-2 text-slate-200 h-[11vh] w-full text-[3vh] shadow-xl rounded-xl" onClick={() => {
                        let roomCode = generateRoomCode();
                        // Makes sure room does not already exist
                        while (roomArray.includes(roomCode)) {
                            roomCode = generateRoomCode();
                        }
                        createRoom(gameName, roomCode);
                    }}>
                        <FaUserPlus />
                        <h2>Host</h2>
                    </button>

                    {/* <button className="greenGradientButton flex items-center justify-center gap-2 text-slate-200 h-[11vh] w-full text-[3vh] shadow-xl rounded-xl" onClick={() => {
                        let roomCode = generateRoomCode();
                        // Makes sure room does not already exist
                        while (roomArray.includes(roomCode)) {
                            roomCode = generateRoomCode();
                        }
                        createRoom(gameName, roomCode);
                    }}>
                        <FaCalendarDays />
                        <h2>Daily</h2>
                    </button>   */}

                    <div className="relative flex flex-col gap-2 justify-center items-center w-full">
                        <div className="flex rounded-xl justify-center items-center w-full overflow-hidden h-[8vh]">
                            <input className="lobbyInput w-full h-full text-center text-[3vh] focus:placeholder-transparent"
                                    type="text" 
                                    value={typedCode}
                                    placeholder="Enter 4-letter code..."
                                    onChange={ handleTextChange } 
                                    onKeyDown={ keyDownHandler }
                                    maxLength="4"
                            />

                            <button className="gradientButton text-slate-200 w-[12vh] h-full text-[2vh] shadow-xl " onClick={() => {
                                joinRoom(typedCode);
                            }}>
                                <h2>Join</h2>
                            </button>
                        </div>
                        <p className="absolute -bottom-[4vh] text-red-600 text-[2vh]">{errorMessage}</p>
                    </div>              
                </div>


 
            </div>
            <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
        </div>
        
    )

}