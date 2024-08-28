import { TelepathTeamScores } from "./TelepathTeamScores";

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

        const p1 = userData.username.slice(0, 10);
        const p2 = partner.slice(0,10);
        const ready1 = shouldShowResults ? userData.isReady : userData.hasPickedWords;
        const ready2 = shouldShowResults ? playersData[partner].isReady : playersData[partner].hasPickedWords;

        return <TelepathTeamScores teamNum={index / 2 + 1} 
                                   player1={p1} 
                                   player2={p2} 
                                   firstReady={ready1} 
                                   secondReady={ready2}
        />;
    })
}