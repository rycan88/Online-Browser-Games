const crossBattlePlayerData = (nameData) => {    
    return {
        nameData: nameData,
        cards: [],
        isReady: false,
        hasSubmitted: false,
        validWords: [],
        invalidWords: [],
        score: 0,
        unusedLetters: [],
        tileToSpace: {},
        coords: [],
    }
}

module.exports = {
    crossBattlePlayerData,
};