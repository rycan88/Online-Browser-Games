import { useEffect, useRef } from "react";
import { HanabiCard, hanabiSuitColours, hanabiSuitIcons } from "./HanabiCard";

export const HanabiHistoryLog = ({history, playersData}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [history]);

    const lastIndex = history.length - 1;
    return (
        <div className="flex flex-col gap-[10px] -mt-[15px] w-full h-full items-center justify-center">
            <div>History Log</div>
            <div className="border-slate-400 border-[2px] w-[80%] h-[80%]">

                <div ref={containerRef} 
                    className="flex-col h-full overflow-y-scroll">
                    {
                        history.map((action, index) => {
                            let message = <></>;
                            let backgroundColor = "bg-sky-600/60";
                            if (action.type === "start") {
                                message = <div>Game has begun</div>
                            } else if (action.type === "clue") {
                                const senderName = playersData[action.sender].nameData.nickname;
                                const receiverName = playersData[action.receiver].nameData.nickname;
                                const chosenClue = action.chosenClue;
                                const isColorClue = Object.keys(hanabiSuitColours).includes(chosenClue);

                                message = (
                                    <div className="flex gap-[10px] justify-center items-center">
                                        <div className="flex justify-start items-center w-[80%]"> 
                                            {`${senderName} clued ${receiverName}: `}
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <div className={`hanabiClueButton text-black text-[35px] w-[56px] h-[56px]`}
                                                style={{color: isColorClue && hanabiSuitColours[chosenClue]}}
                                            >
                                                {isColorClue ? hanabiSuitIcons[chosenClue] : chosenClue}
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else if (action.type === "discard") {
                                backgroundColor = "bg-yellow-500/60"
                                const player = playersData[action.player].nameData.nickname;
                                const card = action.card;
                                message = (
                                    <div className="flex gap-[10px] items-center w-full">
                                        <div className="flex justify-start items-center w-[80%]"> 
                                            {`${player} discarded: `} 
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <HanabiCard number={card.number}
                                                        suit={card.suit}
                                                        width={40}
                                            />
                                        </div>
                                    </div>
                                )
                            } else if (action.type === "play") {

                                const player = playersData[action.player].nameData.nickname;
                                const card = action.card;
                                const isSuccessful = action.isSuccessful;
                                backgroundColor = isSuccessful ? "bg-green-500/60" : "bg-red-500/60"
                                message = (
                                    <div className="flex gap-[10px] justify-around items-center">
                                        <div className="flex justify-start items-center w-[80%]">
                                            {isSuccessful ? `${player} successfully played: ` : `${player} failed to play: `}
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <HanabiCard number={card.number}
                                                        suit={card.suit}
                                                        width={40}
                                            />
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div className={`w-full border-b-slate-400 border-b-[2px] py-[10px] pl-[60px] pr-[40px] ${backgroundColor} ${index !== lastIndex && "opacity-70"} hover:opacity-100`}>
                                    {message}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

        </div>

    );

}