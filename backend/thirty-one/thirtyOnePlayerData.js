
const thirtyOnePlayerData = (nameData) => {    
    return {
        nameData: nameData,
        cards: [],
        lives: 3,
        score: 0,
        gotStrike: false,
        isReady: false,
        ranking: 100
    }
}

module.exports = {
    thirtyOnePlayerData,
};