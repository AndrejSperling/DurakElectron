import {Suit} from "./Suit";
import {Card} from "./Card";

export class Deck {

    private deck: Array<Card>;
    private trump: Suit;

    constructor() {
        this.deck = []
        this.trump = Suit.HEART
    }

    addCards(cards: Array<Card>) {
        this.deck = cards;
        this.setTrump();
    }

    private takeCard(): Card {
        return this.deck.shift();
    }

    takeCards(quantity: number): Array<Card> {
        let takenCards: Array<Card> = [];
        if (!this.isEmpty()) {
            for (let i = 0; i < quantity || this.isEmpty(); i++) {
                takenCards.push(this.takeCard());
            }
        }
        return takenCards;
    }

    getTrump(): Suit {
        return this.trump
    }

    private setTrump() {
        if (!this.isEmpty()) {
            this.trump = this.deck[this.getDeckSize() - 1].suit;
        }
    }

    getDeckSize(): number {
        return this.deck.length
    }

    isEmpty(): Boolean {
        return this.getDeckSize() == 0
    }

}