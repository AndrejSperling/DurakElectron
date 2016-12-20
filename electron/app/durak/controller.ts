import {Durak} from "./durak";

export class Controller {

    protected readonly DATA_SYMBOL = "data-card-symbol";
    protected readonly DATA_VALUE = "data-card-value";
    protected readonly PLAYABLE_CARDS = "playable";
    protected doc;

    constructor(document: HTMLDocument) {
        this.doc = document;
    }
}

export class AIController extends Controller {

    private game;

    constructor(document: HTMLDocument) {
        super(document);
        this.game = new Durak("WasApBi");
    }

    init(doc: HTMLDocument) {
        let self = this;

        // init clicklistener for cards
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

}


