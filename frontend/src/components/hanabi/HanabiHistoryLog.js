import { useEffect, useRef, useState } from "react";
import { HanabiCard, hanabiSuitColours, hanabiSuitIcons } from "./HanabiCard";

export const HanabiHistoryLog = ({history, playersData}) => {
    const containerRef = useRef(null);

    const [tokenSize, setTokenSizeWidth] = useState(Math.min(window.innerWidth * 0.025, 50)); // 50px
    const [cardWidth, setCardWidth] = useState(Math.min(window.innerWidth * 0.02, 40)); // 50px
    useEffect(() => {
        const handleResize = () => {
            setTokenSizeWidth(Math.min(window.innerWidth * 0.025, 50));
            setCardWidth(Math.min(window.innerWidth * 0.02, 40));
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [history]);

    return (
        <div className="flex flex-col gap-[10px] -mt-[15px] w-full h-full items-center justify-center text-[1.7vh]">
            <div>History Log</div>
            <div className="border-slate-400 border-[2px] w-[80%] h-[80%]">

                <div ref={containerRef} 
                    className="hanabi-scrollbar flex flex-col-reverse h-full overflow-y-scroll">
                    {
                        history.slice().reverse().map((action, index) => {
                            let message = <></>;
                            let backgroundColor = "bg-sky-600/60";
                            if (action.type === "start") {
                                const startPlayer = playersData[action.player].nameData.nickname;
                                message = <div>Game has begun: {startPlayer} starts</div>
                            } else if (action.type === "end") {
                                const endScore = action.points;
                                message = <div>{`Game has ended: ${endScore} ${endScore === 1 ? "flower was" : "flowers were"} collected!`}</div>
                            } else if (action.type === "clue") {
                                const senderName = playersData[action.sender].nameData.nickname;
                                const receiverName = playersData[action.receiver].nameData.nickname;
                                const chosenClue = action.chosenClue;
                                const isColorClue = Object.keys(hanabiSuitColours).includes(chosenClue);

                                message = (
                                    <div className="flex justify-center items-center">
                                        <div className="flex justify-start items-center w-[80%]"> 
                                            {`${senderName} clued to ${receiverName}: `}
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <div className={`hanabiClueButton text-black`}
                                                style={{color: isColorClue && hanabiSuitColours[chosenClue], height: tokenSize, width: tokenSize, fontSize: tokenSize * 0.7}}
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
                                    <div className="flex items-center w-full">
                                        <div className="flex justify-start items-center w-[80%]"> 
                                            {`${player} discarded: `} 
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <HanabiCard number={card.number}
                                                        suit={card.suit}
                                                        width={cardWidth}
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
                                    <div className="flex justify-around items-center">
                                        <div className="flex justify-start items-center w-[80%]">
                                            {isSuccessful ? `${player} successfully played: ` : `${player} failed to play: `}
                                        </div>
                                        <div className="flex justify-center items-center w-[20%]">
                                            <HanabiCard number={card.number}
                                                        suit={card.suit}
                                                        width={cardWidth}
                                            />
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div className={`w-full border-t-slate-400 border-t-[2px] py-[10px] pl-[60px] pr-[40px] ${backgroundColor} ${index !== 0 && "opacity-70"} hover:opacity-100`}
                                     style={{paddingLeft: tokenSize * 1.2, paddingRight: tokenSize * 0.5, paddingTop: tokenSize / 4, paddingBottom: tokenSize / 4}}
                                >
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