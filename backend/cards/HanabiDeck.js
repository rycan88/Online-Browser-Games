const { Deck } = require("./Deck");

class HanabiDeck extends Deck {
    constructor(gameMode = {"extraSuitType": "none"}) {
        let cards = [];
        const suits = ["red", "yellow", "green", "blue", "purple"];

        if (gameMode.extraSuitType === "pink") {
            suits.push("pink");
        } else if (gameMode.extraSuitType === "rainbow") {
            suits.push("rainbow");
        } else if (gameMode.extraSuitType === "colourless") {
            suits.push("colourless");
        }

        let counter = 0;
        for (let suit_i = 0; suit_i < suits.length; suit_i++) {
            const suit = suits[suit_i];
            for (let num = 1; num <= 5; num++) {
                let duplicates = {1: 3, 5: 1}[num] ?? 2;
                if (suit === gameMode.extraSuitType) { // If it is the 6th suit
                    if (gameMode.extraSuitReversed) {
                        duplicates = {5: 3, 1: 1}[num] ?? 2;
                    }
    
                    if (gameMode.extraSuitUnique) {
                        duplicates = 1;
                    }
                }

                for (let dups = 0; dups < duplicates; dups++) { 
                        cards.push({id: counter, number: num, suit: suit});
                        counter += 1;

                }
            }
        }

        super(cards);
    }
  }

  module.exports = {
    HanabiDeck,
};