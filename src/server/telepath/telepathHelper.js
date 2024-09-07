
const telepathWords = require('./telepathWords').telepathWords;

const generateNewWord = () => {    
    return telepathWords[Math.floor(Math.random() * telepathWords.length)].toUpperCase();
}

const generateWordLimit = () => {
    return Math.floor(Math.random() * 5) + 5;
}

const calculateScores = (playersData) => {
    Object.values(playersData).forEach((userData, index) => {
        if (index % 2 === 1) { return }

        const partnerData = playersData[userData.partner.userId];
        const myWords = userData.chosenWords;
        const partnerWords = partnerData.chosenWords;

        let addedScore = 0;
        myWords.forEach((word) => {
            if (partnerWords.includes(word)) {
                addedScore += 1;
            }
        });

        userData.addedScore = addedScore;
        userData.totalScore += addedScore;
        partnerData.addedScore = addedScore;
        partnerData.totalScore += addedScore;
    })
}

const setNewPrompt = (gameData) => {
    gameData.prompt = generateNewWord()
    gameData.wordLimit = generateWordLimit()
}

module.exports = {
    generateNewWord,
    generateWordLimit,
    calculateScores,
    setNewPrompt,
};