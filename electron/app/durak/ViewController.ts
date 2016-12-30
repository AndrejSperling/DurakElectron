/// <reference types="@types/jquery" />
/// <reference types="@types/interact.js" />
import * as $ from "jquery";
import {Card} from "../old/Durak";

export abstract class ViewController {

    private static self;
    protected readonly DATA_SYMBOL = "data-card-symbol";
    protected readonly DATA_VALUE = "data-card-value";
    protected readonly PLAYABLE_CARDS = "playable";

    protected readonly PLAYER_VIEW_CONTAINER = "";
    protected readonly PLAYER_VIEW_AVATAR = "";
    protected readonly PLAYER_VIEW_CARDS = "";
    protected readonly DECK_OF_CARDS = "deckOfCards";
    protected readonly MATCH_FIELD = "matchField";

    protected readonly BUTTON_END_MOVE = "endMove";
    protected readonly BUTTON_TAKE_CARD = "takeCard";


    protected playerViews: Array<HTMLDivElement>;

    private readonly SHOW_MAX_CARDS = 5;
    private _cardsOnDeck: number = 0;

    private isAttacking = false;


    protected deckOfCardsView: HTMLElement;
    protected matchFieldView: HTMLElement;

    protected matchField;
    protected matchFields;

    constructor() {
        ViewController.self = this;
    }

    onLoadView(window: Window, doc: HTMLDocument): void {

        doc.getElementById(this.BUTTON_END_MOVE).onclick = () => {
            this.onClickEndMove()
        };
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = () => {
            this.onClickTakeCard()
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
                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
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
                        .css("transform", "")
                }

            }
        });
        this.setIsAttacking()
        interact('.matchable').dropzone({
            accept: '.playable',
            overlap: 0.01,

            // listen for drop related events:

            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: (event) => {
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;

                dropzoneElement.classList.add('enterdrop');
            },
            ondragleave: function (event) {
                console.log("ondragleave");
                // remove the drop feedback style
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;

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
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;

                console.log(draggableElement);

                let isMatchField = $(dropzoneElement).is("#matchField");

                if (this.isAttacking && isMatchField) {
                    // nur karten dazulegen
                    this.playMatch(dropzoneElement, draggableElement)
                } else if (!isMatchField) {
                    // nur match match
                    this.defendMatch(dropzoneElement, draggableElement)
                }
            }
        });

        function dragMoveListener(event) {
            let target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

    }

    setIsAttacking() {
        this.isAttacking = true;
        this.matchField.addClass('matchable');
        this.matchFields.removeClass('matchable');
    }

    setIsDefending() {
        this.isAttacking = false;
        this.matchField.removeClass('matchable');
        this.matchFields.addClass('matchable');
    }

    private playMatch(dragzone, element) {

        let matchContainer = $('<div class="col-md-3"><div class="match ' + (this.isAttacking ? "" : "matchable") + '"></div></div>');

        $(element).removeAttr('style')
            .removeClass('playable');

        matchContainer.find('.match').prepend(element);
        $(dragzone).find('.row').append(matchContainer)

        this.attack(new Card(2, 3, 'C', true))
    }

    private defendMatch(dragzone, element) {

        $(element)
            .removeAttr('style')
            .removeClass('playable')
            .addClass('attack');

        $(dragzone)
            .append(element)
            .removeClass('matchable');

        this.attack(new Card(2, 3, 'C', true))

    }

    get cardsOnDeck(): number {
        return this._cardsOnDeck;
    }

    set cardsOnDeck(cards: number) {
        this._cardsOnDeck = cards;
    }

    private generateCardsView(parent: HTMLElement, numberOfCards: number) {
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

    private static renderDeckOfCards() {
        let self = ViewController.self;
        self.generateCardsView(
            self.deckOfCardsView,
            self._cardsOnDeck
        );
    }

    private static renderOwnDeck() {

    }

    private bla() {
        alert("Hmmm")
    }

    renderViews() {
        console.log(this);
        this.bla();
        //ViewController.renderDeckOfCards();
        //ViewController.renderOwnDeck();
    }

    abstract onClickTakeCard()

    abstract onClickEndMove()

    abstract attack(card: Card)

    abstract defend(toDefend: Card, defendWith: Card)

}