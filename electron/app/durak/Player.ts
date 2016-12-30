import {Hand} from "./Hand";
import {Card} from "./Card";
export class Player {

    protected name: string;
    private hand: Hand;

    private _cheated: boolean = false;
    private _hasWon: boolean = false;
    private _hasLost: boolean = false;

    constructor(name: string) {
        this.name = name
        this.hand = new Hand()
    }

    addCard(card: Card) {
        this.hand.addCard(card)
    }

    addCards(cards: Array<Card>) {
        this.hand.addCards(cards)
    }

    removeCard(card: Card) {
        this.hand.removeCard(card)
    }

    removeCards(cards: Array<Card>) {
        this.hand.removeCards(cards);
    }

    cardsOnHand(): number {
        return this.hand.size()
    }

    get hasWon(): boolean {
        return this._hasWon
    }

    set hasWon(value: boolean) {
        this._hasWon = value;
    }

    get hasLost(): boolean {
        return this._hasLost
    }

    set hasLost(value: boolean) {
        this._hasLost = value
    }

    get cheated(): boolean {
        return this._cheated;
    }

    set cheated(value) {
        this._cheated = value
    }

    toString() {

        return "Player: " + this.name;

    }

}