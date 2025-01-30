import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { HanabiCard } from "./HanabiCard"
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import getSocket from "../../socket";
import { FaFlagCheckered, FaHourglass } from "react-icons/fa6";
import { ReadyStatusIcon } from "../ReadyStatusIcon";

const socket = getSocket();
export const HanabiSelfCards = ({selfCardIds, myData, cardWidth, isMyTurn, isFinalPlayer, gameInProgress}) => {
    const id = "selfCardsArea";
    const { setNodeRef } = useDroppable({ id })

    const cards = myData.cards;
    return (
        <SortableContext items={selfCardIds} strategy={horizontalListSortingStrategy}>
            <div ref={setNodeRef}
                 className={`flex flex-col items-center justify-center gap-[10%] w-[40%] h-[90%] border-[2px] border-slate-400 ${isMyTurn && "bg-sky-600/20"}`}
            >
                <div className={`relative flex items-center justify-center w-full -mt-[3vh] text-[1.9vh]`}>
                    <div className="flex w-[5%] justify-center items-center">
                        { isFinalPlayer &&
                            <FaFlagCheckered />
                        }
                    </div>
                    <div>{socket.nickname}</div>
                    <div className="flex w-[5%] justify-center items-center">
                        { !gameInProgress &&
                            <ReadyStatusIcon isReady={myData.isReady}/>
                        }
                    </div>
                </div>
                <div className="selfCards flex justify-center items-center"
                     style={{gap: cardWidth * 0.3}}
                >
                    {selfCardIds.map((id) => {
                        const card = cards.find((c) => `Card${c.id}` === id);
                        const hasData = card.numberVisible || card.suitVisible;
                        const number = !hasData ? "" : (card.numberVisible ? card.number : "unknown");
                        const suit = !hasData ? "" : (card.suitVisible ? card.suit : "unknown");
                        
                        return (
                            <SortableItem key={id} id={id} type={"card"}>
                                <HanabiCard number={number} 
                                        suit={suit}
                                        width={cardWidth}
                                />
                            </SortableItem>
                        );
                    })}
                </div>
            </div>

        </SortableContext>
    );
}