import { InlineMath } from "react-katex"
import "katex/dist/katex.min.css"

export const CrossBattleRules = () => {    
    const pointSystem = [];
    for (let i = 2; i < 16; i++) {
        pointSystem.push([i, (i ** 2 + i - 6) / 2 ])
    }

    return (
        <div className="myContainerCard text-[2vh]">
            <div className="myContainerCardTitle">
                Rules
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 text-start">
                <h1 className="w-full text-[1.5em] text-start pl-3 underline">Overview</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">Create a connected grid of words using your 22 tiles. Longer words are worth more points. Try to use as many of your tiles as possible!</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Scoring</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">Points will be calculated based on valid words, invalid words, and unused tiles. It is considered a valid word if it is in the 2022 Collins Scrabble Dictionary. Note: Proper nouns are often not included in this dictionary and the biggest word length is 15 letters. 
                        Below are the points awarded for each valid word based on word length.
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-center my-[4vh]">
                        {pointSystem.map(([len,score]) => (
                            <div key={len} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded p-2 shadow-lg">
                            <div className="font-bold">{score} pts</div>
                            <div className=" text-slate-300">{`${len} letters`}</div>
                            </div>
                        ))}
                    </div>
                    <div className="indent">Each invalid word will lose points based on word length. Players will lose 2 points per letter in invalid words. Players will also lose a point for each letter not used. A letter is considered not used if it is not connected to the largest connected grid of words.</div>
                </div>
                <h1 className="w-full text-[1.5em] pl-3 underline">Scoring Bonus</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">If a player uses all their tiles without creating an invalid word, they will be awarded an additional 10 points! Try to use all the tiles while also creating long words to maximize your points!
                    </div>
                </div>
                <h1 className="w-full text-[1.5em] pl-3 underline">Additional Features</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">Dropping a tile onto another tile will swap the positions of the two tiles! This feature can be toggled off in the settings if it is ruining your gameplay.</div>
                </div>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">Time constraints can also be adjusted in the settings to add a sense of urgency while trying to create long words. 120 seconds would be a standard time limit.</div>
                </div>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">While looking at results, you can find a valid word checker in the settings.</div>
                </div>
            </div>

        </div>
    )
}