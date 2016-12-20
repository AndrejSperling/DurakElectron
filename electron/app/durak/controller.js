"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var durak_1 = require("./durak");
var Controller = (function () {
    function Controller(document) {
        this.DATA_SYMBOL = "data-card-symbol";
        this.DATA_VALUE = "data-card-value";
        this.PLAYABLE_CARDS = "playable";
        this.doc = document;
    }
    return Controller;
}());
exports.Controller = Controller;
var AIController = (function (_super) {
    __extends(AIController, _super);
    function AIController(document) {
        _super.call(this, document);
        this.game = new durak_1.Durak("WasApBi");
    }
    AIController.prototype.init = function (doc) {
        var self = this;
        // init clicklistener for cards
        var playableCards = doc.getElementsByClassName(this.PLAYABLE_CARDS);
        for (var i = 0; i < playableCards.length; i++) {
            playableCards[i].addEventListener("click", function () {
                self.playCard(this);
            });
        }
    };
    AIController.prototype.playCard = function (clickedElement) {
        console.log(clickedElement);
        var symbole = clickedElement.getAttribute(this.DATA_SYMBOL);
        var value = clickedElement.getAttribute(this.DATA_VALUE);
        alert("Clicked: symbole-> " + symbole + " value->" + value);
        clickedElement.remove();
    };
    return AIController;
}(Controller));
exports.AIController = AIController;
