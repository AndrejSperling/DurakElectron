"use strict";
class Hand {
    constructor() {
        this.cards = [];
    }
    reorder(fromIndex, toIndex) {
        if (this.size() > 1) {
            let tmp = this.cards[toIndex];
            this.cards[toIndex] = this.cards[fromIndex];
            this.cards[fromIndex] = tmp;
        }
    }
    addCard(card) {
        this.cards.push(card);
    }
    addCards(cards) {
        this.cards.concat(cards);
    }
    removeCard(card) {
        let removeIndex = this.cards.indexOf(card);
        if (removeIndex > -1) {
            this.cards.splice(removeIndex, 1);
        }
    }
    removeCards(cards) {
        for (let i = 0; i < cards.length; i++) {
            this.removeCard(cards[i]);
        }
    }
    size() {
        return this.cards.length;
    }
}
exports.Hand = Hand;
