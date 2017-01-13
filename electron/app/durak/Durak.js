"use strict";
const Field_1 = require("./Field");
class Durak {
    constructor() {
        this.players = [];
        this.currentDefender = null;
        this.currentAttacker = [];
        this.isGameRunning = false;
        this.field = new Field_1.Field();
    }
    startGame() {
        this.isGameRunning = true;
    }
    endGame() {
        this.isGameRunning = false;
    }
    addPlayer(player) {
        if (!this.isGameRunning) {
            this.players.push(player);
        }
    }
}
exports.Durak = Durak;
