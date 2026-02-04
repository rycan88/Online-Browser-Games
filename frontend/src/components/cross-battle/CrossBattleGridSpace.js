import { BsStarFill } from "react-icons/bs";

export const CrossBattleGridSpace = ({tileSize, isMiddle}) => {
    return (
        <div className={`flex items-center justify-center bg-gradient-to-br ${isMiddle ? "from-slate-100 to-slate-200" : "from-slate-200 to-slate-400"} shadow-lg text-black  border-slate-700 border rounded-[10%]`} 
             style={{height: tileSize, width: tileSize, fontSize: tileSize / 1.5}}
        >
            {isMiddle && <BsStarFill />}
        </div>
    )
}