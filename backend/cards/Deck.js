
class Deck {
    constructor() {
        this.cards = [];
        const suits = ["spades", "hearts", "clubs", "diamonds"];
        for (let num = 1; num <= 13; num++) {
            for (let suit_i = 0; suit_i < 4; suit_i++) {
                this.cards.push({id: ((num - 1) * 4) + suit_i, number: num, suit: suits[suit_i]})
            }
        }
        this.shuffle();
    }

    shuffle() {
        const cardCount = this.cards.length;
        for (let i = cardCount - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
          }
    }

    drawCard() {
        return this.cards.pop();
    }
  }

  module.exports = {
    Deck,
};