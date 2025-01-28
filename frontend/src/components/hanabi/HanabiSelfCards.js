import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { HanabiCard } from "./HanabiCard"
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import getSocket from "../../socket";
import { FaHourglass } from "react-icons/fa6";

const socket = getSocket();
export const HanabiSelfCards = ({selfCardIds, cards, cardWidth, isMyTurn}) => {
    const id = "selfCardsArea";
    const { setNodeRef } = useDroppable({ id })

    return (
        <SortableContext items={selfCardIds} strategy={horizontalListSortingStrategy}>
            <div ref={setNodeRef}
                 className={`flex flex-col items-center justify-center w-[40%] h-[90%] border-[2px] border-slate-400 ${isMyTurn && "bg-sky-600/20"}`}
            >
                <div className={`relative flex gap-[10px] items-center justify-center -top-[10%] w-full`}>
                    <div className="w-[10%]"></div>
                    <div className="">{socket.nickname}</div>
                    <div className="w-[10%]">
                        { isMyTurn &&
                            <FaHourglass className="animate-hourglassSpin"/>
                        }

                    </div>
                </div>
                <div className="selfCards gap-[30px] flex justify-center items-center">
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