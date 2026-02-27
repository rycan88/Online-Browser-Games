import { useOrientation } from "../../hooks/useOrientation";
import { Overlay } from "../Overlay";
import { crossBattleScoring } from "./CrossBattleUtils";

export const CrossBattleResultsOverlay = ({validWords, invalidWords, unusedLetters, score, tileCoords, onClose, isOpen}) => {
    const orientation = useOrientation();
    const validWordsText = []
    for (let i = 15; i > 1; i--) {
        const words = validWords.filter((word) => word.length === i);
        if (words.length > 0) {
            validWordsText.push(
                <div className="flex justify-between items-center w-full">
                    <div>{`${i}-letter words (${words.length})`}</div>
                    <div className={`${i > 2 && "text-green-500"}`}>{crossBattleScoring[i] * words.length}</div>
                </div>
            )

            validWordsText.push(
                <div className={`ml-[12px] w-full text-sm ${i > 2 && "text-green-500"}`}>
                    {`[${words.join("] [")}]`}
                </div>
            )
        }
    }

    const invalidWordsText = []
    let totalInvalidLetters = 0;
    invalidWords.forEach((word) => {
        totalInvalidLetters += word.length;
    })

    invalidWordsText.push(
        <div className="flex justify-between items-center w-full">
            <div>{`Total invalid letters (${totalInvalidLetters})`}</div>
            <div className="text-red-400">{-totalInvalidLetters * 2}</div>
        </div>
    )

    invalidWordsText.push(
        <div className="ml-[12px] w-full text-sm text-red-400">
            {`[${invalidWords.join("] [")}]`}
        </div>
    )

    const gridArray = (
        tileCoords.map((coord) => {
            return (
                <div className={`flex items-center justify-center text-xs text-center ${coord.isInvalid && "text-red-400"}`}
                     style = {{gridColumnStart: coord.x + 1, gridRowStart: coord.y + 1}}
                >
                    {coord.letter}
                </div>
            )
        })
    );

    return (
        <Overlay isOpen={isOpen} onClose={onClose}>
            <div className="myContainerCard text-[2vh]">
                <div className="myContainerCardTitle">
                    Results
                </div>
                <div className="h-full w-full overflow-x-auto scrollbar-hide flex gap-2 text-start">
                    <div className={`flex ${orientation !== "landscape" && "flex-col"} justify-between w-[100%] py-[1vh] px-[2vh]`}>
                        <div className={`flex flex-col overflow-y-auto scrollbar-hide ${orientation === "landscape" ? "h-full w-[40%]": "w-full h-[55%]"} text-[16px]`}>
                            <div className="flex items-center justify-center underline text-[18px] pb-[6px]">Rycan88</div>
                            { validWords.length > 0 &&
                                <div>
                                    {validWordsText}
                                </div>
                            }

                            {   invalidWords.length > 0 &&
                                <div>
                                    {invalidWordsText}
                                </div>
                            }
                            {   unusedLetters.length === 0 ?
                                    invalidWords.length === 0 &&
                                        <div className="flex items-center justify-between">
                                            <div>All Tiles Used Bonus</div>
                                        <div>10</div>
                                </div>

                                :
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div>{`Unused letters (${unusedLetters.length})`}</div>
                                        <div className="text-red-400">-{unusedLetters.length}</div>
                                    </div>
                                    <div className="text-red-400 ml-[12px]">{unusedLetters}</div>
                                </div>
                            }
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full h-[2px] my-[6px] bg-slate-200/90"></div>
                                <div className={`flex items-center justify-between w-full`}>
                                    <div>Total</div>
                                    <div className={`${score > 0 ? "text-green-500" : "text-red-400"}`}>{score}</div>
                                </div>
                            </div>
                        </div>

                        <div className={`${orientation === "landscape" ? "w-[50%]": "h-[40%]"} aspect-square grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] border border-slate-500`}>
                            {gridArray}
                        </div>
                    </div>
                </div>

            </div>
        </Overlay>
    )
}