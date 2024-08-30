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
    const ReadyStatusIcon = (isReady) => {
        return isReady ? <FaCheck className="h-full ml-4 mt-[2px] text-green-400"/> : <AiOutlineLoading3Quarters className="h-full ml-4 mt-[2px] animate-spin text-red-600"/>;
    }

    const clickAction = () => {
        if (props.showAdded) { 
            props.setMainUser(props.player1);
        }
    }

    const shortenedName = (name) => {
        return name === socket.id ? "You" : name.slice(0, 10)
    }

    return (
        <div className="teamScores" onClick={clickAction}>
            <h2>Team {props.teamNum}</h2>
            <div className="flex w-full h-[75%]">
                <div className="flex flex-col place-content-around items-start pl-4 w-[60%] h-full">
                    <div className="flex w-full h-[50%] items-center">
                        <h3>{shortenedName(props.player1)}</h3>
                        { ReadyStatusIcon(props.firstReady) }
                    </div>
                    <div className="flex w-full h-[50%] items-center">
                        <h3>{shortenedName(props.player2)}</h3>
                        { ReadyStatusIcon(props.secondReady) }
                    </div>
                </div>
                <div className="flex flex-col w-[40%] h-full place-content-center items-center -mt-1">
                    <h4 className="relative left-3 text-green-500 h-4">{props.showAdded ?`+${props.addedScore}` : ""}</h4>
                    <h2 className="-mt-2">{props.totalScore}</h2>

                </div>
            </div>
        </div>
    );

}