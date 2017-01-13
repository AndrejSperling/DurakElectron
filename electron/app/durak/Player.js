"use strict";
const Hand_1 = require("./Hand");
class Player {
    constructor(name) {
        this._cheated = false;
        this._hasWon = false;
        this._hasLost = false;
        this.name = name;
        this.hand = new Hand_1.Hand();
    }
    addCard(card) {
        this.hand.addCard(card);
    }
    addCards(cards) {
        this.hand.addCards(cards);
    }
    removeCard(card) {
        this.hand.removeCard(card);
    }
    removeCards(cards) {
        this.hand.removeCards(cards);
    }
    cardsOnHand() {
        return this.hand.size();
    }
    get hasWon() {
        return this._hasWon;
    }
    set hasWon(value) {
        this._hasWon = value;
    }
    get hasLost() {
        return this._hasLost;
    }
    set hasLost(value) {
        this._hasLost = value;
    }
    get cheated() {
        return this._cheated;
    }
    set cheated(value) {
        this._cheated = value;
    }
    toString() {
        return "Player: " + this.name;
    }
}
exports.Player = Player;
