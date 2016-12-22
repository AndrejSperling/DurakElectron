/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />
/// <reference types="@types/interact.js" />
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
        this.MATCH_FIELD = "matchField";
        this.BUTTON_END_MOVE = "endMove";
        this.BUTTON_TAKE_CARD = "takeCard";
        this.SHOW_MAX_CARDS = 5;
        this._cardsOnDeck = 0;
        ViewController.self = this;
    }
    ViewController.prototype.onLoadView = function (window, doc) {
        doc.getElementById(this.BUTTON_END_MOVE).onclick = this.onClickEndMove;
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = this.onClickTakeCard;
        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
        this.matchFieldView = doc.getElementById(this.MATCH_FIELD);
    };
    Object.defineProperty(ViewController.prototype, "cardsOnDeck", {
        get: function () {
            return this._cardsOnDeck;
        },
        set: function (cards) {
            this._cardsOnDeck = cards;
        },
        enumerable: true,
        configurable: true
    });
    ViewController.prototype.generateCardsView = function (parent, numberOfCards) {
        var positionStep = 2;
        var showCards = (numberOfCards > this.SHOW_MAX_CARDS) ? this.SHOW_MAX_CARDS : numberOfCards;
        console.log(parent);
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
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
    ViewController.renderDeckOfCards = function () {
        var self = ViewController.self;
        self.generateCardsView(self.deckOfCardsView, self._cardsOnDeck);
    };
    ViewController.renderOwnDeck = function () {
    };
    ViewController.prototype.renderViews = function () {
        ViewController.renderDeckOfCards();
        ViewController.renderOwnDeck();
    };
    return ViewController;
}());
exports.ViewController = ViewController;
var CardEvents = (function () {
    function CardEvents() {
    }
    CardEvents.prototype.startEvent = function (element) {
    };
    return CardEvents;
}());
var AIViewController = (function (_super) {
    __extends(AIViewController, _super);
    function AIViewController() {
        _super.call(this);
        this.game = new durak_1.Durak("WasApBi");
        this.cardEvents = new CardEvents();
    }
    AIViewController.prototype.onLoadView = function (window, doc) {
        _super.prototype.onLoadView.call(this, window, doc);
        var self = this;
        var startX = 0;
        var startY = 0;
        var clonedElement;
        var selectedElement;
        // onLoadView clicklistener for cards
        interact('.playable').draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: ".match",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // enable autoScroll
            autoScroll: false,
            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {
                var textEl = event.target.querySelector('p');
                textEl && (textEl.textContent =
                    'moved a distance of '
                        + (Math.sqrt(event.dx * event.dx +
                            event.dy * event.dy) | 0) + 'px');
            }
        });
        interact('.match').dropzone({
            // only accept elements matching this CSS selector
            accept: '.playable',
            // Require a 75% element overlap for a drop to be possible
            overlap: 0.75,
            // listen for drop related events:
            ondropactivate: function (event) {
                console.log("ondropactivate");
                // add active dropzone feedback
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                console.log("ondragenter");
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
                //dropzoneElement.classList.add('enterdrop');
                // feedback the possibility of a drop
                dropzoneElement.classList.add('drop-target');
                draggableElement.classList.add('can-drop');
                draggableElement.textContent = 'Dragged in';
            },
            ondragleave: function (event) {
                console.log("ondragleave");
                // remove the drop feedback style
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
                dropzoneElement.classList.remove('drop-target');
                //dropzoneElement.classList.remove('enterdrop');
                draggableElement.classList.remove('can-drop');
                draggableElement.textContent = 'Dragged out';
            },
            ondropdeactivate: function (event) {
                console.log("ondropdeactivate");
                // remove active dropzone feedback
                event.target.classList.remove('drop-active');
                event.target.classList.remove('drop-target');
            },
            ondrop: function (event) {
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
            }
        });
        function dragMoveListener(event) {
            var target = event.target, 
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx, y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';
            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    };
    AIViewController.prototype.newMatch = function (element) {
        alert("newMatch");
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
        this.renderViews();
    };
    AIViewController.prototype.onClickEndMove = function () {
        this.cardsOnDeck = 5;
    };
    return AIViewController;
}(ViewController));
exports.AIViewController = AIViewController;
