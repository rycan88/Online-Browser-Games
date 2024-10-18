const rpsMeleePlayerData = (nameData, opponent) => {    
    return {
        nameData: nameData,
        score: 0,
        choice: null,
        isReady: false,
        opponent: opponent,
    }
}

module.exports = {
    rpsMeleePlayerData,
};