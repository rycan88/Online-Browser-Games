import getSocket from "../../socket";
import { ReadyStatusIcon } from "../ReadyStatusIcon";

const socket = getSocket();
export const HanabiSurrenderDisplay = ({roomCode, playersDataArray, selfIndex}) => {
    const surrenderVoteCount = playersDataArray.filter((data) => data.isReady === true).length;
    if (surrenderVoteCount === 0) {
        return <></>
    }
    const playerCount = playersDataArray.length;

    const selfReady = playersDataArray[selfIndex].isReady;
    return (
        <div className={"flex flex-col text-white w-[20vh] h-[12vh] text-[1.5vh] rounded-lg shadow-xl border-[2px] border-slate-400"}>
            <div className="flex items-center justify-center h-[25%] border-b-[2px] border-slate-400">New Game?</div>
            <div className="flex items-center justify-evenly h-[37.5%] text-[2vh]">
                { 
                    [...Array(Number(playerCount))].map((_symb, index) => {
                        return <ReadyStatusIcon isReady={index < surrenderVoteCount}/>
                    })
                }
            </div>
            <div className="flex items-center justify-evenly h-[37.5%] border-t-[2px] border-slate-400">
                {!selfReady &&
                    <button className="gradientButton py-[1px] px-2"
                            onClick={() => {
                                socket.emit("hanabi_new_game_ready", roomCode);
                            }}>
                        Yes
                    </button>
                }

                <button className="redGradientButton py-[1px] px-2"
                        onClick={() => {
                            socket.emit("hanabi_reject_surrender_vote", roomCode);
                        }}
                >
                    {selfReady ? "Cancel" : "No"}
                </button>
            </div>
        </div>
    );
}