export class Renderer {
    gameElem = null;

    updateResources() {
        this.gameElem.dispatchEvent(new CustomEvent("gameUpdateResources"));
        console.log("Renderer resources updated");
    }

    updateLogs() {
        this.gameElem.dispatchEvent(new CustomEvent("gameUpdateLogs"));
        console.log("Renderer logs updated");
    }

    updateMap() {
        this.gameElem.dispatchEvent(new CustomEvent("gameUpdateMap"));
        console.log("Renderer map updated");
    }

    updateModal() {
        this.gameElem.dispatchEvent(new CustomEvent("gameUpdateModal"));
        console.log("Renderer modal updated");
    }

    gameOver() {
        this.gameElem.dispatchEvent(new CustomEvent("gameGameOver"));
        console.log("Game over from renderer");
    }

    constructor() {
        this.gameElem = document.getElementById("game");
    }
}