const { Deck } = require("./Deck");

class StandardDeck extends Deck {
    constructor() {
        let cards = [];
        const suits = ["spades", "hearts", "clubs", "diamonds"];
        for (let num = 1; num <= 13; num++) {
            for (let suit_i = 0; suit_i < 4; suit_i++) {
                cards.push({id: ((num - 1) * 4) + suit_i, number: num, suit: suits[suit_i]})
            }
        }

        super(cards);
    }
  }

  module.exports = {
    StandardDeck,
};