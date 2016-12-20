const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({width: 250, height: 250})

    mainWindow.loadURL(url.format({
        protocol: 'file:',
        pathname: path.join(__dirname, 'app/index.html'),
        slashes: true
    }))

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    main()
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

function main(){

    var titte = new RandomCardDeck();
    titte.test();

}

// Klasse Card

function Card(fv, av, s, v){

    //ACHTUNG Überladener Konstruktor in original Klasse
    //      public Card(int fv, char s, boolean v) {
    //      this(fv, fv, s, v); }
    // getSuits() gibt es nicht stattdessen besser direkter zugriff auf array

    //Konstruktor
    this.konstruktor = function() {
        this.JACK = 11;
        this.QUEEN = 12;
        this.KING = 13;
        this.ACE = 14;

        if(fv >= cardMin && fv <= cardMax){
            this.faceValue = fv;
        }else{
            this.faceValue = 2;
        }
        this.actualValue = av;
        if(s === "C" || s === "D" || s === "H" || s === "S"){
            this.suit = s;
        }else{
            this.suit = "C";
        }
        this.visible = v;
    };
    this.konstruktor();

    this.toString = function(){
        if(this.visible !== true){
            return "??";
        }
        face = null;
        if(this.faceValue >= 2 && this.faceValue <= 10){
            face = "" + this.faceValue;
        }else{
            if(this.faceValue === this.JACK){
                face = "J"
            }else if(this.faceValue === this.QUEEN){
                face = "Q"
            }else if(this.faceValue === this.KING){
                face = "K"
            }else if(this.faceValue === this.ACE){
                face = "A"
            }else{
                face = "2"
            }
        }
        face = face + this.suit;
        return face;
    }
    this.isPictureCard = function(){
        if(this.faceValue >= this.JACK && this.faceValue <= this.KING){
            return true;
        }
        return false;
    }

}
suits = ["C", "D", "H", "S"];
cardMax = 14;
cardMin = 2;

// Klasse RenderedCard

function RenderedCard(fv, s, v, hs){

    //Konstruktor ÜBERLADEN IM ORIGINAL
    this.konstruktor = function(){
        this.isHeighSuit = hs;
        this.image = null;
        this.offscreen = null;
        this.Dimension = null;
    };
    this.konstruktor();
    Card.call(this,fv,fv,s,v);

    this.paint = function(g){
      if(this.visible === false){
          //MALE RÜCKSEITE
      }  else {
          //MALE VORDERSEITE
          //Original Code
          //String s = "picture_data/" + this.toString() + ".gif";
          //image = Toolkit.getDefaultToolkit().getImage(s);
          //g.drawImage(image, 0, 0, this);
      }
    }

    this.update = function(g){
        this.paint(g);
    }

};
RenderedCard.prototype = new Card;
RenderedCard.prototype.construcor = RenderedCard;

// Klasse CardDeck

function CardDeck(){

    this.konstruktor = function(){
        this.top = 0;
        this.numValues = cardMax - cardMin + 1;
        this.cards = Array((suits.length * this.numValues));
        this.cIndex = null;

        //Karten erstellen und ins Deck einfügen
        for(var s = 0; s < suits.length; s++){
            for(var v = cardMin; v <= cardMax; v++){
                this.cIndex = s * this.numValues + v - cardMin;
                this.cards[this.cIndex] = new RenderedCard(v,suits[s],true,false);
            }
        }
    };
    this.konstruktor();

    this.list = function(){
        for( var x = 0; x < this.cards.length; x++){
            console.log(this.cards[x].toString());
        }
    }

    this.deal = function(){
        var dealt = this.cards[this.top++];
        if(this.top > this.cards.length){
            return null;
        }
        return dealt;
    }

    this.reset = function(){
        this.top = 0;
    }

    this.getNumCardsLeft = function(){
        return this.cards.length - this.top;
    }

}


// Klasse RandomCardDeck

function RandomCardDeck(){

    this.test = function(){
        for(var k =0; k < this.cards.length; k++){
            console.log(this.cards[k].toString());
        }
    };

    this.shuffle = function(){
        var shuffled = Array(this.cards.length);
        var cIndex = null;
        var placed = null;
        for(var c = 0; c < this.cards.length;c++){
            do{
                placed = false;
                cIndex = Math.floor((Math.random() * this.cards.length) + 0);
                if(shuffled[cIndex] === undefined){
                    shuffled[cIndex] = this.cards[c];
                    placed = true;
                }
            }while(placed === false);
        }

        this.cards = shuffled.slice(0);
        this.top = 0;
    };

    this.konstruktor = function(){
        this.shuffle();
    };
    this.konstruktor();
    CardDeck.call(this);

    this.reset = function(){
        this.top = 0;
        this.shuffle();
    };
};
RandomCardDeck.prototype = new CardDeck();
RandomCardDeck.prototype.constructor = RandomCardDeck;
//Bei Vererbung wird nur die Struktur der Superklasse übernommen
//D.h dass es von einer Variablen immer je eine Instanz in Sub und in Super gibt
//CardDeck und RandomCardDeck list() "effekt"


