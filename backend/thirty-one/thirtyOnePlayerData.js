
const thirtyOnePlayerData = (nameData, lives=3, ranking=100) => {    
    return {
        nameData: nameData,
        cards: [],
        lives: lives,
        score: 0,
        gotStrike: false,
        isReady: false,
        didKnock: false,
        ranking: ranking
    }
}

module.exports = {
    thirtyOnePlayerData,
};