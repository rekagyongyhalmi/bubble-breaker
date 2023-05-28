let bubbleColorPalette = ["red", "green", "blue", "yellow"];
let numberOfRows = 10;
let numberOfColumns = 15;

let playingField = document.getElementById("playingfield");
let fieldWidth = parseInt(window.getComputedStyle(playingField).width);
let fieldHeight = parseInt(window.getComputedStyle(playingField).height);

let bubbleRadius = (100 / numberOfColumns) / 2;

newGame();

function newGame() {
    for (let col = 0; col < numberOfColumns; col++) {
        let fieldColumn = [];
        let xCoordinate = bubbleRadius * (col * 2 + 1);
        for (let row = 0; row < numberOfRows; row++) {
            let yCoordinate = bubbleRadius * (row * 2 + 1);

            let randomNumber = Math.floor(Math.random() * bubbleColorPalette.length);
            let bubbleColor = bubbleColorPalette[randomNumber];

            // Create a circle element representing the bubble
            let bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bubble.setAttribute("id", `${col}-${row}`);
            bubble.setAttribute("cx", xCoordinate);
            bubble.setAttribute("cy", yCoordinate);
            bubble.setAttribute("r", bubbleRadius);
            bubble.setAttribute("fill", bubbleColor);

            bubble.addEventListener('click', bubbleClicked);

            // Add bubble to playing field (SVG)
            playingField.appendChild(bubble);

        }
    }

}

function bubbleClicked() {
    let colorClicked = this.getAttribute("fill");
    console.log(colorClicked);
    this.remove();
}