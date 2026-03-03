import useScrabbleDictionary from "../../hooks/useScrabbleDictionary";

const isValidWord = (word, dictionary) => {
  if (!dictionary) return false;

  return dictionary.has(word.toLowerCase());
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

export const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

// x 0 1 2 3  4
// y 0 3 7 12 18

export const sortByWordLength = (arr) => {
    arr.sort((a, b) => {
        if (a.length === b.length) { return a.localeCompare(b); }
        return b.length - a.length;
    })
}

const getBounds =(points) => {
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

export const scoreGrid = (tileToSpace, letters, dictionary) => {
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
        
        if (isValidWord(word, dictionary)) {
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

        if (isValidWord(word, dictionary)) {
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

