// SPIEL
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Card = (function () {
    function Card(fv, av, s, v) {
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
    Card.prototype.toString = function () {
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
    };
    Card.prototype.isPictureCad = function () {
        if (this._faceValue >= Card.JACK && this._faceValue <= Card.KING) {
            return true;
        }
        return false;
    };
    Object.defineProperty(Card.prototype, "faceValue", {
        get: function () {
            return this._faceValue;
        },
        set: function (value) {
            this._faceValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "actualValue", {
        get: function () {
            return this._actualValue;
        },
        set: function (value) {
            this._actualValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "suit", {
        get: function () {
            return this._suit;
        },
        set: function (value) {
            this._suit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Card.JACK = 11;
    Card.QUEEN = 12;
    Card.KING = 13;
    Card.ACE = 14;
    Card.MIN = 2;
    Card.MAX = 14;
    Card.suits = ["C", "D", "H", "S"];
    return Card;
}());
var RenderedCard = (function (_super) {
    __extends(RenderedCard, _super);
    function RenderedCard(fv, s, v, hs) {
        _super.call(this, fv, fv, s, v);
        this._isHeighSuit = hs;
    }
    RenderedCard.prototype.paint = function (g) {
        if (!this.visible) {
        }
        else {
        }
    };
    RenderedCard.prototype.update = function (g) {
        this.paint(g);
    };
    Object.defineProperty(RenderedCard.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (value) {
            this._image = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderedCard.prototype, "offscreen", {
        get: function () {
            return this._offscreen;
        },
        set: function (value) {
            this._offscreen = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderedCard.prototype, "isHeighSuit", {
        get: function () {
            return this._isHeighSuit;
        },
        set: function (value) {
            this._isHeighSuit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderedCard.prototype, "dim", {
        get: function () {
            return this._dim;
        },
        set: function (value) {
            this._dim = value;
        },
        enumerable: true,
        configurable: true
    });
    return RenderedCard;
}(Card));
var CardDeck = (function () {
    function CardDeck() {
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
    CardDeck.prototype.list = function () {
        for (var x = 0; x < this._cards.length; x++) {
            console.log(this._cards[x].toString());
        }
    };
    CardDeck.prototype.deal = function () {
        var dealt = this._cards[this._top++];
        if (this._top > this._cards.length) {
            return null;
        }
        return dealt;
    };
    CardDeck.prototype.reset = function () {
        this._top = 0;
    };
    CardDeck.prototype.getNumCardsLeft = function () {
        return this._cards.length - this._top;
    };
    Object.defineProperty(CardDeck.prototype, "top", {
        get: function () {
            return this._top;
        },
        set: function (value) {
            this._top = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardDeck.prototype, "cards", {
        get: function () {
            return this._cards;
        },
        set: function (value) {
            this._cards = value;
        },
        enumerable: true,
        configurable: true
    });
    return CardDeck;
}());
var RandomCardDeck = (function (_super) {
    __extends(RandomCardDeck, _super);
    function RandomCardDeck() {
        _super.call(this);
        this.shuffle();
    }
    RandomCardDeck.prototype.shuffle = function () {
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
    };
    RandomCardDeck.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.shuffle();
    };
    return RandomCardDeck;
}(CardDeck));
var DurakDeck = (function (_super) {
    __extends(DurakDeck, _super);
    function DurakDeck() {
        _super.call(this);
        this.selectCards();
    }
    DurakDeck.prototype.selectCards = function () {
        //Filtert alle Karten mit Wert < 6 herraus
        var i = 0;
        var selected = Array(36);
        for (var c = 0; c < this.cards.length; c++) {
            if (this.cards[c].actualValue > 5) {
                selected[i++] = this.cards[c];
            }
        }
        this.cards = selected;
    };
    return DurakDeck;
}(RandomCardDeck));
var Splash = (function () {
    function Splash() {
    }
    return Splash;
}());
var Durak = (function () {
    function Durak(testV) {
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
    Durak.prototype.dealCards = function () {
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
    };
    Durak.prototype.getHighCard = function () {
        this.highCard = this.deck.cards[this.deck.cards.length - 1];
    };
    Durak.prototype.initFrame = function () {
        // FENSTER ZEICHNEN USW
    };
    Durak.prototype.checkWinningCoditions = function () {
        if (this.playerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        if (this.computerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        return false;
    };
    Durak.prototype.playerPicksUpCards = function () {
        //Schlucken
        this.playerHand = this.playerHand.concat(this.table);
        this.table = Array();
        this.refillCards(false);
        this.playersTurn = false;
    };
    Durak.prototype.refillCards = function (playerPicksUpFirst) {
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
    };
    Durak.prototype.toString = function () {
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
    };
    return Durak;
}());
module.exports = {
    Durak: Durak,
    Card: Card,
    RenderedCard: RenderedCard,
    CardDeck: CardDeck,
    RandomCardDeck: RandomCardDeck,
    DurakDeck: DurakDeck,
    Splash: Splash
};
// GUI 
