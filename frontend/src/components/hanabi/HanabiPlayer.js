import { useDroppable } from "@dnd-kit/core";
import { HanabiCard } from "./HanabiCard";

export const HanabiPlayer = ({playerData}) => {
    const id = playerData.username;
    const { active, isOver, setNodeRef } = useDroppable({ id });

    if (!playerData) { return <></> }

    const shouldHighlight = isOver && active && active.data.current.type === "token";

    const nameCardWidth = Math.min((window.innerHeight * 0.12) * (2/3), window.innerWidth * 0.04); // 75px
    const username = playerData.username;
    const cards = playerData.cards;
    return (
        <div ref={setNodeRef}
            className={`flex flex-col w-[25vw] border-slate-400 border-[2px] h-[20vh] ${shouldHighlight && "dropZoneHighlight"}`}
        >
            <div className="flex flex-col items-center justify-center gap-[10%] h-full">
                <div className="flex items-center justify-center w-full">{username}</div>
                <div className="flex items-center justify-center gap-[5%] w-full">
                    {
                        cards.map((card) => {
                            return <HanabiCard number={card.number} 
                                suit={card.suit}
                                width={nameCardWidth} 
                            />   
                        })
                    }
                </div>
            </div>
        </div>
    );
}