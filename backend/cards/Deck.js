
class Deck {
    constructor(cards) {
        this.cards = cards;

        this.shuffle();
        
    }

    shuffle() {
        const cardCount = this.cards.length;
        for (let times = 0; times < 10; times++) {
            for (let i = cardCount - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }
        }
    }

    drawCard() {
        return this.cards.pop();
    }

    getCount() {
        return this.cards.length;
    }
  }

  module.exports = {
    Deck,
};