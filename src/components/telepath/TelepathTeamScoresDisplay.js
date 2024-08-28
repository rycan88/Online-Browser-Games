import { TelepathTeamScores } from "./TelepathTeamScores";
import getSocket from "../../socket";

const socket = getSocket();

//props
// playersData: 
// shouldShowResults: bool

export const TelepathTeamScoresDisplay = (props) => {
    const playersData = props.playersData;
    const shouldShowResults = props.shouldShowResults;

    return Object.values(playersData).map((userData, index) => {
        if (index % 2 === 1) {
            return <></>;
        }
        console.log(playersData);
        const partner = userData.partner;

        const p1 = socket.id === userData.username ? "You" : userData.username.slice(0, 10);
        const p2 = socket.id === partner ? "You" :partner.slice(0,10);
        const ready1 = shouldShowResults ? userData.isReady : userData.hasPickedWords;
        const ready2 = shouldShowResults ? playersData[partner].isReady : playersData[partner].hasPickedWords;
        const totalScore = userData.totalScore;
        const addedScore = userData.addedScore;

        // Always display yourself first on the team
        return partner === socket.id 
            ?
            <TelepathTeamScores teamNum={index / 2 + 1} 
                                player1={p2} 
                                player2={p1} 
                                firstReady={ready2} 
                                secondReady={ready1}
                                totalScore={totalScore}
                                addedScore={addedScore}
                                showAdded={shouldShowResults}
             />
             :
            <TelepathTeamScores teamNum={index / 2 + 1} 
                                player1={p1} 
                                player2={p2} 
                                firstReady={ready1} 
                                secondReady={ready2}
                                totalScore={totalScore}
                                addedScore={addedScore}
                                showAdded={shouldShowResults}
        />;
    })
}