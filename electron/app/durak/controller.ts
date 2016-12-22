/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />
/// <reference types="@types/interact.js" />

import {Durak} from "./durak";
import * as $ from "jquery";

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


    protected deckOfCardsView: HTMLElement;
    protected matchFieldView: HTMLElement;

    constructor() {
        ViewController.self = this;
    }

    onLoadView(window: Window, doc: HTMLDocument): void {

        doc.getElementById(this.BUTTON_END_MOVE).onclick = this.onClickEndMove;
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = this.onClickTakeCard;

        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
        this.matchFieldView = doc.getElementById(this.MATCH_FIELD);
    }

    abstract onClickEndMove()

    abstract onClickTakeCard()

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

    renderViews() {
        ViewController.renderDeckOfCards();
        ViewController.renderOwnDeck();
    }

}

class CardEvents {

    startEvent(element: HTMLDivElement) {


    }

}

export class AIViewController extends ViewController {

    private cardEvents;
    private game;

    constructor() {
        super();
        this.game = new Durak("WasApBi");
        this.cardEvents = new CardEvents();
    }

    onLoadView(window: Window, doc: HTMLDocument): void {
        super.onLoadView(window, doc);

        let self = this;
        let startX = 0;
        let startY = 0;
        let clonedElement;
        let selectedElement;

        // onLoadView clicklistener for cards

        interact('.playable').draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: ".match",
                endOnly: true,
                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
            },
            // enable autoScroll
            autoScroll: false,

            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {
                let textEl = event.target.querySelector('p');

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
            ondragenter: (event) => {

                console.log("ondragenter");
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;

                //dropzoneElement.classList.add('enterdrop');

                // feedback the possibility of a drop
                dropzoneElement.classList.add('drop-target');
                draggableElement.classList.add('can-drop');
                draggableElement.textContent = 'Dragged in';

            },
            ondragleave: function (event) {
                console.log("ondragleave");
                // remove the drop feedback style
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;

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
                let draggableElement = event.relatedTarget,
                    dropzoneElement = event.target;


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

    private newMatch(element) {
        alert("newMatch")
    }

    playCard(clickedElement: HTMLDivElement) {

        console.log(clickedElement);
        let symbole = clickedElement.getAttribute(this.DATA_SYMBOL);
        let value = clickedElement.getAttribute(this.DATA_VALUE);

        alert("Clicked: symbole-> " + symbole + " value->" + value);

        clickedElement.remove()
    }

    onClickTakeCard() {
        this.cardsOnDeck = 5;
        this.renderViews()
    }

    onClickEndMove() {
        this.cardsOnDeck = 5;
    }


}


