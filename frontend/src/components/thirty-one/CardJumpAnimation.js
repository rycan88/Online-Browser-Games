import { FaHandBackFist } from "react-icons/fa6";
import CardBacking from "../card/CardBacking";
export const CardJumpAnimation = ({hasPicked, width}) => {
    return (
        <div className="animate-myBounce">
            <CardBacking width={width} num={hasPicked ? 4 : 3}/>
        </div>
    )
}