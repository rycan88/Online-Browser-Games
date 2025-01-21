import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Card } from "../card/Card";
import { HanabiCard } from "./HanabiCard"
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";


export const HanabiSelfCards = ({selfCardIds, cards, indeces, cardWidth}) => {
    const id = "selfCardsArea";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    return (
        <SortableContext items={selfCardIds} strategy={horizontalListSortingStrategy}>
            <div ref={setNodeRef}
                 className="selfCards gap-[30px] flex justify-center items-center w-[35%] h-full"
            >
                {selfCardIds.map((id) => {
                    const index = indeces.indexOf(id);
                    const card = cards[index];
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
        </SortableContext>
    );
}