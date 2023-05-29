let bubbleColorPalette = ["red", "green", "blue", "yellow"];
let backgroundColor = "turquoise";
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

let score = 0;
let colorBlock = new Set();
let colorClicked = "";


function bubbleClicked() {
    colorClicked = this.getAttribute("fill");
    getAdjacents(this);
    if (colorBlock.size > 1) {
        console.log("Block: " + colorBlock.size);
        colorBlock.forEach(element => {
            element.setAttribute("fill", backgroundColor);
            element.removeEventListener('click', bubbleClicked);
        });
        score += colorBlock.size * (colorBlock.size - 1);
        document.getElementById("score").innerHTML = score;
        //bubbleShift();
    }
    colorBlock = new Set();
    colorClicked = "";
}

function getAdjacents(startBubble) {
    if (!(colorBlock.has(startBubble))) {
        colorBlock.add(startBubble);
        let bubbleId = startBubble.id;
        console.log(bubbleId, colorClicked);

        let startingX = parseInt(bubbleId.split("-")[0]);
        //console.log(startingX);
        let startingY = parseInt(bubbleId.split("-")[1]);
        //console.log(startingY);
        lookUp(startingX, startingY);
        lookDown(startingX, startingY);
        lookLeft(startingX, startingY);
        lookRight(startingX, startingY);
    }
}

// Check if bubble above is of the same color as bubble clicked
function lookUp(x, y) {
    if (y > 0) {
        let bubbleAbove = document.getElementById(`${x}-${y - 1}`);
        console.log("on top:" + bubbleAbove.id);
        if (bubbleAbove.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleAbove);
        }
    }
}

function lookDown(x, y) {
    if (y < numberOfRows - 1) {
        let bubbleBelow = document.getElementById(`${x}-${y + 1}`);
        console.log("below:" + bubbleBelow.id);
        if (bubbleBelow.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleBelow);
        }
    }
}

function lookLeft(x, y) {
    if (x > 0) {
        let bubbleToLeft = document.getElementById(`${x - 1}-${y}`);
        console.log("to left:" + bubbleToLeft.id);
        if (bubbleToLeft.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleToLeft);
        }
    }
}

function lookRight(x, y) {
    if (x < numberOfColumns - 1) {
        let bubbleToRight = document.getElementById(`${x + 1}-${y}`);
        console.log("to right:" + bubbleToRight.id);
        if (bubbleToRight.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleToRight);
        }
    }
}

function bubbleShift() {
    let remainingBubbles = document.querySelectorAll(circle);
    remainingBubbles.forEach(element => {
        // Now what???
    });
}
