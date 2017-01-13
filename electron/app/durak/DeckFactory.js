"use strict";
const Deck_1 = require("./Deck");
const Card_1 = require("./Card");
const Suit_1 = require("./Suit");
class DeckFactory {
    static generateDeck() {
        let cards = this.generateSimpleCards();
        cards = this.shuffleCards(cards);
        let deck = new Deck_1.Deck();
        deck.addCards(cards);
        return deck;
    }
    static generateSimpleCards() {
        let deck = [];
        for (let suit in Suit_1.Suit) {
            for (let value = this.MIN_VALUE; value < this.MAX_VALUE; value++) {
                if (typeof suit === 'string') {
                    deck.push(new Card_1.Card(value, Suit_1.Suit["" + suit]));
                }
            }
        }
        return deck;
    }
    static shuffleCards(cards) {
        let counter = cards.length;
        while (counter > 0) {
            let randomIndex = Math.floor(Math.random() * counter);
            counter--;
            let temp = cards[counter];
            cards[counter] = cards[randomIndex];
            cards[randomIndex] = temp;
        }
        return cards;
    }
}
DeckFactory.MIN_VALUE = 6;
DeckFactory.MAX_VALUE = 14;
exports.DeckFactory = DeckFactory;
