
export const TelepathRules = () => {
    const CARD_WIDTH = Math.min((window.innerHeight * 0.05) * (2/3), (window.innerWidth * 0.5));
    return (
        <div className="myContainerCard text-[2vh]">
            <div className="myContainerCardTitle">
                Rules
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 text-start">
                <h1 className="w-full text-[1.5em] text-start pl-3 underline">Overview</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">The goal of the game is to choose the same words as your partner based on the given prompt.</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Gameplay</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div >Every round, there will be a prompt and a word limit. Each player will enter words that relate to the prompt. <br/> Tip: You can enter a word by pressing the enter button on the keyboard instead of the screen</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Scoring</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div >In team mode, gain 1 point for every word you share with a partner. In free for all, gain a point based on the frequency of the word - 1</div>                    
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Word Rules</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div>
                        This game is based on an honour system. Do not communicate about your words to your partner before the results are shown. Make sure the words are actually related to the prompt. Do not just put APPLE as a word for every single prompt.
                        You cannot enter a word that contains the prompt or that is contained in the prompt<br/>eg.
                        If the prompt is BRAINWASH then you cannot enter BRAINWASH, BRAIN, WASH, RAIN, ASH, etc.
                        Similarly, if the prompt is RAIN then you cannot enter RAIN, BRAIN, RAIN COAT, BRAINSTORM, etc.
                        <br/>
                        Words must match exactly except for singular and plural. eg. DOG and DOGS match.

                    </div>
                </div>
            </div>

        </div>


    )
}