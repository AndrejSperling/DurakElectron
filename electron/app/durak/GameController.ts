import {Durak} from "../old/Durak";
import {ViewController} from "./ViewController";
import {Config} from "../Config";
import {remote} from "electron";
import * as io from "socket.io-client";
import {Card} from "./Card";

export class GameController extends ViewController {

    protected readonly SOCKET_MAKE_MOVE         = 'game.move.make';
    protected readonly SOCKET_MOVE_RECEIVED     = 'game.move.received';
    protected readonly SOCKET_USER_JOINED       = 'user.joined';

    private socket;
    private game;
    private user;

    constructor() {

        super();
        this.game = new Durak("WasApBi");
        this.socket = io.connect(Config.server);

        this.registerOrLoginUser();

        if (this.user != null) {
            this.joinTheGame()
        }

        // Wrap the socket requests
        let wrap = function (fn) {
            return function () {
                fn.apply(self, arguments);
            };
        };

        // Register socket callbacks
        this.socket.on(this.SOCKET_USER_JOINED, wrap(this.userJoined));
        this.socket.on(this.SOCKET_MOVE_RECEIVED, wrap(this.moveReceived))

    }

    private moveReceived(data){
        console.log("MoveReceived");
        console.log(data);
    }

    private userJoined(data) {
        console.log("userJoines");
        console.log(data)
    }

    private registerOrLoginUser() {
        this.user = remote.getGlobal('sharedObject').user;
        if (this.user == null) {
            this.socket.emit('user.new', function (callback) {
                let user = {
                    'username': callback.username
                };
                remote.getGlobal('sharedObject').user = user;
                this.user = user;
            });
        }
    }

    private joinTheGame() {
        this.socket.emit('game.join', this.user.username, function (cb) {

        });
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
        console.log("Attack");
        console.log(card);


        this.socket.emit(this.SOCKET_MAKE_MOVE, {
            matches :[
                {
                    attackCard: {
                        symbol: 1,
                        value: 14,
                        by: "Vitali7"
                    },
                    defendCard: {
                        symbol: 2,
                        value: 14,
                        by: "Wowa"
                    }
                },
                {
                    attackCard: {
                        symbol: 1,
                        value: 14,
                        by: "Vitali"
                    },
                    defendCard: null
                }
            ]
        });

    }

    defend(toDefend: Card, defendWith: Card) {
        console.log("Defend");
        console.log("ToDefend:");
        console.log(toDefend);
        console.log("DefendWidth:");
        console.log(defendWith);
    }

}


