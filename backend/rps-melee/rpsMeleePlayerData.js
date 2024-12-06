const rpsMeleePlayerData = (nameData, opponent, matchScore=0, score=0, choiceHistory=[]) => {    
    return {
        nameData: nameData,
        score: score,
        choice: null,
        isReady: false,
        opponent: opponent,
        didWin: null,
        matchScore: matchScore,
        choiceHistory: choiceHistory,
    }
}

module.exports = {
    rpsMeleePlayerData,
};