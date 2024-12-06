import '../../css/Telepath.css';
import getSocket from "../../socket";
import { useEffect, useState } from "react";
import { ReadyStatusIcon } from "../ReadyStatusIcon";

const socket = getSocket();

//props
// player1: all the data
// player2: all the data
// totalScore: Int
// addedScore: Int
// showAdded: bool

export const TelepathTeamScores = (props) => {
    const showAdded = props.showAdded;
    const teamMode = props.teamMode;

    const player1 = props.player1;
    const nickname1 = player1.nameData.nickname;
    const firstReady = showAdded ? player1.isReady : player1.hasPickedWords;
    const mainUser = props.mainUser;
    const setMainUser = props.setMainUser;
    const addedScore = props.addedScore;
    const totalScore = props.totalScore;

    const [displayedScore, setDisplayedScore] = useState(totalScore - addedScore);
    const [startZBounceAnimation, setStartZBounceAnimation] = useState(false);

    let nickname2 = "";
    let secondReady = null;
    if (teamMode) {
        const player2 = props.player2;
        nickname2 = player2.nameData.nickname;
        secondReady = showAdded ? player2.isReady : player2.hasPickedWords;
    }

    const clickAction = () => {
        if (showAdded) { 
            setMainUser(player1.nameData);
        }
    }

    useEffect(() => {
        setStartZBounceAnimation(false);
    }, [])

    return (
        <div className={`teamScores ${showAdded && "hover:scoresSelected cursor-pointer"} ${(showAdded && player1.nameData.userId === mainUser.userId) ? "scoresSelected" : "bg-slate-900/30 border-slate-500/50"}`} 
                onClick={clickAction}
        >
            <div className="flex h-full w-full">
                <div className="flex flex-col justify-around items-start h-full gap-2">
                    <div className="playerNameContainer">
                        <ReadyStatusIcon isReady={firstReady} />
                        <h3 className={`playerNames ${socket.userId === player1.nameData.userId && "text-yellow-300"}`}>{nickname1}</h3>
                    </div>
                    { teamMode &&
                        <div className="playerNameContainer">
                            <ReadyStatusIcon isReady={secondReady} />
                            <h3 className="playerNames">{nickname2}</h3>
                        </div>
                    }
                </div>
                <div className="scoreNumberContainer">
                    {showAdded && 
                        <h4 className="flex addedScore"> 
                            <span className="text-green-500"                                                     
                                style={{
                                    animation: `riseUpFrame 1000ms ease-out forwards`,
                                }} 
                                onAnimationEnd={ () => {
                                    setDisplayedScore(totalScore);
                                    setStartZBounceAnimation(true);
                                }}
                            >
                                +{addedScore}
                            </span>
                        </h4>
                    }
                    <h2 className={`score`}
                        style={{
                            animation: (startZBounceAnimation && addedScore > 0) && `zBounceFrame 1000ms ease-in-out forwards`,
                        }} 
                        onAnimationEnd={ () => {
                            setStartZBounceAnimation(false);
                        }}
                    >
                        {displayedScore}
                    </h2>

                </div>
            </div>
        </div>
    );

}