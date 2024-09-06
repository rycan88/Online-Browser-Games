
import getSocket from "../../socket";

const socket = getSocket();

// props
// roomCode: string
// teamData
export const TeamList = (props) => {
    const roomCode = props.roomCode;
    const teamData = props.teamData;
    const canStart = props.canStart;

    const joinAction = (event) => {
        const buttonId = event.target.id; 
        const index = parseInt(buttonId, 10);
        socket.emit("join_diff_team", roomCode, index);
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
                            <h2 className={`playerLabel ${socket.userId === team[0].userId && "text-sky-700"}`}>{team[0].nickname}</h2>
                            {team.length === 2 
                                ? <h2 className={`playerLabel ${socket.userId === team[1].userId && "text-sky-700"}`}>{team[1].nickname}</h2>
                                : <button className="joinButton gradientButton" 
                                            id={index + 1} 
                                            disabled={socket.userId === team[0].userId}
                                            onClick={joinAction}>Join</button>
                            }
                        </div>
                    </div>
                );
            })}
            { canStart &&
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