import { useState, useEffect } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";

import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathListContainers } from "../components/telepath/TelepathListContainers";
import { useNavigate } from "react-router-dom";

// TODO
// QoL changes
// - Let players reconnect by saving them as a cookie
// - FREE FOR ALL MODE, COMPARE WITH EVERYONE

const socket = getSocket();

// props
// roomCode: string

export const Telepath = (props) => {
    const roomCode = props.roomCode;
    const navigate = useNavigate();
    // typedWord is the text in the input
    // pickedWords are the words added to the list

    const [dataInitialized, setDataInitialized] = useState(false)
    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);

    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});

    // List to show in middle
    const [mainUser, setMainUser] = useState(socket.userId);

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            playersData[socket.userId] && setDataInitialized(true);
        });

        socket.on("receive_game_data", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
            setShouldShowResults(data.shouldShowResults);
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/telepath/lobby`, { state: {error: errorMessage}});
        });

        socket.emit('get_all_telepath_data', roomCode);

        return () => {
            socket.off('receive_game_data');
            socket.off('receive_players_data');
            socket.off('room_error');
        };
    }, []);

    if (!dataInitialized) {
        return <></>
    }

    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="containerHolder">
                <div className="scoreDisplayContainer">
                    <TelepathTeamScoresDisplay playersData={playersData} 
                                               shouldShowResults={shouldShowResults}
                                               setMainUser={setMainUser}
                    />
                </div>
                <div className="listsContainer">
                    <TelepathListContainers shouldShowResults={shouldShowResults}
                                            prompt={prompt}
                                            wordLimit={wordLimit}
                                            roomCode={roomCode}
                                            playersData={playersData}
                                            mainUser={mainUser}
                    />
                </div>
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

