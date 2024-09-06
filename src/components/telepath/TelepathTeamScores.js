import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import '../../css/Telepath.css';
import getSocket from "../../socket";

const socket = getSocket();

//props
// firstReady: bool
// secondReady: bool
// player1: all the data
// player2: all the data
// teamNum: Int
// totalScore: Int
// addedScore: Int
// showAdded: bool

export const TelepathTeamScores = (props) => {
    const showAdded = props.showAdded;
    const player1 = props.player1;
    const player2 = props.player2;
    const nickname1 = player1.nameData.nickname;
    const nickname2 = player2.nameData.nickname;

    const ReadyStatusIcon = (isReady) => {
        return isReady ? <FaCheck className="icons text-green-400"/> : <AiOutlineLoading3Quarters className="icons animate-spin text-red-600"/>;
    }

    const clickAction = () => {
        if (showAdded) { 
            props.setMainUser(props.player1);
        }
    }

    return (
        <div className={`teamScores ${showAdded && "hover:bg-slate-800/40 cursor-pointer"}`} onClick={clickAction}>
            <div className="flex w-full">
                <div className="flex flex-col place-content-around items-start h-full gap-2">
                    <div className="playerNameContainer">
                        { ReadyStatusIcon(props.firstReady) }
                        <h3 className={`playerNames ${socket.userId === player1.nameData.userId && "text-yellow-300"}`}>{nickname1}</h3>
                    </div>
                    <div className="playerNameContainer">
                        { ReadyStatusIcon(props.secondReady) }
                        <h3 className="playerNames">{nickname2}</h3>
                    </div>
                </div>
                <div className="flex flex-col h-full place-content-center items-end pr-2 ml-4 mt-[0.5px]">
                    <h4 className="relative left-3 text-green-500 h-4 -mb-2">{props.showAdded ?`+${props.addedScore}` : ""}</h4>
                    <h2 className="">{props.totalScore}</h2>

                </div>
            </div>
        </div>
    );

}