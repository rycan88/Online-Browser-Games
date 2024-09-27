
const telepathWords = require('./telepathWords').telepathWords;

const generateNewWord = () => {    
    return telepathWords[Math.floor(Math.random() * telepathWords.length)].toUpperCase();
}

const generateWordLimit = () => {
    return Math.floor(Math.random() * 5) + 5;
}

const objectSort = (obj) => {
    return Object.entries(obj).sort((a, b) => {
        if (b[1] !== a[1] || a[1] === 0) {
            return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
    });
}

const getCombinedShared = (playersData) => {
    const combined = {}
    Object.values(playersData).forEach((userData) => {
        userData.chosenWords.forEach((word) => {
            combined[word] = (combined[word] + 1 || 0);
        });
    });

    const combinedSorted = objectSort(combined);
    return combinedSorted;
}

const calculateScores = (playersData, teamMode) => {
    if (!teamMode) {
        const combinedShared = getCombinedShared(playersData);
        const combinedSharedMap = new Map(combinedShared);
        Object.values(playersData).forEach((userData) => {
            const myWords = userData.chosenWords;
            let addedScore = 0;
            const sortedWords = {}
            myWords.forEach((word) => {
                sortedWords[word] = combinedSharedMap.get(word);
                addedScore += combinedSharedMap.get(word);
            });

            userData.addedScore = addedScore;
            userData.totalScore += addedScore;
            userData.combinedShared = combinedShared; 
            userData.sortedWords = objectSort(sortedWords);
        });
        return; 
    }
    Object.values(playersData).forEach((userData, index) => { 
        const myWords = userData.chosenWords;
        const partnerData = playersData[userData.partner.userId];
        const partnerWords = partnerData.chosenWords;
        let addedScore = 0;
        const sortedWords = {};
        myWords.forEach((word) => {
            if (partnerWords.includes(word)) {
                addedScore += 1;
                sortedWords[word] = 1;
            } else {
                sortedWords[word] = 0;               
            }
        });

        userData.addedScore = addedScore;
        userData.totalScore += addedScore;
        userData.sortedWords = objectSort(sortedWords);
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