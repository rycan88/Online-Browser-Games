import { FaCheck, FaTimes} from "react-icons/fa";
import getSocket from "../../socket";
import { GoDash } from "react-icons/go";
import { InfoButton } from "../InfoButton";
import { RPSMeleeSettings } from "./RPSMeleeSettings";

const socket = getSocket();

const icons = {"rock": <div>✊</div>, "paper": <div>📃</div>, "scissors": <div>✂️</div>, null:<div>--</div>}

export const RPSMeleeResults = ({myData, opponentData, isReady, roomCode}) => {
    const choiceHistory = myData.choiceHistory;

    const myScore = myData.score;
    const opScore = opponentData.score;

    const gameResult = myScore === opScore ? "Draw" : (myScore > opScore ? "You win!" : "You lose!");

    return (
        <div className="RPSMeleePage entirePage justify-center select-none z-[0] text-slate-400">
            <InfoButton buttonStyle="absolute top-4 right-4" buttonType="settings">
                <RPSMeleeSettings roomCode={roomCode}/>
            </InfoButton>
            <div className="myContainerCard">
                <div className="myContainerCardTitle">Results</div>
                <div className="flex justify-between w-[90%] my-[1vh]">
                    <div className="w-[30%]">{myData.nameData.nickname}</div>
                    <div className="w-[40%]"></div>
                    <div className="w-[30%]">{opponentData.nameData.nickname}</div>
                </div>
                <div className="flex justify-between w-[90%] my-[0.5vh] text-[1.5em]">
                    <div className="w-[30%]">{myData.score}</div>
                    <div className="w-[40%]">{gameResult}</div>
                    <div className="w-[30%]">{opponentData.score}</div>
                </div>
                <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] py-2">
                    { choiceHistory.map((data) => {
                        console.log(data);
                        return (
                            <div className="myContainerCardInnerBox flex items-center py-2">
                                <div className="w-[30%]">{icons[data.myChoice]}</div>
                                <div className="w-[40%] flex justify-center">
                                    {data.didWin ? 
                                        <FaCheck className="text-green-500"/> 
                                    : 
                                        ( data.didWin === false ? 
                                            <FaTimes className="text-red-500"/>
                                        :  
                                            <GoDash/>
                                        )
                                    }
                                </div>
                                <div className="w-[30%]">{icons[data.opChoice]}</div>
                            </div>
                        )
                    })

                    }
                </div>
                <button className="myContainerCardBottomButton gradientButton"
                        onClick={() => {
                            socket.emit("rps_melee_ready", roomCode);
                        }}
                        disabled={isReady}
                >
                    { isReady ?
                        "Waiting for opponent..."
                        :
                        "Ready?"
                    }
                    
                </button>

            </div>
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>
    );
}