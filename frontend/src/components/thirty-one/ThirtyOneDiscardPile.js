import { Card } from "../card/Card";
import CardOutline from "../card/CardOutline";

export const ThirtyOneDiscardPile = ({hasPicked, pickUpCard, discardPile, setDiscardPile}) => {
    const discardPileTop = discardPile.at(-1);
    return (
            <div className={`discardPile relative ${!hasPicked && "hover:cursor-pointer"}`} 
            onClick={() => {
            if (!hasPicked) {
                pickUpCard(discardPileTop);
                setDiscardPile(discardPile.slice(0, -1));
            }
            }}>
        <CardOutline/>
        {  
            discardPile.map((card, index) => {
                return (
                    <div className={`absolute ${(index === discardPile.length - 1) ? "border-[0.5px] border-black" : "border-l-[0.5px] border-b-[0.5px]"} ${(index === discardPile.length - 1 && !hasPicked) && "hover:translate-x-[4px] hover:-translate-y-[4px]"}`}
                        style={{
                            top: `-${index * 0.25}px`, // Slight Y-axis offset
                            left: `${index * 0.25}px`, // Optional: slight X offset for depth effect
                        }}
                    >
                        <Card number={card.number} suit={card.suit}/>
                    </div>
                );
            })
        }
    </div>
    );
}