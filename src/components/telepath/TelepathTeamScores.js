import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import '../../css/Telepath.css';

//props
// firstReady: bool
// secondReady: bool
// player1: string
// player2: string
// teamNum: Int

export const TelepathTeamScores = (props) => {
    const ReadyStatusIcon = (isReady) => {
        return isReady ? <FaCheck className="h-full ml-4 mt-[2px] text-green-400"/> : <AiOutlineLoading3Quarters className="h-full ml-4 mt-[2px] animate-spin text-red-600"/>;
    }

    return (
        <div className="w-full h-[25%] p-4 bg-slate-900/30 mb-1 rounded-2xl">
            <h2 className="text-3xl">Team {props.teamNum}</h2>
            <div className="flex w-full h-[75%]">
                <div className="flex flex-col place-content-around items-start pl-4 w-[60%] h-full">
                    <div className="flex w-full h-[50%] items-center">
                        <h2 className="text-xl">{props.player1}</h2>
                        { ReadyStatusIcon(props.firstReady) }
                    </div>
                    <div className="flex w-full h-[50%] items-center">
                        <h2 className="text-xl">{props.player2}</h2>
                        { ReadyStatusIcon(props.secondReady) }
                    </div>
                </div>
                <h2 className="text-3xl w-[40%] h-full place-content-center items-center">10</h2>
            </div>
        </div>
    );

}