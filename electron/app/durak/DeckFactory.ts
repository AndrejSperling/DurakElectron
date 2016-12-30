import {Deck} from "./Deck";
import {Card} from "./Card";
import {Suit} from "./Suit";
export class DeckFactory {

    private static readonly MIN_VALUE = 6;
    private static readonly MAX_VALUE = 14;

    static generateDeck(): Deck {

        let cards: Array<Card> = this.generateSimpleCards();
        cards = this.shuffleCards(cards);

        let deck = new Deck();
        deck.addCards(cards);

        return deck;
    }

    private static generateSimpleCards(): Array<Card> {

        let deck: Array<Card> = [];

        for (let suit in Suit) {

            for (let value = this.MIN_VALUE; value < this.MAX_VALUE; value++) {
                if (typeof suit === 'string') {
                    deck.push(new Card(value, Suit["" + suit]));
                }
            }

        }

        return deck;

    }

    private static shuffleCards(cards: Array<Card>): Array<Card> {

        let counter = cards.length;

        while (counter > 0) {

            let randomIndex = Math.floor(Math.random() * counter);
            counter--;

            let temp = cards[counter];
            cards[counter] = cards[randomIndex];
            cards[randomIndex] = temp;
        }

        return cards;
    }

}