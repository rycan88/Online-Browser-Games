import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { HanabiCard } from "./HanabiCard"
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import getSocket from "../../socket";

const socket = getSocket();
export const HanabiSelfCards = ({selfCardIds, cards, cardWidth, isMyTurn}) => {
    const id = "selfCardsArea";
    const { setNodeRef } = useDroppable({ id })

    return (
        <SortableContext items={selfCardIds} strategy={horizontalListSortingStrategy}>
            <div ref={setNodeRef}
                 className={`flex flex-col items-center justify-center w-[45%] h-[90%] border-[2px] border-slate-400`}
            >
                <div className={`relative -top-[10%] ${isMyTurn && "text-yellow-300"}`}>
                    {socket.nickname}
                </div>
                <div className="selfCards gap-[30px] flex justify-center items-center">
                    {selfCardIds.map((id) => {
                        const card = cards.find((c) => `Card${c.id}` === id);
                        return (
                            <SortableItem key={id} id={id} type={"card"}>
                                <HanabiCard number={card.number} 
                                        suit={card.suit}
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