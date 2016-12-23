import {Durak, Card} from "./Durak";
import {ViewController} from "./ViewController";

export class GameController extends ViewController {

    private game;

    constructor() {
        super();
        this.game = new Durak("WasApBi");
    }

    onLoadView(window: Window, doc: HTMLDocument): void {
        super.onLoadView(window, doc);
    }


    onClickTakeCard() {
        super.setIsDefending()
    }

    onClickEndMove() {
        super.setIsAttacking()
    }


    attack(card: Card) {
        console.log(card);
    }

    defend(toDefend: Card, defendWith: Card) {

    }

}


