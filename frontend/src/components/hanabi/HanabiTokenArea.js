import { useMemo } from "react"
import { DraggableItem } from "./DraggableItem"
import { HanabiClueToken } from "./HanabiClueToken"

export const HanabiTokenArea = ({tokenSize=50, tokenCount}) => {
    const styles = useMemo(() => ({
        gap: tokenSize * 0.2, 
        marginTop: -tokenSize * 0.2,
        height: tokenSize,
    }), [tokenSize])

    return (
        <div className="relative flex items-center justify-center px-5 gap-[10px] mx-[3.75vw]  w-[25vw]"
             style={styles}
        
        >
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