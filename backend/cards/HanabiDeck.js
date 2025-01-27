const { Deck } = require("./Deck");

class HanabiDeck extends Deck {
    constructor() {
        let cards = [];
        const suits = ["red", "yellow", "green", "blue", "purple"];
        let counter = 0;
        for (let suit_i = 0; suit_i < 5; suit_i++) {
            for (let num = 1; num <= 5; num++) {
                const duplicates = num === 1 ? 3 : num === 5 ? 1 : 2;
                for (let dups = 0; dups < duplicates; dups++) { 
                        cards.push({id: counter, number: num, suit: suits[suit_i]});
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