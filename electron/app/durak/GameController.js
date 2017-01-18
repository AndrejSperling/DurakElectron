"use strict";
const Durak_1 = require("../old/Durak");
const ViewController_1 = require("./ViewController");
const Config_1 = require("../Config");
const electron_1 = require("electron");
const io = require("socket.io-client");
class GameController extends ViewController_1.ViewController {
    constructor() {
        super();
        this.SOCKET_MAKE_MOVE = 'game.move.make';
        this.SOCKET_MOVE_RECEIVED = 'game.move.received';
        this.SOCKET_USER_JOINED = 'user.joined';
        this.game = new Durak_1.Durak("WasApBi");
        this.socket = io.connect(Config_1.Config.server);
        this.registerOrLoginUser();
        if (this.user != null) {
            this.joinTheGame();
        }
        // Wrap the socket requests
        let wrap = function (fn) {
            return function () {
                fn.apply(self, arguments);
            };
        };
        // Register socket callbacks
        this.socket.on(this.SOCKET_USER_JOINED, wrap(this.userJoined));
        this.socket.on(this.SOCKET_MOVE_RECEIVED, wrap(this.moveReceived));
    }
    moveReceived(data) {
        console.log(this.user);
        console.log("MoveReceived");
        console.log(data);
        let attack = data.matches[0].attackCard;
        let defend = data.matches[0].defendCard;
        let move;
        if (attack == null) {
            move = "By " + defend.by + " Card: s:" + defend.symbol + " v:" + defend.value;
            super.log("Defend", move);
        }
        else {
            move = "By " + attack.by + " Card: s:" + attack.symbol + " v:" + attack.value;
            super.log("Attack", move);
        }
    }
    userJoined(data) {
        console.log("userJoines");
        console.log(data);
        super.log("User Joined", "" + data.user.username);
    }
    registerOrLoginUser() {
        this.user = electron_1.remote.getGlobal('sharedObject').user;
        if (this.user == null) {
            this.socket.emit('user.new', function (callback) {
                let user = {
                    'username': callback.username
                };
                electron_1.remote.getGlobal('sharedObject').user = user;
                this.user = user;
            });
        }
        if (this.user == null || this.user == undefined) {
            this.user = {
                username: "NoName"
            };
        }
        super.setName(this.user.username + "");
    }
    joinTheGame() {
        this.socket.emit('game.join', this.user.username, function (cb) {
        });
    }
    onLoadView(window, doc) {
        super.onLoadView(window, doc);
    }
    onClickTakeCard() {
        super.setIsDefending();
    }
    onClickEndMove() {
        super.setIsAttacking();
    }
    attack(card) {
        console.log("Attack");
        console.log(card);
        let username = this.user.username;
        this.socket.emit(this.SOCKET_MAKE_MOVE, {
            matches: [
                {
                    attackCard: {
                        symbol: card.suit,
                        value: card.value,
                        by: "" + username
                    },
                    defendCard: null
                },
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
                }
            ]
        });
    }
    defend(toDefend, defendWith) {
        console.log("Defend");
        console.log("ToDefend:");
        console.log(toDefend);
        console.log("DefendWidth:");
        console.log(defendWith);
        let username = this.user.username;
        this.socket.emit(this.SOCKET_MAKE_MOVE, {
            matches: [{
                    attackCard: null,
                    defendCard: {
                        symbol: defendWith.suit,
                        value: defendWith.value,
                        by: username
                    }
                }]
        });
    }
    viewReady() {
        super.setName(this.user.username || "NoName");
    }
}
exports.GameController = GameController;
