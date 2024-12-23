import { HanabiCard } from "./HanabiCard";

export const HanabiPlayer = () => {
    const nameCardWidth = 75;

    return (
        <div className="flex flex-col w-[25vw] border-slate-400 border-[2px] h-[20vh]">
            <div className="flex flex-col items-center justify-center gap-[10%] h-full">
                <div className="flex items-center justify-center w-full">Rycan88</div>
                <div className="flex items-center justify-center gap-[5%] w-full">
                    <HanabiCard number={5} 
                        suit={"green"}
                        width={nameCardWidth} 
                    />                 
                    <HanabiCard number={1} 
                        suit={"yellow"}
                        width={nameCardWidth} 
                    />          
                    <HanabiCard number={3} 
                        suit={"blue"}
                        width={nameCardWidth} 
                    />         
                    <HanabiCard number={4} 
                        suit={"red"}
                        width={nameCardWidth} 
                    />           
                </div>
            </div>
        </div>
    );
}