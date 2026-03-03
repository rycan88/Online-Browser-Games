const countVowels = (word) => {
    let counter = 0;
    const vowels = "AEIOU";
    
    for (const letter of word.toUpperCase()) {
        if (vowels.includes(letter)) { counter += 1 };
    }
    
    return counter;
}

const allLetterTiles = {1: "JQXZV", 2: "BWYK", 3: "FMPHC", 4: "DUG", 6: "NRTSL", 8: "O", 9: "AI", 12: "E"};
const letterCounts = {}
let letterTileString = "";

Object.entries(allLetterTiles).forEach((entry) => {
    for (const char of entry[1]) {
        letterTileString += char.repeat(Number(entry[0]));
        letterCounts[char] = entry[0];
    }
});

export const randomCombo = (length) => {
    const tilePoolLength = letterTileString.length;
    while (true) {
        let newLetters = "";
        const counter = {}
        while (newLetters.length < length) {
            const num = Math.floor(Math.random() * tilePoolLength);
            const letter = letterTileString[num];
            if (!counter[letter]) { counter[letter] = 0; }
            
            if (counter[letter] >= letterCounts[letter]) {
                continue;
            }

            counter[letter] += 1; 
            newLetters += letterTileString[num];
        }
        if (countVowels(newLetters) >= 5 && countVowels(newLetters) <= 11) {
            return newLetters
        }
    }
}
