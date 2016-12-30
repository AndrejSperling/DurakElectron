import {Card} from "./Card";
export class Hand {

    private cards: Array<Card>;

    constructor() {
        this.cards = []
    }

    reorder(fromIndex, toIndex) {
        if (this.size() > 1) {
            let tmp = this.cards[toIndex];
            this.cards[toIndex] = this.cards[fromIndex];
            this.cards[fromIndex] = tmp;
        }
    }

    addCard(card: Card) {
        this.cards.push(card);
    }

    addCards(cards: Array<Card>) {
        this.cards.concat(cards);
    }

    removeCard(card: Card) {
        let removeIndex = this.cards.indexOf(card);
        if (removeIndex > -1) {
            this.cards.splice(removeIndex, 1);
        }
    }

    removeCards(cards: Array<Card>) {
        for (let i = 0; i < cards.length; i++) {
            this.removeCard(cards[i]);
        }
    }

    size(): number {
        return this.cards.length;
    }

}