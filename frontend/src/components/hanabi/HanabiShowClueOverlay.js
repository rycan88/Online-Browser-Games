import getSocket from "../../socket";
import { Overlay } from "../Overlay";
import { getVisibleCardData, HanabiCard, hanabiSuitColours, hanabiSuitIcons } from "./HanabiCard";

const socket = getSocket();
export const HanabiShowClueOverlay = ({currentClue, setCurrentClue, playersDataArray, cardWidth, isFullscreen}) => {
    const chosenClue = currentClue.chosenClue;
    const receiver = currentClue.receiver;
    const sender = currentClue.sender;

    const playerData = playersDataArray.find((data) => data.nameData.userId === receiver);

    if (!playerData) { return; }

    const userName = playerData.nameData.nickname;
    const cards = playerData.cards;
    const isColorClue = Object.keys(hanabiSuitColours).includes(chosenClue);
    const isReceiver = socket.userId === receiver;
    return (
        <Overlay isOpen={true} fullScreen={isFullscreen} onClose={()=>{ setCurrentClue(null)}}>
            <div className="flex flex-col h-full justify-center items-center text-white text-[5vh]">
                <div className="pb-[30px]">{`${sender} sent a clue to ${userName}: `}</div>
                <div className={`hanabiClueButton text-black`}
                        style={{color: isColorClue && hanabiSuitColours[chosenClue], height: cardWidth, width: cardWidth, fontSize: cardWidth * 2/3}}
                >
                    {isColorClue ? hanabiSuitIcons[chosenClue] : chosenClue}
                </div>

                <div className="flex gap-[20px] p-[10%]">
                    {
                        cards.map((card) => {
                            const isChosen = chosenClue && ([card.number, card.suit].includes(chosenClue) || (isColorClue && card.suit === "rainbow"));

                            const cardData = getVisibleCardData(card);
                            const number = cardData.number;
                            const suit = cardData.suit;
                            return(
                                <div className={`transition rounded-[4%] ${isChosen && "hanabiChosenLiftedCard"}`}>
                                    <HanabiCard number={!isReceiver ? card.number : number}
                                                suit={!isReceiver ? card.suit : suit}
                                                width={cardWidth} 
                                    />
                                </div>

                            );
                        })
                    }
                </div>

                <button className="gradientButton py-2 px-4 rounded-[5%] text-[3vh]" 
                        onClick={() => {
                            setCurrentClue(null);
                        }}
                >
                    Next
                </button>



            </div>
        </Overlay>
    )

}