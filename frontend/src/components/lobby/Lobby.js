import "../../css/Lobby.css";

import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getSocket from "../../socket";
import { TelepathRules } from "../telepath/TelepathRules";

import { AppContext } from "../../App";

const Rules = {"telepath": <TelepathRules />, "thirty_one": "Get 31"}
const Titles = {"telepath": "Telepath", "thirty_one": "31"}

const socket = getSocket();
export const Lobby = ({game}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { rooms } = useContext(AppContext);
    const roomArray = Object.keys(rooms);

    const [typedCode, setTypedCode] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(location.state?.error); 
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
        goToRoom(gameName, roomCode);
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
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        return code;
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="lobbyBox">
                <h1 className="gameTitle">{Titles[game]}</h1>
                <p className="rules">{Rules[game]}</p>
                <input type="text" 
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
                        createRoom(game, roomCode);
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
        </div>
    )

}