const crossBattlePlayerData = (nameData) => {    
    return {
        nameData: nameData,
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