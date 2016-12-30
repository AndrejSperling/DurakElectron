import {Suit} from "./Suit";

export class Card {
    value: number
    suit: Suit

    constructor(value: number, suit: Suit) {
        this.value = value;
        this.suit = suit;
    }
}