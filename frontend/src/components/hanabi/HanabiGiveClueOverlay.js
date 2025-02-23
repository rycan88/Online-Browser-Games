import { RiFlowerFill } from "react-icons/ri";
import { Overlay } from "../Overlay"
import { getHanabiColours, getVisibleCardData, HanabiCard, hanabiSuitColours, hanabiSuitIcons } from "./HanabiCard";
import { useState } from "react";
import getSocket from "../../socket";
import { HanabiHintVisibilityButton } from "./HanabiHintVisibilityButton";

const socket = getSocket();

export const HanabiGiveClueOverlay = ({roomCode, cluePlayer, setCluePlayer, playersDataArray, cardWidth, gameMode, isFullscreen}) => {
    const playerData = playersDataArray.find((data) => data.nameData.userId === cluePlayer);
    const [chosenClue, setChosenClue] = useState(null);
    const [showTeammateHints, setShowTeammateHints] = useState(false);

    if (!playerData) { return; }
    const userName = playerData.nameData.nickname;
    const cards = playerData.cards;

    let hanabiColours = getHanabiColours(gameMode);

    return (
        <Overlay isOpen={true} fullScreen={isFullscreen} onClose={()=>{ setCluePlayer(null)}}>
            <div className="flex flex-col h-full justify-center items-center text-white text-[5vh]">
                <div>{`Give clue to ${userName}`}</div>
                <div className="flex relative gap-[20px] p-[10%]">
                    {
                        cards.map((card) => {
                            const cardData = getVisibleCardData(card);
                            const number = cardData.number;
                            const suit = cardData.suit;

                            return(
                                <div className={`transition rounded-[4%] 
                                                 ${chosenClue && ([card.number, card.suit].includes(chosenClue) || (hanabiColours.includes(chosenClue) && card.suit === "rainbow")) 
                                                    && "hanabiChosenLiftedCard"
                                                 }
                                                `}
                                >
                                    <HanabiCard number={showTeammateHints ? number : card.number}
                                                suit={showTeammateHints ? suit : card.suit}
                                                width={cardWidth} 
                                    />
                                </div>

                            );
                        })
                    }
                    <div className="absolute -top-[1px] -right-[1px]">
                        <HanabiHintVisibilityButton showTeammateHints={showTeammateHints} setShowTeammateHints={setShowTeammateHints}/>
                    </div>
                </div>
                <div className="flex h-[18%] gap-[50px] items-center justify-center">
                    <div className="flex flex-col h-full gap-[10px] items-center justify-around">
                        <div className="flex gap-[20px] text-black text-[4vh]">
                            {
                                [...Array(Number(5))].map((_, index) => {
                                    const num = index + 1;
                                    const isChoosable = cards.some((card) => card.number === num);
                                    return (
                                        <button className={`hanabiClueButton ${chosenClue === num && "outline outline-[4px] outline-amber-500"}`}
                                                style={{height: cardWidth * 6/15, width: cardWidth * 6/15}}
                                                disabled={!isChoosable}
                                                onClick={()=> {
                                                        setChosenClue(chosenClue === num ? null : num);
                                                }}
                                        >
                                            {num}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className="flex gap-[20px] text-[4vh]">
                            {
                                hanabiColours.map((color) => {
                                    const isChoosable = cards.some((card) => (card.suit === color || card.suit === "rainbow"));
                                    return (
                                        <button className={`hanabiClueButton ${chosenClue === color && "outline outline-[4px] outline-amber-500"}`}
                                                style={{color: hanabiSuitColours[color], height: cardWidth * 6/15, width: cardWidth * 6/15}}
                                                disabled={!isChoosable}
                                                onClick={()=> {
                                                    setChosenClue(chosenClue === color ? null : color);
                                                }}
                                        >
                                            {hanabiSuitIcons[color]}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col h-full justify-around">
                        <button className="gradientButton py-2 px-4 rounded-[5%] text-[3vh]" 
                                disabled={!chosenClue}
                                onClick={() => {
                                    if (!chosenClue) { return; }
                                    socket.emit("hanabi_give_clue", roomCode, cluePlayer, chosenClue)
                                    setCluePlayer(null);
                                }}
                        >
                            Give Clue
                        </button>
                        <button className="redGradientButton py-2 px-4 rounded-[5%] text-[3vh]"
                                onClick={() => {
                                    setCluePlayer(null);
                                }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>


            </div>
        </Overlay>
    )

}