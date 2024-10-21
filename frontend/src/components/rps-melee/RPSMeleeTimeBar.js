
export const RPSMeleeTimeBar = ({percent}) => {
    return (
        <div className="flex items-end h-[60%] w-[clamp(10px,4vw,50px)] border-slate-200/80 border-[2px]">
            <div className={`h-[${percent}%] w-full bg-sky-800`}
                style={{height: `${percent}%`}}
            >

            </div>
        </div>
    )
}