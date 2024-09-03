import "../css/Lobby.css";

import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getSocket from "../socket";

import { AppContext } from "../App";

const socket = getSocket();
export const Lobby = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { rooms, setRooms } = useContext(AppContext);

    const [typedCode, setTypedCode] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(location.state?.error); 
    const handleTextChange = (event) => {
        setErrorMessage("");
        setTypedCode(event.target.value);
    }
  
    const goToRoom = (gameName, roomCode) => {
        navigate(`/${gameName}/lobby/${roomCode}`);
        console.log("MOVED");
    }
    const createRoom = (gameName, roomCode) => {
        socket.emit('create_room', gameName, roomCode);
        setRooms([...rooms, roomCode]);
        goToRoom(gameName, roomCode);
    };
  
    const joinRoom = (roomCode) => {
        console.log(rooms);
        if (rooms.includes(roomCode)) {
            const gameName = "telepath";
            goToRoom(gameName, roomCode);
        } else {
            setErrorMessage("Room " + roomCode + " does not exist");
        }
    };
  
    const keyDownHandler = (event) => {
        if (event.code === 'Enter') {
            joinRoom(typedCode);
        } 
    };

    const generateRoomCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        return code;
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="flex flex-col w-[500px] h-[80%] place-content-around items-center">
                <h1>{props.game}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p className="text-red-500">{errorMessage}</p>
                <button onClick={() => {
                    const roomCode = generateRoomCode();
                    createRoom("telepath", roomCode);
                }}>
                    Create<br/>Game
                </button>
                <div className="flex place-content-around w-full items-center">
                    <input className="w-[50%] h-[50px]" 
                           type="text" 
                           placeholder="Enter 4-letter code..."
                           onChange={ handleTextChange } 
                           onKeyDown={ keyDownHandler }
                    ></input>
                    <button onClick={() => {
                        joinRoom(typedCode);
                    }}>
                        Join<br/>Game
                    </button>
                </div>
            </div>
        </div>
    )

}