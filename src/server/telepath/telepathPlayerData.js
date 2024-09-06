
const telepathPlayerData = (nameData, partner, totalScore) => {    
    return {
        nameData: nameData,
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