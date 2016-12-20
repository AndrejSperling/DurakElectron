import {Durak} from "./durak";

export class Controller {

    protected readonly DATA_SYMBOL = "data-card-symbol";
    protected readonly DATA_VALUE = "data-card-value";
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

    playCard(clickedElement: HTMLDivElement) {

        let symbol = clickedElement.getAttribute(this.DATA_SYMBOL);
        let value = clickedElement.getAttribute(this.DATA_VALUE);

        alert("Clicked: symbole-> " + symbol + " value->" + value);
        clickedElement.remove()
    }

}


