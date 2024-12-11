import { useState, useEffect } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";

import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathListContainers } from "../components/telepath/TelepathListContainers";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { TelepathRules } from "../components/telepath/TelepathRules";
import { InfoButton } from "../components/InfoButton";

// TODO
// QoL changes
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
    const [teamMode, setTeamMode] = useState(false);

    // List to show in middle
    const [mainUser, setMainUser] = useState({socketId:socket.id, userId:socket.userId, nickname:socket.nickname});

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            playersData[socket.userId] && setDataInitialized(true);
        });

        socket.on("receive_game_data", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
            setShouldShowResults(data.shouldShowResults);
            !data.shouldShowResults && setMainUser({socketId:socket.id, userId:socket.userId, nickname:socket.nickname});
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/telepath/lobby`, { state: {error: errorMessage}});
        });

        socket.on('update_team_mode', (teamMode) => {
            setTeamMode(teamMode);                
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_telepath_data', roomCode);

        return () => {
            socket.off('receive_game_data');
            socket.off('receive_players_data');
            socket.off('room_error');
        };
    }, []);

    if (!dataInitialized) {
        return <LoadingScreen/>
    }

    return (
        <div className="telepathPage entirePage">
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    <TelepathRules />
                </InfoButton> 
            </div>
  
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="containerHolder">
                <div className="scoreDisplayContainer scrollbar-hide">
                    <TelepathTeamScoresDisplay playersData={playersData} 
                                               shouldShowResults={shouldShowResults}
                                               setMainUser={setMainUser}
                                               mainUser={mainUser}
                                               teamMode={teamMode}
                    />
                </div>
                <div className="listsContainer">
                    <TelepathListContainers shouldShowResults={shouldShowResults}
                                            prompt={prompt}
                                            wordLimit={wordLimit}
                                            roomCode={roomCode}
                                            playersData={playersData}
                                            mainUser={mainUser}
                                            teamMode={teamMode}
                    />
                </div>
            </div>
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>

    );
}

