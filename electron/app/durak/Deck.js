"use strict";
const Suit_1 = require("./Suit");
class Deck {
    constructor() {
        this.deck = [];
        this.trump = Suit_1.Suit.HEART;
    }
    addCards(cards) {
        this.deck = cards;
        this.setTrump();
    }
    takeCard() {
        return this.deck.shift();
    }
    takeCards(quantity) {
        let takenCards = [];
        if (!this.isEmpty()) {
            for (let i = 0; i < quantity || this.isEmpty(); i++) {
                takenCards.push(this.takeCard());
            }
        }
        return takenCards;
    }
    getTrump() {
        return this.trump;
    }
    setTrump() {
        if (!this.isEmpty()) {
            this.trump = this.deck[this.getDeckSize() - 1].suit;
        }
    }
    getDeckSize() {
        return this.deck.length;
    }
    isEmpty() {
        return this.getDeckSize() == 0;
    }
}
exports.Deck = Deck;
