import CardOutline from "../card/CardOutline"
import { StandardCard } from "../card/StandardCard"
import { HanabiCard } from "./HanabiCard"

export const HanabiPlayPile = () => {
    const cardPile = {}
    return (
        <div className="flex w-[35%] h-full pt-[10px] border-yellow-600/80 border-[8px]">
            <div className="middleVerticalPile"> 
                <HanabiCard number={1} 
                    suit={"red"}
                    width={100} 
                />          
                <HanabiCard number={2} 
                    suit={"red"}
                    width={100} 
                />    
                <HanabiCard number={3} 
                    suit={"red"}
                    width={100} 
                />    
            </div>

            <div className="middleVerticalPile"> 
                <HanabiCard number={1} 
                        suit={"yellow"}
                        width={100} 
                    />          
                <HanabiCard number={2} 
                    suit={"yellow"}
                    width={100} 
                />    
                <HanabiCard number={3} 
                    suit={"yellow"}
                    width={100} 
                />
                <HanabiCard number={4} 
                    suit={"yellow"}
                    width={100} 
                />      
                <HanabiCard number={5} 
                    suit={"yellow"}
                    width={100} 
                />            
            </div>

            <div className="middleVerticalPile"> 
                <CardOutline width={100} borderColor="border-green-500"/>
            
            </div>

            <div className="flex flex-col -space-y-[110px] w-[20%]"> 
                <HanabiCard number={1} 
                        suit={"blue"}
                        width={100}
                />              
            </div>

            <div className="middleVerticalPile"> 
                <HanabiCard number={1} 
                        suit={"purple"}
                        width={100}
                />
                <HanabiCard number={2} 
                        suit={"purple"}
                        width={100}
                />  
            </div>
        </div>
    );
}