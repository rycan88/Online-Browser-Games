import CardOutline from "../card/CardOutline"
import { StandardCard } from "../card/StandardCard"
import { HanabiCard } from "./HanabiCard"

export const HanabiPlayPile = () => {
    const cardPile = {"red": 3, "yellow": 5, "green": 0, "blue": 1, "purple": 2}
    let cardWidth = 100
    cardWidth = Math.min((window.innerHeight * 0.16) * (2/3), window.innerWidth * 0.053);
    return (
        <div className="flex w-[35%] h-full pt-[10px] border-yellow-600/80 border-[8px]">
            {
                Object.keys(cardPile).map((colour) => {
                    const num = cardPile[colour];
                    
                    return (
                        <div className="flex flex-col -space-y-[90%] w-[20%] items-center">
                            { num === 0 ?
                                <CardOutline width={cardWidth} borderColor="border-green-500"/>
                                :
                                [...Array(Number(num))].map((_, index) => {
                                    return (
                                        <HanabiCard number={index + 1} 
                                                    suit={colour}
                                                    width={cardWidth} 
                                        />   
                                    );   
                                })
                            }  
                        </div>
                    )
                })                
            }
        </div>
    );
}