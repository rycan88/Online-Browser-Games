import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaCheck } from "react-icons/fa6"

export const ReadyStatusIcon = ({isReady, greenColor="text-green-600", redColor="text-red-500"}) => {
    return isReady ? <FaCheck className={`icons ${greenColor}`}/> : <AiOutlineLoading3Quarters className={`icons animate-spin ${redColor}`}/>
}