
export const CrossBattleTile = ({tileSize, tileLetter="", opacity=1}) => {
    return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg text-black  border-slate-700 border rounded-[10%] select-none transition-all duration-[300ms] ease-in-out`} 
             style={{height: tileSize, width: tileSize, fontSize: tileSize / 1.5, opacity: opacity}}
        >
            {tileLetter}
        </div>
    )
}