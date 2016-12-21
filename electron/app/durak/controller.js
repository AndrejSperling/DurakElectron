"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var durak_1 = require("./durak");
var $ = require("jquery");
var ViewController = (function () {
    function ViewController() {
        this.DATA_SYMBOL = "data-card-symbol";
        this.DATA_VALUE = "data-card-value";
        this.PLAYABLE_CARDS = "playable";
        this.PLAYER_VIEW_CONTAINER = "";
        this.PLAYER_VIEW_AVATAR = "";
        this.PLAYER_VIEW_CARDS = "";
        this.DECK_OF_CARDS = "deckOfCards";
        this.BUTTON_END_MOVE = "endMove";
        this.BUTTON_TAKE_CARD = "takeCard";
        this.SHOW_MAX_CARDS = 5;
        this._cardsOnDeck = 0;
    }
    ViewController.prototype.onLoadView = function (doc) {
        doc.getElementById(this.BUTTON_END_MOVE).onclick = this.onClickEndMove;
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = this.onClickTakeCard;
        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
    };
    Object.defineProperty(ViewController.prototype, "cardsOnDeck", {
        get: function () {
            return this._cardsOnDeck;
        },
        set: function (cards) {
            console.log("CardsOnDeck");
            this._cardsOnDeck = cards;
        },
        enumerable: true,
        configurable: true
    });
    ViewController.prototype.generateCardsView = function (parent, numberOfCards) {
        var positionStep = 2;
        var showCards = (numberOfCards > this.SHOW_MAX_CARDS) ? this.SHOW_MAX_CARDS : numberOfCards;
        parent.innerHTML = "";
        for (var i = 0; i < showCards; i++) {
            var left = positionStep * i;
            var div = $('<div></div>')
                .addClass('card')
                .attr('style', 'left:' + left + '%');
            div.appendTo(parent);
        }
        if (numberOfCards > showCards) {
            var div = $('<div></div>')
                .addClass('more')
                .text(numberOfCards - showCards);
            div.appendTo(parent);
        }
    };
    ViewController.prototype.renderViews = function () {
        this.generateCardsView(this.deckOfCardsView, this._cardsOnDeck);
    };
    return ViewController;
}());
exports.ViewController = ViewController;
var AIViewController = (function (_super) {
    __extends(AIViewController, _super);
    function AIViewController() {
        _super.call(this);
        this.game = new durak_1.Durak("WasApBi");
    }
    AIViewController.prototype.onLoadView = function (doc) {
        _super.prototype.onLoadView.call(this, doc);
        var self = this;
        // onLoadView clicklistener for cards
        var playableCards = doc.getElementsByClassName(this.PLAYABLE_CARDS);
        for (var i = 0; i < playableCards.length; i++) {
            playableCards[i].addEventListener("click", function () {
                self.playCard(this);
            });
        }
    };
    AIViewController.prototype.playCard = function (clickedElement) {
        console.log(clickedElement);
        var symbole = clickedElement.getAttribute(this.DATA_SYMBOL);
        var value = clickedElement.getAttribute(this.DATA_VALUE);
        alert("Clicked: symbole-> " + symbole + " value->" + value);
        clickedElement.remove();
    };
    AIViewController.prototype.onClickTakeCard = function () {
        this.cardsOnDeck = 5;
        _super.prototype.renderViews.call(this);
        _super.prototype.generateCardsView.call(this, this.deckOfCardsView, 5);
    };
    AIViewController.prototype.onClickEndMove = function () {
        this.cardsOnDeck = 5;
        this.renderViews();
        _super.prototype.generateCardsView.call(this, this.deckOfCardsView, 5);
    };
    return AIViewController;
}(ViewController));
exports.AIViewController = AIViewController;
