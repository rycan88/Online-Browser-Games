
export const CrossBattleTile = ({tileSize, tileLetter=""}) => {
    return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg text-black  border-slate-700 border rounded-[10%] select-none`} 
             style={{height: tileSize, width: tileSize, fontSize: tileSize / 1.5}}
        >
            {tileLetter}
        </div>
    )
}