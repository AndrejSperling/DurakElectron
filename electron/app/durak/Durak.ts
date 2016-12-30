import {Player} from "./Player";
import {Field} from "./Field";
export class Durak {

    private players: Array<Player> = []
    private currentDefender: Player = null
    private currentAttacker: Array<Player> = [];
    private field: Field;
    private isGameRunning = false;

    constructor() {
        this.field = new Field();
    }

    startGame() {
        this.isGameRunning = true;
    }

    endGame() {
        this.isGameRunning = false;
    }

    addPlayer(player: Player) {
        if (!this.isGameRunning) {
            this.players.push(player);
        }
    }

}