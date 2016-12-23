// SPIEL

export enum CardSuit{
    KING, QUEEN, JACK, ACE
}

export class Card {

    public static JACK: number = 11;
    public static QUEEN: number = 12;
    public static KING: number = 13;
    public static ACE: number = 14;
    public static MIN: number = 2;
    public static MAX: number = 14;
    public static suits: string[] = ["C", "D", "H", "S"];
    protected _faceValue: number;
    protected _actualValue: number;
    protected _suit: string;
    protected _visible: boolean;

    public constructor(fv: number, av: number, s: string, v: boolean) {
        if (fv >= Card.MIN && fv <= Card.MAX) {
            this._faceValue = fv;
        } else {
            this._faceValue = 2;
        }
        this._actualValue = av;
        if (s === "C" || s === "D" || s === "H" || s === "S") {
            this._suit = s;
        } else {
            this._suit = "C";
        }
        this._visible = v;
    }

    public toString() {
        if (this._visible !== true) {
            return "??";
        }
        var face: string;
        if (this._faceValue >= 2 && this._faceValue <= 10) {
            face = "" + this._faceValue;
        } else {
            if (this._faceValue === Card.JACK) {
                face = "J"
            } else if (this._faceValue === Card.QUEEN) {
                face = "Q"
            } else if (this._faceValue === Card.KING) {
                face = "K"
            } else if (this._faceValue === Card.ACE) {
                face = "A"
            } else {
                face = "2"
            }
        }
        face = face + this._suit;
        return face;
    }

    public isPictureCad() {
        if (this._faceValue >= Card.JACK && this._faceValue <= Card.KING) {
            return true;
        }
        return false;
    }


    set faceValue(value: number) {
        this._faceValue = value;
    }

    set actualValue(value: number) {
        this._actualValue = value;
    }

    set suit(value: string) {
        this._suit = value;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    get faceValue(): number {
        return this._faceValue;
    }

    get actualValue(): number {
        return this._actualValue;
    }

    get suit(): string {
        return this._suit;
    }

    get visible(): boolean {
        return this._visible;
    }
}

export class RenderedCard extends Card {

// KONSTRUKTOR WIRD AUFGRUND VON ÜBERLADUNG KOMISCH VERWENDET !!

    protected _image: string;
    protected _offscreen: string;
    protected _isHeighSuit: boolean;
    protected _dim: number; // X und Y Werte sollen hier gahlten werden


    constructor(fv: number, s: string, v: boolean, hs: boolean) {
        super(fv, fv, s, v);
        this._isHeighSuit = hs;
    }

    public paint(g: string) {
        if (!this.visible) {
            // male rückseite der Karte
        } else {
            // male vorderseite der Karte
            //String s = "picture_data/" + this.toString() + ".gif";
            //image = Toolkit.getDefaultToolkit().getImage(s);
            //g.drawImage(image, 0, 0, this);
        }
    }

    public update(g: string) {
        this.paint(g);
    }


    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get offscreen(): string {
        return this._offscreen;
    }

    set offscreen(value: string) {
        this._offscreen = value;
    }

    get isHeighSuit(): boolean {
        return this._isHeighSuit;
    }

    set isHeighSuit(value: boolean) {
        this._isHeighSuit = value;
    }

    get dim(): number {
        return this._dim;
    }

    set dim(value: number) {
        this._dim = value;
    }
}

export class CardDeck {
    protected _top: number;
    protected _cards: RenderedCard[];

    constructor() {
        this._top = 0;
        var numValues: number = Card.MAX - Card.MIN + 1;
        this._cards = Array((Card.suits.length * numValues));
        var cIndex: number = 0;

        //Karten erstellen und ins Deck einfügen
        for (var s = 0; s < Card.suits.length; s++) {
            for (var v = Card.MIN; v <= Card.MAX; v++) {
                cIndex = s * numValues + v - Card.MIN;
                this._cards[cIndex] = new RenderedCard(v, Card.suits[s], true, false);
            }
        }
    }

    public list() {
        for (var x = 0; x < this._cards.length; x++) {
            console.log(this._cards[x].toString());
        }
    }

    public deal() {
        var dealt = this._cards[this._top++];
        if (this._top > this._cards.length) {
            return null;
        }
        return dealt;
    }

    public reset() {
        this._top = 0;
    }

    public getNumCardsLeft() {
        return this._cards.length - this._top;
    }


    get top(): number {
        return this._top;
    }

    set top(value: number) {
        this._top = value;
    }

    get cards(): RenderedCard[] {
        return this._cards;
    }

    set cards(value: RenderedCard[]) {
        this._cards = value;
    }
}

export class RandomCardDeck extends CardDeck {
    constructor() {
        super();
        this.shuffle();
    }

    public shuffle() {
        var shuffled = Array(this.cards.length);
        var cIndex = null;
        var placed = null;
        for (var c = 0; c < this.cards.length; c++) {
            do {
                placed = false;
                cIndex = Math.floor((Math.random() * this.cards.length) + 0);
                if (shuffled[cIndex] === undefined) {
                    shuffled[cIndex] = this.cards[c];
                    placed = true;
                }
            } while (placed === false);
        }

        this.cards = shuffled.slice(0);
        this.top = 0;
    }

    public reset() {
        super.reset();
        this.shuffle();
    }

}

export class DurakDeck extends RandomCardDeck {
    constructor() {
        super();
        this.selectCards();
    }

    public selectCards() {
        //Filtert alle Karten mit Wert < 6 herraus
        var i: number = 0;
        var selected: RenderedCard[] = Array(36);
        for (var c = 0; c < this.cards.length; c++) {
            if (this.cards[c].actualValue > 5) {
                selected[i++] = this.cards[c];
            }
        }
        this.cards = selected;
    }

}

export class Splash {
    // KLasse Vermutlich zum zeichnen
}

export class Durak {
    private deck: DurakDeck;
    private computerHand: Card[];
    private playerHand: Card[];
    private table: Card[];
    private endTurnImg: Splash;
    private pickUp: Splash;
    private highSuit: string;
    private clickedCard: RenderedCard;
    private playersTurn: boolean = true;
    private playerHasDefended: boolean = false;
    private endGame: boolean = false;
    private quitGame: boolean = false;
    private n: number;
    private highCard: RenderedCard;
    public testV: string;

    constructor(testV: string) {
        this.computerHand = Array();
        this.playerHand = Array();
        this.table = Array();
        this.deck = new DurakDeck();
        this.dealCards();
        this.testV = testV;
    }

    protected dealCards() {
        //Karten austeilen
        this.getHighCard();
        for (var c = 0; c < 6; c++) {
            this.playerHand.push(this.deck.deal());
            this.computerHand.push(this.deck.deal());
        }
        // markiere Karten einzeln als Trumpf
        this.highSuit = this.highCard.suit;
        for (var i = 0; i < this.deck.cards.length; i++) {
            var card: RenderedCard = this.deck.cards[i] as RenderedCard;
            if (card.suit === this.highSuit) {
                this.deck.cards[i].isHeighSuit = true;
            }
        }
    }

    protected getHighCard() {
        this.highCard = this.deck.cards[this.deck.cards.length - 1] as RenderedCard;
    }

    protected initFrame() {
        // FENSTER ZEICHNEN USW
    }

    protected checkWinningCoditions() {
        if (this.playerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        if (this.computerHand.length === 0 && this.deck.getNumCardsLeft() === 0) {
            return true;
        }
        return false;
    }

    public playerPicksUpCards() {
        //Schlucken
        this.playerHand = this.playerHand.concat(this.table);
        this.table = Array();
        this.refillCards(false);
        this.playersTurn = false;
    }

    protected refillCards(playerPicksUpFirst: boolean) {
        //Karten den spielern nachziehen lassen um wiedr 6 karten zu haben
        this.deck.list();
        if (playerPicksUpFirst) {
            while (this.playerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.playerHand.push(this.deck.deal());
            }

            while (this.computerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.computerHand.push(this.deck.deal());
            }
        } else {
            while (this.computerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.computerHand.push(this.deck.deal());
            }

            while (this.playerHand.length < 6 && this.deck.getNumCardsLeft() > 0) {
                this.playerHand.push(this.deck.deal());
            }
        }
    }

    public toString() {
        var result: string = "";

        result += "Trumpf: " + this.highCard.toString() + "\n";
        result += "KI Hand (" + this.computerHand.length + "): \n";
        for (var t = 0; t < this.computerHand.length; t++) {
            result += this.computerHand[t].toString() + "\n";
        }

        result += "Spieler Hand (" + this.playerHand.length + "): \n";
        for (var t = 0; t < this.playerHand.length; t++) {
            result += this.playerHand[t].toString() + "\n";
        }

        result += "Tisch (" + this.table.length + "): \n";
        for (var t = 0; t < this.table.length; t++) {
            result += this.table[t].toString() + "\n";
        }

        result += "Playersturn: " + this.playersTurn + "\n";
        result += "PlayerHasDefended: " + this.playerHasDefended + "\n";

        return result;
    }
}

// GUI