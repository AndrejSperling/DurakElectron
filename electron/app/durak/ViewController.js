"use strict";
/// <reference types="@types/jquery" />
/// <reference types="@types/interact.js" />
var $ = require("jquery");
var Durak_1 = require("../old/Durak");
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
        this.isAttacking = false;
        ViewController.self = this;
    }
    ViewController.prototype.onLoadView = function (window, doc) {
        var _this = this;
        doc.getElementById(this.BUTTON_END_MOVE).onclick = function () {
            _this.onClickEndMove();
        };
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = function () {
            _this.onClickTakeCard();
        };
        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
        this.matchFieldView = doc.getElementById(this.MATCH_FIELD);
        var self = this;
        var startX = 0;
        var startY = 0;
        var clonedElement;
        var selectedElement;
        this.matchField = $('#matchField');
        this.matchFields = $('#matchField .match');
        // onLoadView clicklistener for cards
        var startPos;
        interact('.playable').draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: ".match",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            onstart: function (event) {
                event.target.dropped = false;
            },
            // enable autoScroll
            autoScroll: false,
            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {
                if (event.target.dropped != true) {
                    $(event.target)
                        .removeAttr('data-x')
                        .removeAttr('data-y')
                        .css("transform", "");
                }
            }
        });
        this.setIsAttacking();
        interact('.matchable').dropzone({
            accept: '.playable',
            overlap: 0.01,
            // listen for drop related events:
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
                dropzoneElement.classList.add('enterdrop');
            },
            ondragleave: function (event) {
                console.log("ondragleave");
                // remove the drop feedback style
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
                dropzoneElement.classList.remove('drop-target');
                dropzoneElement.classList.remove('enterdrop');
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
                event.target.classList.remove('enterdrop');
                event.relatedTarget.dropped = true;
                var draggableElement = event.relatedTarget, dropzoneElement = event.target;
                console.log(draggableElement);
                var isMatchField = $(dropzoneElement).is("#matchField");
                if (_this.isAttacking && isMatchField) {
                    // nur karten dazulegen
                    _this.playMatch(dropzoneElement, draggableElement);
                }
                else if (!isMatchField) {
                    // nur match match
                    _this.defendMatch(dropzoneElement, draggableElement);
                }
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
    ViewController.prototype.setIsAttacking = function () {
        this.isAttacking = true;
        this.matchField.addClass('matchable');
        this.matchFields.removeClass('matchable');
    };
    ViewController.prototype.setIsDefending = function () {
        this.isAttacking = false;
        this.matchField.removeClass('matchable');
        this.matchFields.addClass('matchable');
    };
    ViewController.prototype.playMatch = function (dragzone, element) {
        var matchContainer = $('<div class="col-md-3"><div class="match ' + (this.isAttacking ? "" : "matchable") + '"></div></div>');
        $(element).removeAttr('style')
            .removeClass('playable');
        matchContainer.find('.match').prepend(element);
        $(dragzone).find('.row').append(matchContainer);
        this.attack(new Durak_1.Card(2, 3, 'C', true));
    };
    ViewController.prototype.defendMatch = function (dragzone, element) {
        $(element)
            .removeAttr('style')
            .removeClass('playable')
            .addClass('attack');
        $(dragzone)
            .append(element)
            .removeClass('matchable');
        this.attack(new Durak_1.Card(2, 3, 'C', true));
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
    ViewController.prototype.bla = function () {
        alert("Hmmm");
    };
    ViewController.prototype.renderViews = function () {
        console.log(this);
        this.bla();
        //ViewController.renderDeckOfCards();
        //ViewController.renderOwnDeck();
    };
    return ViewController;
}());
exports.ViewController = ViewController;
