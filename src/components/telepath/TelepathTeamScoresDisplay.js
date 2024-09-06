import { TelepathTeamScores } from "./TelepathTeamScores";
import getSocket from "../../socket";

const socket = getSocket();

//props
// playersData: 
// shouldShowResults: bool
// setMainUsers: function

export const TelepathTeamScoresDisplay = (props) => {
    const playersData = props.playersData;
    const shouldShowResults = props.shouldShowResults;
    const setMainUser = props.setMainUser;

    console.log("display");
    return Object.values(playersData).map((userData, index) => {
        if (index % 2 === 1) {
            return <></>;
        }
        console.log("hi", userData)
        const partner = userData.partner.userId;
        const p1 = userData;
        const p2 = playersData[partner];
        const ready1 = shouldShowResults ? p1.isReady : p1.hasPickedWords;
        const ready2 = shouldShowResults ? p2.isReady : p2.hasPickedWords;
        const totalScore = userData.totalScore;
        const addedScore = userData.addedScore;
        console.log(partner, "YES")
        // Always display yourself first on the team
        return partner === socket.id 
            ?
            <TelepathTeamScores key={index}
                                teamNum={index / 2 + 1} 
                                player1={p2} 
                                player2={p1} 
                                firstReady={ready2} 
                                secondReady={ready1}
                                totalScore={totalScore}
                                addedScore={addedScore}
                                showAdded={shouldShowResults}
                                setMainUser={setMainUser}
                                
             />
             :
            <TelepathTeamScores key={index}
                                teamNum={index / 2 + 1} 
                                player1={p1} 
                                player2={p2} 
                                firstReady={ready1} 
                                secondReady={ready2}
                                totalScore={totalScore}
                                addedScore={addedScore}
                                showAdded={shouldShowResults}
                                setMainUser={setMainUser}
        />;
    })
}