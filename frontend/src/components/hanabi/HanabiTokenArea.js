import { DraggableItem } from "./DraggableItem"
import { HanabiClueToken } from "./HanabiClueToken"

export const HanabiTokenArea = ({tokenSize=50, tokenCount}) => {

    return (
        <div className="relative flex flex-wrap items-center justify-center px-5 gap-[50px] mx-[3.75vw] -mt-[10px] mb-[10px] w-[25vw] h-[50%]">
             {
                [...Array(Number(tokenCount))].map((_, index) => {
                    return (
                        <DraggableItem id={"Token"+index} type="token">
                            <HanabiClueToken size={tokenSize} />
                        </DraggableItem>
                    ) 
                })
            }
        </div>
    )

}