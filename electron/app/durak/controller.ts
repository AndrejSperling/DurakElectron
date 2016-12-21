import {Durak} from "./durak";
import * as $ from "jquery";

export abstract class ViewController {

    protected readonly DATA_SYMBOL = "data-card-symbol";
    protected readonly DATA_VALUE = "data-card-value";
    protected readonly PLAYABLE_CARDS = "playable";

    protected readonly PLAYER_VIEW_CONTAINER = "";
    protected readonly PLAYER_VIEW_AVATAR = "";
    protected readonly PLAYER_VIEW_CARDS = "";
    protected readonly DECK_OF_CARDS = "deckOfCards";

    protected readonly BUTTON_END_MOVE = "endMove";
    protected readonly BUTTON_TAKE_CARD = "takeCard";


    protected playerViews: Array<HTMLDivElement>;

    private readonly SHOW_MAX_CARDS = 5;
    protected deckOfCardsView: HTMLElement;
    private _cardsOnDeck: number = 0;

    constructor() {
    }

    onLoadView(doc: HTMLDocument) {

        doc.getElementById(this.BUTTON_END_MOVE).onclick = this.onClickEndMove;
        doc.getElementById(this.BUTTON_TAKE_CARD).onclick = this.onClickTakeCard;

        this.deckOfCardsView = doc.getElementById(this.DECK_OF_CARDS);
    }

    abstract onClickEndMove()

    abstract onClickTakeCard()

    get cardsOnDeck(): number {
        return this._cardsOnDeck;
    }

    set cardsOnDeck(cards: number) {
        console.log("CardsOnDeck")
        this._cardsOnDeck = cards;
    }

    generateCardsView(parent: HTMLElement, numberOfCards: number) {
        let positionStep = 2;
        let showCards = (numberOfCards > this.SHOW_MAX_CARDS) ? this.SHOW_MAX_CARDS : numberOfCards;
        parent.innerHTML = "";

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

    protected renderViews(){
        this.generateCardsView(this.deckOfCardsView, this._cardsOnDeck);
    }
}

export class AIViewController extends ViewController {

    private game;

    constructor() {
        super();
        this.game = new Durak("WasApBi");
    }

    onLoadView(doc: HTMLDocument) {
        super.onLoadView(doc);

        let self = this;

        // onLoadView clicklistener for cards
        let playableCards = doc.getElementsByClassName(this.PLAYABLE_CARDS);
        for (let i = 0; i < playableCards.length; i++) {
            playableCards[i].addEventListener("click", function () {
                self.playCard(this);
            })
        }
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
        super.renderViews();
        super.generateCardsView(this.deckOfCardsView, 5);
    }

    onClickEndMove() {
        this.cardsOnDeck = 5;
        this.renderViews();

        super.generateCardsView(this.deckOfCardsView, 5);
    }
}


