"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Durak_1 = require("../old/Durak");
var ViewController_1 = require("./ViewController");
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        _super.call(this);
        this.game = new Durak_1.Durak("WasApBi");
    }
    GameController.prototype.onLoadView = function (window, doc) {
        _super.prototype.onLoadView.call(this, window, doc);
    };
    GameController.prototype.onClickTakeCard = function () {
        _super.prototype.setIsDefending.call(this);
    };
    GameController.prototype.onClickEndMove = function () {
        _super.prototype.setIsAttacking.call(this);
    };
    GameController.prototype.attack = function (card) {
        console.log(card);
    };
    GameController.prototype.defend = function (toDefend, defendWith) {
    };
    return GameController;
}(ViewController_1.ViewController));
exports.GameController = GameController;
