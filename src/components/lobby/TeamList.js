
import getSocket from "../../socket";
import { useEffect, useState } from "react";

const socket = getSocket();

// props
// players: [string]
export const TeamList = (props) => {
    const roomCode = props.roomCode;
    const [teamData, setTeamData] = useState([]);
    const [playerCount, setPlayerCount] = useState([]);
    useEffect(() => {
        socket.on('update_team_data', (teamData, playerCount) => {
            console.log("updated!", teamData);
            setTeamData(teamData);
            setPlayerCount(playerCount);
        });

        socket.emit("get_all_players", roomCode);

        return () => {
            socket.off('update_team_data');
        };
    }, []);

    const joinAction = (event) => {
        const buttonId = event.target.id; 
        const index = parseInt(buttonId, 10);
        socket.emit("join_diff_team", roomCode, socket.id, index);
    }

    return (
        <div className="teamList">
            {teamData.map((team, index) => {
                if (team.length === 0 || team.length >= 3) {
                    console.log("TEAM ERROR");
                    return <></>;
                } 

                return (
                    <div className="teamContainer">
                        <h2 className="teamLabel">Team {index + 1}</h2>
                        <div className="teamInfoContainer justify-between">
                            <h2 className={`playerLabel ${socket.id === team[0] && "text-sky-700"}`}>{team[0]}</h2>
                            {team.length === 2 
                                ? <h2 className={`playerLabel ${socket.id === team[1] && "text-sky-700"}`}>{team[1]}</h2>
                                : <button className="joinButton gradientButton" 
                                            id={index + 1} 
                                            disabled={socket.id === team[0]}
                                            onClick={joinAction}>Join</button>
                            }
                        </div>
                    </div>
                );
            })}
            { ((teamData.length) * 2 === playerCount) &&
                <div className="teamContainer">
                    <h2 className="teamLabel">Team {teamData.length + 1}</h2>
                    <div className="teamInfoContainer justify-center">
                        <button className="joinButton gradientButton" id={teamData.length + 1} onClick={joinAction}>Join</button>
                    </div>
                </div>
            }
        </div>
    );
}