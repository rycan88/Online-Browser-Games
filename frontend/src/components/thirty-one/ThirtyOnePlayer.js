import { IoIosHeart } from "react-icons/io";
import { FaHandBackFist } from "react-icons/fa6";

export const ThirtyOnePlayer = ({name, lives, isTurn, didKnock}) => {
    return (
        <div className="relative flex">
            <div className="flex flex-col h-[75px] w-[150px] bg-slate-500/30 text-white justify-center rounded-lg border-slate-400/50 border-[1px]">
                <h2 className={`${isTurn && "text-yellow-300"}`}>{name}</h2>
                <div className="flex items-center justify-center gap-[2px]">
                    <IoIosHeart/>
                    {lives}
                </div>
            </div>
            { didKnock &&
                <div className="absolute -right-[50px] text-slate-200 text-4xl top-[50%] -translate-y-1/2">
                    <FaHandBackFist />
                </div>
            }
        </div>
    );

}