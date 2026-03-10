const { isValidWord } = require("../utils/dictionaryUtils");
const { crossBattlePlayerData } = require("./crossBattlePlayerData");

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

const randomCombo = (length) => {
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
   
const spaceIdToCoord = (id) => {
    const parts = id.split("-");
    
    if (parts[0] !== "gridSpace" || parts.length !== 3) { return; }

    return {x: Number(parts[1]), y: Number(parts[2])};
}

const getScoringSection = (coords) => {
    const found = new Set();
    let biggestSection = new Set();
    coords.forEach((coord) => {
        if (found.has(coord)) { return; }

        found.add(coord);
        

        const section = new Set([coord]);
        const L = [coord];
        const around = [[0, 1], [1, 0], [-1, 0], [0, -1]]; 
        while (L.length > 0) {
            const current = L.pop(0);
            around.forEach((dir) => {

                const next = coords.find((c) => c.x === current.x + dir[0] && c.y === current.y + dir[1]);

                if (!found.has(next) && next) {
                    found.add(next);
                    section.add(next);
                    L.push(next)
                }
            });
        }

        if (section.size > biggestSection.size) { biggestSection = section; }
    });

    return Array.from(biggestSection);
}

const getBounds = (points) => {
  if (points.length === 0) return null;

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const { x, y } of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return { minX, maxX, minY, maxY };
}

const sortByWordLength = (arr) => {
    arr.sort((a, b) => {
        if (a.length === b.length) { return a.localeCompare(b); }
        return b.length - a.length;
    })
}

const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

const scoreGrid = (tileToSpace, letters) => {
    let coords = [];
    for (let index = 0; index < letters.length; index++) {
        const coord = spaceIdToCoord(tileToSpace[index]);
        if (!coord) { continue; }

        coord.letter = letters[index];
        coord.index = index;
        coords.push(coord);
    }
    
    coords = getScoringSection(coords);
    
    coords.sort((a, b) => a.y - b.y || a.x - b.x);

    const foundAcross = new Set();
    const foundDown = new Set();

    let validWords = [];
    let invalidWords = [];
    let wordCoords = [];
    coords.forEach((coord) => {
        let current = coord;
        let word = "";
        wordCoords = []
        if (!foundAcross.has(current)) {
            while (current) {
                word += current.letter;
                wordCoords.push(current);
                foundAcross.add(current);

                current = coords.find((c) => c.x === current.x + 1 && c.y === current.y);
            }
        }
        
        if (isValidWord(word)) {
            validWords.push(word);
        } else if (word.length >= 2) {
            invalidWords.push(word);
            wordCoords.forEach((c) => c.isInvalid = true);
        }

        current = coord;
        word = "";
        wordCoords = [];

        if (!foundDown.has(coord)) {
            while (current) {
                word += current.letter;
                wordCoords.push(current);
                foundDown.add(current);

                current = coords.find((c) => c.x === current.x && c.y === current.y + 1);
            }
        }

        if (isValidWord(word)) {
            validWords.push(word);
        } else if (word.length >= 2) {
            invalidWords.push(word);
            wordCoords.forEach((c) => c.isInvalid = true);
        }
    });

    let score = 0;

    validWords.forEach((word) => {
        if (crossBattleScoring[word.length] !== undefined) {
            score += crossBattleScoring[word.length];
        } else {
            score += crossBattleScoring[6] + (word.length - 6) * 3;
        }
    }); 

    invalidWords.forEach((word) => {
        score -= word.length * 2;
    });

    const allNums = Array.from({length: 22}, (_, i) => i);

    const usedIndeces = new Set(coords.map((coord) => coord.index));
    const unusedLetters = allNums.filter(n => !usedIndeces.has(n)).map((i) => letters[i]);

    const notUsedCount = unusedLetters.length;
    score -= notUsedCount;

    if (coords.length === 0) {
        return {validWords, invalidWords, score, unusedLetters, coords};
    }

    if (invalidWords.length === 0 && notUsedCount === 0) {
        score += 10;
    }

    sortByWordLength(validWords);
    sortByWordLength(invalidWords);

    const {minX, maxX, minY, maxY} = getBounds(coords);
    // minX - deltaX === 22 - (min - deltaX)
    const deltaX = Math.floor((minX + maxX - 15) / 2);
    const deltaY = Math.floor((minY + maxY - 15) / 2);
    
    coords.forEach((coord) => {
        coord.x -= deltaX;
        coord.y -= deltaY;
    });
    
    return {validWords, invalidWords, score, unusedLetters, coords};
}

const crossBattleConfigurePlayersData = (rooms, roomCode) => {
    const players = rooms[roomCode].players;
    
    const playersData = {}

    const initial = {}
    for (let index = 0; index < 22; index++) {
        initial[index] = `handSpace-${String(index)}`;
    }
    
    players.forEach((player) => {
        playersData[player.userId] = crossBattlePlayerData(player); 
        playersData[player.userId].tileToSpace = initial;                  
    })     
    
    rooms[roomCode].playersData = playersData;  
}

const crossBattleConfigureGameData = (io, rooms, roomCode) => {
    const letters = randomCombo(22);
    const playerDataArray = Object.values(rooms[roomCode].playersData);
    

    rooms[roomCode].gameData = {letters: letters, shouldShowResults: false, playerDataArray: playerDataArray, timeLimit: rooms[roomCode].gameData.timeLimit ?? "10s"};
    crossBattleSetTimer(io, rooms, roomCode);
}

const timeControls = {"10s": 10, "15s": 15, "30s": 30, "45s": 45, "60s": 60, "90s": 90, "120s": 120, "180s": 180};
const crossBattleSetTimer = (io, rooms, roomCode) => {
    const gameData = rooms[roomCode].gameData;

    if (Object.keys(timeControls).includes(gameData.timeLimit)) {
        gameData.roundStartTime = Date.now() + 2000; // Gives the players 2 more second
        gameData.roundEndTime = Date.now() + (timeControls[gameData.timeLimit] + 2) * 1000;
        setTimeout(() => {
            crossBattleEndRound(io, rooms, roomCode)
            io.to(roomCode).emit("receive_all_data");
        }, (timeControls[gameData.timeLimit] + 2) * 1000);
    }
}

const crossBattleEndRound = (io, rooms, roomCode) => {
    rooms[roomCode].gameData.shouldShowResults = true;
    const playersData = rooms[roomCode].playersData;
    const gameData = rooms[roomCode].gameData;

    Object.values(playersData).map((playerData) => {
        Object.assign(playerData, 
            scoreGrid(playerData.tileToSpace, gameData.letters)
        );
    });            
}

module.exports = {
    randomCombo,
    scoreGrid,
    crossBattleScoring,
    crossBattleConfigurePlayersData,
    crossBattleConfigureGameData,
    crossBattleSetTimer,
    crossBattleEndRound,
}
