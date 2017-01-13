// SPIEL
"use strict";
var CardSuit;
(function (CardSuit) {
    CardSuit[CardSuit["KING"] = 0] = "KING";
    CardSuit[CardSuit["QUEEN"] = 1] = "QUEEN";
    CardSuit[CardSuit["JACK"] = 2] = "JACK";
    CardSuit[CardSuit["ACE"] = 3] = "ACE";
})(CardSuit = exports.CardSuit || (exports.CardSuit = {}));
class Card {
    constructor(fv, av, s, v) {
        if (fv >= Card.MIN && fv <= Card.MAX) {
            this._faceValue = fv;
        }
        else {
            this._faceValue = 2;
        }
        this._actualValue = av;
        if (s === "C" || s === "D" || s === "H" || s === "S") {
            this._suit = s;
        }
        else {
            this._suit = "C";
        }
        this._visible = v;
    }
    toString() {
        if (this._visible !== true) {
            return "??";
        }
        var face;
        if (this._faceValue >= 2 && this._faceValue <= 10) {
            face = "" + this._faceValue;
        }
        else {
            if (this._faceValue === Card.JACK) {
                face = "J";
            }
            else if (this._faceValue === Card.QUEEN) {
                face = "Q";
            }
            else if (this._faceValue === Card.KING) {
                face = "K";
            }
            else if (this._faceValue === Card.ACE) {
                face = "A";
            }
            else {
                face = "2";
            }
        }
        face = face + this._suit;
        return face;
    }
    isPictureCad() {
        if (this._faceValue >= Card.JACK && this._faceValue <= Card.KING) {
            return true;
        }
        return false;
    }
    set faceValue(value) {
        this._faceValue = value;
    }
    set actualValue(value) {
        this._actualValue = value;
    }
    set suit(value) {
        this._suit = value;
    }
    set visible(value) {
        this._visible = value;
    }
    get faceValue() {
        return this._faceValue;
    }
    get actualValue() {
        return this._actualValue;
    }
    get suit() {
        return this._suit;
    }
    get visible() {
        return this._visible;
    }
}
Card.JACK = 11;
Card.QUEEN = 12;
Card.KING = 13;
Card.ACE = 14;
Card.MIN = 2;
Card.MAX = 14;
Card.suits = ["C", "D", "H", "S"];
exports.Card = Card;
class RenderedCard extends Card {
    constructor(fv, s, v, hs) {
        super(fv, fv, s, v);
        this._isHeighSuit = hs;
    }
    paint(g) {
        if (!this.visible) {
        }
        else {
        }
    }
    update(g) {
        this.paint(g);
    }
    get image() {
        return this._image;
    }
    set image(value) {
        this._image = value;
    }
    get offscreen() {
        return this._offscreen;
    }
    set offscreen(value) {
        this._offscreen = value;
    }
    get isHeighSuit() {
        return this._isHeighSuit;
    }
    set isHeighSuit(value) {
        this._isHeighSuit = value;
    }
    get dim() {
        return this._dim;
    }
    set dim(value) {
        this._dim = value;
    }
}
exports.RenderedCard = RenderedCard;
class CardDeck {
    constructor() {
        this._top = 0;
        var numValues = Card.MAX - Card.MIN + 1;
        this._cards = Array((Card.suits.length * numValues));
        var cIndex = 0;
        //Karten erstellen und ins Deck einfügen
        for (var s = 0; s < Card.suits.length; s++) {
            for (var v = Card.MIN; v <= Card.MAX; v++) {
                cIndex = s * numValues + v - Card.MIN;
                this._cards[cIndex] = new RenderedCard(v, Card.suits[s], true, false);
            }
        }
    }
    list() {
        for (var x = 0; x < this._cards.length; x++) {
            console.log(this._cards[x].toString());
        }
    }
    deal() {
        var dealt = this._cards[this._top++];
        if (this._top > this._cards.length) {
            return null;
        }
        return dealt;
    }
    reset() {
        this._top = 0;
    }
    getNumCardsLeft() {
        return this._cards.length - this._top;
    }
    get top() {
        return this._top;
    }
    set top(value) {
        this._top = value;
    }
    get cards() {
        return this._cards;
    }
    set cards(value) {
        this._cards = value;
    }
}
exports.CardDeck = CardDeck;
class RandomCardDeck extends CardDeck {
    constructor() {
        super();
        this.shuffle();
    }
    shuffle() {
        var shuffled = Array(this.cards.length);
        var cIndex = null;
        var placed = null;
        for (var c = 0; c < this.cards.length; c++) {
            do {
                placed = false;
                cIndex = Math.floor((Math.random() * this.cards.length) + 0);
                if (shuffled[cIndex] === undefined) {
                    shuffled[cIndex] = this.cards[c];
                    placed = true;
                }
            } while (placed === false);
        }
        this.cards = shuffled.slice(0);
        this.top = 0;
    }
    reset() {
        super.reset();
        this.shuffle();
    }
}
exports.RandomCardDeck = RandomCardDeck;
class DurakDeck extends RandomCardDeck {
    constructor() {
        super();
        this.selectCards();
    }
    selectCards() {
        //Filtert alle Karten mit Wert < 6 herraus
        var i = 0;
        var selected = Array(36);
        for (var c = 0; c < this.cards.length; c++) {
            if (this.cards[c].actualValue > 5) {
                selected[i++] = this.cards[c];
            }
        }
        this.cards = selected;
    }
}
exports.DurakDeck = DurakDeck;
class Splash {
}
exports.Splash = Splash;
class Durak {
    constructor(testV) {
        this.playersTurn = true;
        this.playerHasDefended = false;
        this.endGame = false;
        this.quitGame = false;
        this.computerHand = Array();
        this.playerHand = Array();
        this.table = Array();
        this.deck = new DurakDeck();
        this.dealCards();
        this.testV = testV;
    }
    dealCards() {
        //Karten austeilen
        this.getHighCard();
        for (var c = 0; c < 6; c++) {
            this.playerHand.push(this.deck.deal());
            this.computerHand.push(this.deck.deal());
        }
        // markiere Karten einzeln als Trumpf
        this.highSuit = this.highCard.suit;
        for (var i = 0; i < this.deck.cards.length; i++) {
            var card = this.deck.cards[i];
            if (card.suit === this.highSuit) {
                this.deck.cards[i].isHeighSuit = true;
            }
        }
    }
    getHighCard() {
        this.highCard = this.deck.cards[this.deck.cards.length - 1];
    }
    initFrame() {
        // FENSTER ZEICHNEN USW
    }
    checkWinningCoditions() {
        if (this.playerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        if (this.computerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        return false;
    }
    playerPicksUpCards() {
        //Schlucken
        this.playerHand = this.playerHand.concat(this.table);
        this.table = Array();
        this.refillCards(false);
        this.playersTurn = false;
    }
    refillCards(playerPicksUpFirst) {
        //Karten den spielern nachziehen lassen um wiedr 6 karten zu haben
        this.deck.list();
        if (playerPicksUpFirst) {
            while (this.playerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.playerHand.push(this.deck.deal());
            }
            while (this.computerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.computerHand.push(this.deck.deal());
            }
        }
        else {
            while (this.computerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.computerHand.push(this.deck.deal());
            }
            while (this.playerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.playerHand.push(this.deck.deal());
            }
        }
    }
    toString() {
        var result = "";
        result += "Trumpf: " + this.highCard.toString() + "\n";
        result += "KI Hand (" + this.computerHand.length + "): \n";
        for (var t = 0; t < this.computerHand.length; t++) {
            result += this.computerHand[t].toString() + "\n";
        }
        result += "Spieler Hand (" + this.playerHand.length + "): \n";
        for (var t = 0; t < this.playerHand.length; t++) {
            result += this.playerHand[t].toString() + "\n";
        }
        result += "Tisch (" + this.table.length + "): \n";
        for (var t = 0; t < this.table.length; t++) {
            result += this.table[t].toString() + "\n";
        }
        result += "Playersturn: " + this.playersTurn + "\n";
        result += "PlayerHasDefended: " + this.playerHasDefended + "\n";
        return result;
    }
}
exports.Durak = Durak;
// GUI 
