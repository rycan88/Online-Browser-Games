import { IoIosHeart } from "react-icons/io";
import { FaHandBackFist } from "react-icons/fa6";
import { CardJumpAnimation } from "./CardJumpAnimation";

export const ThirtyOnePlayer = ({name, lives, isTurn, didKnock, hasPicked}) => {
    const cardWidth = (window.innerHeight * 0.04);
    return (
        <div className="relative flex">
            <div className="flex flex-col h-[8vh] w-[15vh] bg-slate-500/30 text-white text-[1.8vh] justify-center rounded-[0.8vh] border-slate-400/50 border-[1px]">
                <h2 className={`${isTurn && "text-yellow-300"}`}>{name}</h2>
                <div className="flex items-center justify-center gap-[2px]">
                    <IoIosHeart/>
                    {lives}
                </div>
            </div>
            { didKnock &&
                <div className="absolute -right-[5vh] text-slate-200 text-[3vh] top-[50%] -translate-y-1/2">
                    <FaHandBackFist />
                </div>
            }
            { isTurn && 
                <div className="absolute -right-[5vh] text-slate-200 text-[3vh] top-[50%] -translate-y-1/2">
                    <CardJumpAnimation hasPicked={hasPicked} width={cardWidth}/>
                </div>
            }
        </div>
    );

}