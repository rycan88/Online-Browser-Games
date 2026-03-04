
const fs = require("fs");
const path = require("path");

let dictionary = null;

function loadScrabbleDictionary() {
    const filePath = path.join(__dirname, "../data/scrabble-words.txt");
    const text = fs.readFileSync(filePath, "utf8");

    const words = text
        .split("\n")
        .map(w => w.trim().toLowerCase());

    dictionary = new Set(words);
}

function isValidWord(word) {
    if (!dictionary) {
        throw new Error("Dictionary not loaded yet.");
    }

    return dictionary.has(word.toLowerCase());
}   

module.exports = {
    loadScrabbleDictionary,
    isValidWord,
}