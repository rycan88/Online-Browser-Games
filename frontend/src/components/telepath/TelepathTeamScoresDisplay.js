import { TelepathTeamScores } from "./TelepathTeamScores";
import getSocket from "../../socket";

const socket = getSocket();

//props
// playersData: 
// shouldShowResults: bool
// setMainUsers: function
// teamMode: bool

export const TelepathTeamScoresDisplay = (props) => {
    const playersData = props.playersData;
    const shouldShowResults = props.shouldShowResults;
    const setMainUser = props.setMainUser;
    const teamMode = props.teamMode;

    return Object.values(playersData).map((userData, index) => {
        const totalScore = userData.totalScore;
        const addedScore = userData.addedScore;

        if (!teamMode) {
            return <TelepathTeamScores key={index}
                player1={userData} 
                totalScore={totalScore}
                addedScore={addedScore}
                showAdded={shouldShowResults}
                setMainUser={setMainUser}     
                teamMode={teamMode}                 
            />;           
        }

        if (index % 2 === 1) {
            return <></>;
        }
        
        const partner = userData.partner.userId;

        const p1 = partner === socket.userId ? playersData[partner] : userData;
        const p2 = partner === socket.userId ? userData : playersData[partner];

        // Always display yourself first on the team
        return <TelepathTeamScores key={index}
                                player1={p1} 
                                player2={p2} 
                                totalScore={totalScore}
                                addedScore={addedScore}
                                showAdded={shouldShowResults}
                                setMainUser={setMainUser}    
                                teamMode={teamMode}                  
        />;
    })
}