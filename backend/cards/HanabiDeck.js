const { Deck } = require("./Deck");

class HanabiDeck extends Deck {
    constructor(gameMode = "standard") {
        let cards = [];
        const suits = ["red", "yellow", "green", "blue", "purple"];

        if (gameMode === "extraSuit") {
            suits.push("pink");
        } if (gameMode === "rainbowSuit" || gameMode === "uniqueRainbowSuit") {
            suits.push("rainbow");
        }

        let counter = 0;
        for (let suit_i = 0; suit_i < suits.length; suit_i++) {
            const suit = suits[suit_i];
            for (let num = 1; num <= 5; num++) {
                let duplicates = num === 1 ? 3 : num === 5 ? 1 : 2;
                if (gameMode === "uniqueRainbowSuit" && suit === "rainbow") {
                    duplicates = 1;
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