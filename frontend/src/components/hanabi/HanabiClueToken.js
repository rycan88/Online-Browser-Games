import { RiFlowerFill } from "react-icons/ri"

export const HanabiClueToken = ({size=40}) => {
    console.log(`${size * 25 / 40}px`)
    return (
        <div className="flex justify-center items-center rounded-full bg-sky-700 border-[2px] border-slate-200"
             style={{height: `${size}px`, width: `${size}px`}}
        >
            <RiFlowerFill  style={{fontSize: `${size * 25 / 40}px`}} />
        </div>
    )
}