
const fs = require("fs");
const path = require("path");

let dictionary = null;
let lengthSortedDictionaryArray = [];

function loadScrabbleDictionary() {
    const filePath = path.join(__dirname, "../data/scrabble-words.txt");
    const text = fs.readFileSync(filePath, "utf8");

    const words = text
        .split("\n")
        .map(w => w.trim().toUpperCase());

    dictionary = new Set(words);
    lengthSortedDictionaryArray = words.sort((a, b) => b.length - a.length);
}

function isValidWord(word) {
    if (!dictionary) {
        throw new Error("Dictionary not loaded yet.");
    }

    return dictionary.has(word.toUpperCase());
}   

const getFreq = (str) => {
    const map = {};
    for (const c of str) {
        map[c] = (map[c] || 0) + 1;
    }
    return map;
};

function getLongestWords(letters) { // Longest creatable words
    const results = [];


    const letterFreq = getFreq(letters);
    for (const word of lengthSortedDictionaryArray) {
        if (canMakeWord(word, letterFreq)) {
            results.push(word);
            if (results.length === 50) break;
        }
    }
    return results;
}

function canMakeWord(word, letterFreq) {
    const temp = { ...letterFreq };

    for (const c of word) {
        if (!temp[c]) {
            return false
        };
        temp[c]--;
    }

    return true;
}


module.exports = {
    loadScrabbleDictionary,
    isValidWord,
    getLongestWords,
}