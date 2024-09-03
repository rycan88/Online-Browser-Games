import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import '../../css/Telepath.css';
import getSocket from "../../socket";

const socket = getSocket();

//props
// firstReady: bool
// secondReady: bool
// player1: string
// player2: string
// teamNum: Int
// totalScore: Int
// addedScore: Int
// showAdded: bool

export const TelepathTeamScores = (props) => {
    const showAdded = props.showAdded;

    const ReadyStatusIcon = (isReady) => {
        return isReady ? <FaCheck className="icons text-green-400"/> : <AiOutlineLoading3Quarters className="icons animate-spin text-red-600"/>;
    }

    const clickAction = () => {
        if (showAdded) { 
            props.setMainUser(props.player1);
        }
    }

    const shortenedName = (name) => {
        return name === socket.id ? "You" : name.slice(0, 10)
    }

    return (
        <div className={`teamScores ${showAdded && "hover:bg-slate-800/40 cursor-pointer"}`} onClick={clickAction}>
            <div className="flex w-full">
                <div className="flex flex-col place-content-around items-start h-full gap-2">
                    <div className="playerNameContainer">
                        { ReadyStatusIcon(props.firstReady) }
                        <h3>{shortenedName(props.player1)}</h3>
                    </div>
                    <div className="playerNameContainer">
                        { ReadyStatusIcon(props.secondReady) }
                        <h3>{shortenedName(props.player2)}</h3>
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