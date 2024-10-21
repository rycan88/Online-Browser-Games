const rpsMeleePlayerData = (nameData, opponent, score=0, choiceHistory=[]) => {    
    return {
        nameData: nameData,
        score: score,
        choice: null,
        isReady: false,
        opponent: opponent,
        didWin: null,
        choiceHistory: choiceHistory,
    }
}

module.exports = {
    rpsMeleePlayerData,
};