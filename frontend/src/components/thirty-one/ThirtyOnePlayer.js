import { IoIosHeart } from "react-icons/io";

export const ThirtyOnePlayer = ({name, lives, isTurn}) => {
    return (
        <div className="flex flex-col h-[75px] w-[150px] bg-slate-500/30 text-white justify-center rounded-lg border-slate-400/50 border-[1px]">
            <h2 className={`${isTurn && "text-yellow-300"}`}>{name}</h2>
            <div className="flex items-center justify-center gap-[2px]">
                <IoIosHeart/>
                {lives}
            </div>
        </div>
    );

}