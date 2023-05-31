let bubbleColorPalette = ["red", "blue", "yellow"];
let backgroundColor = "turquoise";
const numberOfRows = 10;
const numberOfColumns = 15;

let playingField = document.getElementById("playingfield");
document.getElementById("new-game").addEventListener('click', newGame);
let bubbleRadius = (100 / numberOfColumns) / 2;

let bubblesArray = [];
let score = 0;
let colorBlock = new Set();
let colorClicked = "";

newGame();

function newGame() {

    // Initial settings
    score = 0;
    document.getElementById("score").innerHTML = score;
    colorBlock = new Set();
    colorClicked = "";
    playingField.innerHTML = "";

    // Generating bubbles
    for (let col = 0; col < numberOfColumns; col++) {
        let xCoordinate = bubbleRadius * (col * 2 + 1); //for visual representation

        for (let row = 0; row < numberOfRows; row++) {

            let randomNumber = Math.floor(Math.random() * bubbleColorPalette.length);
            let bubbleColor = bubbleColorPalette[randomNumber];

            // Create a circle element representing the bubble
            let yCoordinate = bubbleRadius * (row * 2 + 1);
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

// Finding bubble's position in grid

function calculatePosition(svgBubble) {
    let cx = parseFloat(svgBubble.getAttribute("cx"));
    let cy = parseFloat(svgBubble.getAttribute("cy"));
    let gridColumn = Math.round(((cx / bubbleRadius) - 1) / 2);
    let gridRow = Math.round(((cy / bubbleRadius) - 1) / 2);
    return [gridColumn, gridRow];
}

// Removing bubbles

function bubbleClicked() {
    colorClicked = this.getAttribute("fill");
    if (colorClicked != backgroundColor) {
        getAdjacents(this);
        if (colorBlock.size > 1) {
            colorBlock.forEach(element => {
                element.setAttribute("fill", backgroundColor);
            });
            score += colorBlock.size * (colorBlock.size - 1);
            document.getElementById("score").innerHTML = score;
            bubblesUp();

        }
    }
    colorBlock = new Set();
    colorClicked = "";
}

function getAdjacents(startBubble) {
    if (!(colorBlock.has(startBubble))) {
        colorBlock.add(startBubble);

        let gridPosition = calculatePosition(startBubble);
        let startingX = gridPosition[0];
        let startingY = gridPosition[1];

        lookUp(startingX, startingY);
        lookDown(startingX, startingY);
        lookLeft(startingX, startingY);
        lookRight(startingX, startingY);
    }
}

// Check if adjacent bubble is of the same color as the bubble clicked
function lookUp(x, y) {
    if (y > 0) {
        let bubbleAbove = document.getElementById(`${x}-${y - 1}`);
        if (bubbleAbove.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleAbove);
        }
    }
}

function lookDown(x, y) {
    if (y < numberOfRows - 1) {
        let bubbleBelow = document.getElementById(`${x}-${y + 1}`);
        if (bubbleBelow.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleBelow);
        }
    }
}

function lookLeft(x, y) {
    if (x > 0) {
        let bubbleToLeft = document.getElementById(`${x - 1}-${y}`);
        if (bubbleToLeft.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleToLeft);
        }
    }
}

function lookRight(x, y) {
    if (x < numberOfColumns - 1) {
        let bubbleToRight = document.getElementById(`${x + 1}-${y}`);
        if (bubbleToRight.getAttribute("fill") == colorClicked) {
            getAdjacents(bubbleToRight);
        }
    }
}

// Pull remaining bubbles together

function bubblesUp() {
    let bubblingColumns = {};
    colorBlock.forEach(bubble => {
        let bCol = calculatePosition(bubble)[0];
        let bRow = calculatePosition(bubble)[1];

        if (!bubblingColumns.hasOwnProperty(bCol)) {
            bubblingColumns[bCol] = [];
        }
        bubblingColumns[bCol].push(bRow);

    });

    for (let [col, gaps] of Object.entries(bubblingColumns)) {
        gaps.sort((a, b) => b - a);
        gaps.forEach(g => {
            moveBubblesUpTo(col, g);
        });
        for (let i = 1; i <= gaps.length; i++) {
            let empty = document.getElementById(`${col}-${numberOfRows - i}`);
            empty.setAttribute("fill", backgroundColor);
        }
    }
}

function moveBubblesUpTo(x, y) {
    if (y < numberOfRows - 1) {
        let emptySpot = document.getElementById(`${x}-${y}`);
        let movingBubble = document.getElementById(`${x}-${y + 1}`);
        let tempColor = movingBubble.getAttribute("fill");

        if (tempColor == backgroundColor) {
            for (let i = y + 2; i < numberOfRows; i++) {
                let nextBubble = document.getElementById(`${x}-${i}`);
                if (nextBubble.getAttribute("fill") != backgroundColor) {
                    movingBubble = nextBubble;
                    tempColor = movingBubble.getAttribute("fill");
                    break;  // exit for loop when the next bubble is found
                }
            }
        }

        emptySpot.setAttribute("fill", tempColor);
        movingBubble.setAttribute("fill", backgroundColor);


        moveBubblesUpTo(x, y + 1);
    }
}

function shiftToLeft(emptyColumn) {
    if (emptyColumn < numberOfColumns - 1) {

    }
}
