import getSocket from "../../socket";
import { Overlay } from "../Overlay";
import { HanabiCard, hanabiSuitColours, hanabiSuitIcons } from "./HanabiCard";

const socket = getSocket();
export const HanabiShowClueOverlay = ({currentClue, setCurrentClue, playersDataArray}) => {
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
        <Overlay isOpen={true} fullScreen={true} onClose={()=>{ setCurrentClue(null)}}>
            <div className="flex flex-col h-full justify-center items-center text-white text-[5vh]">
                <div className="pb-[30px]">{`${sender} sent a clue to ${userName}: `}</div>
                <div className={`hanabiClueButton text-black text-[100px] w-[150px] h-[150px]`}
                        style={{color: isColorClue && hanabiSuitColours[chosenClue]}}
                >
                    {isColorClue ? hanabiSuitIcons[chosenClue] : chosenClue}
                </div>

                <div className="flex gap-[20px] p-[10%]">
                    {
                        cards.map((card) => {
                            const isChosen = chosenClue && ([card.number, card.suit].includes(chosenClue));

                            const hasData = card.numberVisible || card.suitVisible;
                            const number = !hasData ? "" : (card.numberVisible ? card.number : "unknown");
                            const suit = !hasData ? "" : (card.suitVisible ? card.suit : "unknown");
                            return(
                                <div className={`transition rounded-[4%] ${isChosen && "hanabiChosenLiftedCard"}`}>
                                    <HanabiCard number={!isReceiver ? card.number : number}
                                                suit={!isReceiver ? card.suit : suit}
                                                width={150} 
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