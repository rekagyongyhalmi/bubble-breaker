let bubbleColorPalette = ["red", "blue", "yellow"];
let backgroundColor = "turquoise";
const numberOfRows = 10;
const numberOfColumns = 15;

document.getElementById("new-game").addEventListener('click', newGame);
let playingField = document.getElementById("playingfield");
let bubbleRadius = (100 / numberOfColumns) / 2;

let bubblesArray = [];

let score = 0;
let colorBlock = new Set();
let colorClicked = "";
let rightColumn = numberOfColumns - 1;

newGame();

function newGame() {

    // Initial settings
    score = 0;
    document.getElementById("score").innerHTML = score;
    colorBlock = new Set();
    bubblesArray = [];  // for logic
    colorClicked = "";
    playingField.innerHTML = "";
    rightColumn = numberOfColumns - 1;

    // Generating bubbles
    for (let col = 0; col < numberOfColumns; col++) {
        let bubblesColumn = [];     // for logic
        let xCoordinate = bubbleRadius * (col * 2 + 1); //for visual representation

        for (let row = 0; row < numberOfRows; row++) {

            let randomNumber = Math.floor(Math.random() * bubbleColorPalette.length);
            let bubbleColor = bubbleColorPalette[randomNumber];

            bubblesColumn.push(bubbleColor);    // for logic

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
        // Add bubbles to array
        bubblesArray.push(bubblesColumn);
    }
}

// Finding bubble's position in grid

function calculatePosition(svgBubble) {
    let gridColumn = parseInt(svgBubble.id.split("-")[0]);
    let gridRow = parseInt(svgBubble.id.split("-")[1]);
    return [gridColumn, gridRow];
}

// Removing bubbles

function bubbleClicked() {
    colorClicked = this.getAttribute("fill");
    if (colorClicked != backgroundColor) {
        getAdjacents(this);
        if (colorBlock.size > 1) {
            colorBlock.forEach(element => {
                let coordinates = element.id.split("-");
                cX = parseInt(coordinates[0]);
                cY = parseInt(coordinates[1]);
                updateBubbleColor(cX, cY, backgroundColor);
            });

            score += colorBlock.size * (colorBlock.size - 1);
            document.getElementById("score").innerHTML = score;

            bubblesUp();
            shiftColumnsToLeft();
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
            updateBubbleColor(col, numberOfRows - i, backgroundColor);
        }
    }
}

function moveBubblesUpTo(x, y) {
    while (y < numberOfRows - 1) {
        let nextBubble = bubblesArray[x][y + 1];
        if (nextBubble != backgroundColor) {
            updateBubbleColor(x, y, nextBubble);
            y++;
        } else {
            break;
        }
    }
    while (y < numberOfRows) {
        updateBubbleColor(x, y, backgroundColor);
        y++;
    }
}

function isEmptyColumn(x) {
    return bubblesArray[x].every(cell => cell == backgroundColor);
}

function shiftColumnsToLeft() {
    for (let x = 0; x < rightColumn; x++) {
        while (isEmptyColumn(x) && x <= rightColumn) {
            shiftToColumn(x);
            rightColumn--;
        }
    }
}

function shiftToColumn(i) {

    for (let j = 0; j < numberOfRows; j++) {
        let tmpColor = bubblesArray[i + 1][j];
        updateBubbleColor(i, j, tmpColor);
        updateBubbleColor(i + 1, j, backgroundColor);
    }

    if (i + 1 < rightColumn) {
        shiftToColumn(i + 1);
    }
}

function updateBubbleColor(x, y, color) {
    bubblesArray[x][y] = color;
    let circle = document.getElementById(`${x}-${y}`);
    circle.setAttribute("fill", color);
}