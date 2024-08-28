
const telepathPlayerData = (username, partner, totalScore) => {    
    return {
        username: username,
        chosenWords: [],
        hasPickedWords: false,
        isReady: false,
        partner: partner,
        totalScore: totalScore,
        addedScore: 0,
    }
}

module.exports = {
    telepathPlayerData,
};