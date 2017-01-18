"use strict";
/// <reference types="@types/jquery" />
/// <reference types="@types/interact.js" />
const $ = require("jquery");
const Card_1 = require("./Card");
const Suit_1 = require("./Suit");
class ViewController {
    constructor() {
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
        this.isAttached = false;
        $(document).ready(() => {
            this.doc = document;
            this.viewReady();
        });
        ViewController.self = this;
    }
    onLoadView(window, doc) {
        this.doc = doc;
        doc.getElementById(this.BUTTON_END_MOVE).onclick = () => {
            this.onClickEndMove();
        };
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = () => {
            this.onClickTakeCard();
        };
        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
        this.matchFieldView = doc.getElementById(this.MATCH_FIELD);
        let self = this;
        let startX = 0;
        let startY = 0;
        let clonedElement;
        let selectedElement;
        this.matchField = $('#matchField');
        this.matchFields = $('#matchField .match');
        // onLoadView clicklistener for cards
        let startPos;
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
        interact('.matchable').dropzone({
            accept: '.playable',
            overlap: 0.01,
            // listen for drop related events:
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: (event) => {
                let draggableElement = event.relatedTarget, dropzoneElement = event.target;
                dropzoneElement.classList.add('enterdrop');
            },
            ondragleave: function (event) {
                console.log("ondragleave");
                // remove the drop feedback style
                let draggableElement = event.relatedTarget, dropzoneElement = event.target;
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
            ondrop: (event) => {
                event.target.classList.remove('enterdrop');
                event.relatedTarget.dropped = true;
                let draggableElement = event.relatedTarget, dropzoneElement = event.target;
                console.log(draggableElement);
                let isMatchField = $(dropzoneElement).is("#matchField");
                if (this.isAttacking && isMatchField) {
                    // nur karten dazulegen
                    this.playMatch(dropzoneElement, draggableElement);
                }
                else if (!isMatchField) {
                    // nur match match
                    this.defendMatch(dropzoneElement, draggableElement);
                }
            }
        });
        function dragMoveListener(event) {
            let target = event.target, 
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
        this.isAttached = true;
        this.setIsAttacking();
    }
    setIsAttacking() {
        if (this.isAttached) {
            this.isAttacking = true;
            this.matchField.addClass('matchable');
            this.matchFields.removeClass('matchable');
        }
    }
    setIsDefending() {
        if (this.isAttached) {
            this.isAttacking = false;
            this.matchField.removeClass('matchable');
            this.matchFields.addClass('matchable');
        }
    }
    playMatch(dragzone, element) {
        let matchContainer = $('<div class="col-md-3"><div class="match ' + (this.isAttacking ? "" : "matchable") + '"></div></div>');
        // Attacking card
        $(element)
            .addClass('attack')
            .removeAttr('style')
            .removeClass('playable');
        matchContainer.find('.match').prepend(element);
        // MatchField
        $(dragzone).find('.row').append(matchContainer);
        let symbol = $(element).data('card-symbol');
        let value = $(element).data('card-value');
        this.attack(new Card_1.Card(value, this.symbolToSuit(symbol)));
    }
    defendMatch(dragzone, element) {
        $(element)
            .removeAttr('style')
            .removeClass('playable')
            .addClass('attack');
        $(dragzone)
            .append(element)
            .removeClass('matchable');
        let attackCard = $(dragzone).find(".attack");
        let attackCardValue = attackCard.data('card-symbol');
        let attackCardSymbol = attackCard.data('card-value');
        let attack = new Card_1.Card(attackCardValue, this.symbolToSuit(attackCardSymbol));
        let value = $(element).data('card-value');
        let symbol = $(element).data('card-symbol');
        let defend = new Card_1.Card(value, this.symbolToSuit(symbol));
        this.defend(attack, defend);
    }
    symbolToSuit(symbolNumber) {
        switch (symbolNumber) {
            case 1:
                return Suit_1.Suit.HEART;
            case 2:
                return Suit_1.Suit.DIAMOND;
            case 3:
                return Suit_1.Suit.CLUB;
            case 4:
                return Suit_1.Suit.SPADES;
        }
    }
    get cardsOnDeck() {
        return this._cardsOnDeck;
    }
    set cardsOnDeck(cards) {
        this._cardsOnDeck = cards;
    }
    generateCardsView(parent, numberOfCards) {
        let positionStep = 2;
        let showCards = (numberOfCards > this.SHOW_MAX_CARDS) ? this.SHOW_MAX_CARDS : numberOfCards;
        console.log(parent);
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        for (let i = 0; i < showCards; i++) {
            let left = positionStep * i;
            let div = $('<div></div>')
                .addClass('card')
                .attr('style', 'left:' + left + '%');
            div.appendTo(parent);
        }
        if (numberOfCards > showCards) {
            let div = $('<div></div>')
                .addClass('more')
                .text(numberOfCards - showCards);
            div.appendTo(parent);
        }
    }
    static renderDeckOfCards() {
        let self = ViewController.self;
        self.generateCardsView(self.deckOfCardsView, self._cardsOnDeck);
    }
    static renderOwnDeck() {
    }
    renderViews() {
        console.log(this);
        //ViewController.renderDeckOfCards();
        //ViewController.renderOwnDeck();
    }
    setName(name) {
        $("#myName").html(name);
    }
    log(title, msg) {
        $("#jointheroom").prepend("<div><b>" + title + "</b> " + msg + "</div>");
    }
}
exports.ViewController = ViewController;
