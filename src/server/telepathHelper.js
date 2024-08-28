
const telepathWords = require('./telepathWords').telepathWords;

const generateNewWord = () => {    
    return telepathWords[Math.floor(Math.random() * telepathWords.length)].toUpperCase();
}

const generateWordLimit = () => {
    return Math.floor(Math.random() * 5) + 5;
}

module.exports = {
    generateNewWord,
    generateWordLimit,
};