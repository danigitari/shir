const moves = document.getElementById("moves");
const row = document.getElementById("row");
let currentLetterIndex = 0; // Tracks the current letter being moved
let intervalId = null; // Store the interval ID to control automatic movement

function createSpan(r, c, letter = '') {
    const span = document.createElement("span");
    span.style.width = "20px";
    span.style.height = "20px";
    span.style.backgroundColor = "bisque";
    span.id = `${r},${c},moves,span1`;
    span.textContent = letter;
    span.style.position = "absolute"; // Allow overlapping
    span.style.zIndex = "10"; // Ensure the letter is on top
    return span;
}

function genBoard() {
    const bonuspoints = {
        DL: ["4,1", "12,1", "7,3", "9,3", "8,4", "15,4", "3,7", "7,7", "9,7", "13,7", "4,8", "12,8", "3,9", "7,9", "9,9", "13,9", "1,12", "8,12", "15,12", "7,13", "9,13", "4,15", "12,15"],
        TW: ["1,1", "8,1", "15,1", "1,8", "15,8", "1,15", "8,15", "15,15"],
        DW: ["2,2", "14,2", "3,3", "13,3", "4,4", "12,4", "5,5", "11,5", "5,11", "11,11", "4,12", "12,12", "3,13", "13,13", "2,14", "14,14"],
        TL: ["6,2", "10,2", "2,6", "6,6", "10,6", "14,6", "2,10", "6,10", "10,10", "14,10", "6,14", "10,14"]
    };

    for (let r = 1; r < 16; r++) {
        const boardRow = document.createElement("div");
        boardRow.style.display = "flex";

        for (let c = 1; c < 16; c++) {
            const col = document.createElement("div");
            let tilename = document.createElement("p");
            tilename.style.color = "black";
            col.appendChild(tilename);

            // Bonus points coloring logic
            if (bonuspoints.DL.includes(`${r},${c}`)) {
                col.style.backgroundColor = "lightblue";
                tilename.textContent = "DL";
            } else if (bonuspoints.DW.includes(`${r},${c}`)) {
                col.style.backgroundColor = "pink";
                tilename.textContent = "DW";
            } else if (bonuspoints.TL.includes(`${r},${c}`)) {
                col.style.backgroundColor = "royalblue";
                tilename.textContent = "TL";
            } else if (bonuspoints.TW.includes(`${r},${c}`)) {
                col.style.backgroundColor = "red";
                tilename.textContent = "TW";
            } else {
                col.style.backgroundColor = "beige";
            }

            // Style for each column
            col.style.width = "40px";
            col.style.height = "40px";
            col.style.display = "flex";
            col.style.justifyContent = "center";
            col.style.alignItems = "center";
            col.id = `${r},${c},moves`;
            col.style.border = "2px solid grey";
            col.style.position = "relative"; // Needed for absolute positioning of letters

            // Add a permanent star symbol to the (8, 8) tile
            if (r === 8 && c === 8) {
                tilename.textContent = "*"; // Star in the center
                tilename.style.fontSize = "30px"; // Make the star larger
                tilename.style.fontWeight = "bold"; // Bold the star for emphasis
                tilename.style.position = "relative"; // Ensure it stays within the cell
                tilename.style.zIndex = "5"; // Lower z-index for the star
            }

            boardRow.appendChild(col);
        }
        moves.appendChild(boardRow);
    }
}

// Function to move a letter from the rack to the board
function moveLetterToBoard(letter, targetRow, targetCol) {
    const tile = document.getElementById(`${targetRow},${targetCol},moves`);

    if (tile) {
        const newSpan = createSpan(targetRow, targetCol, letter);
        tile.appendChild(newSpan);
        removeFromRow(letter); // Remove the letter from the rack
    }
}

// Function to move a letter back to the rack
function moveLetterBackToRow(letter) {
    const column = document.createElement("div");
    column.classList.add("column");

    let tilename = document.createElement("p");
    tilename.style.color = "black";
    tilename.textContent = letter;
    column.appendChild(tilename);

    row.appendChild(column);
}

// Function to remove a letter from the row
function removeFromRow(letter) {
    const rackLetter = Array.from(row.children).find(column => column.textContent.trim() === letter);
    if (rackLetter) {
        rackLetter.remove(); // Remove letter from the rack
    }
}

// Array of predefined positions (row, column) for each letter of the word "CAT"
const targetPositions = [
    { row: 8, col: 8 },  // C
    { row: 8, col: 9 },  // A
    { row: 8, col: 10 }  // T
];

// Function to automate the movement of letters to specific positions
function autoMoveLetters() {
    const letters = ['C', 'A', 'T']; // Define the target letters explicitly

    if (currentLetterIndex < letters.length) {
        const letter = letters[currentLetterIndex];
        const { row: targetRow, col: targetCol } = targetPositions[currentLetterIndex];

        // Move the letter to its specific row and column
        moveLetterToBoard(letter, targetRow, targetCol);

        currentLetterIndex++;
    } else {
        // All letters have been moved, wait before removing them from the board
        setTimeout(() => {
            removeAllLettersFromBoard(letters);
        }, 3000); // Wait for 3 seconds after placing the last letter
    }
}

// Function to remove all letters from the board
function removeAllLettersFromBoard(letters) {
    targetPositions.forEach((pos, index) => {
        const { row: targetRow, col: targetCol } = pos;
        const tile = document.getElementById(`${targetRow},${targetCol},moves`);

        if (tile) {
            const span = tile.querySelector("span");
            if (span) {
                const letter = span.textContent;
                span.remove(); // Remove letter from the board
                moveLetterBackToRow(letter); // Move it back to the rack
            }
        }
    });

    // Reset the current letter index for the next cycle
    currentLetterIndex = 0;
}

// Start the automatic movement of letters
function startAutoMovement() {
    intervalId = setInterval(() => {
        autoMoveLetters();
    }, 1000); // Move each letter every 1 second
}

// Generate the board
genBoard();

// Populate the row (rack) with the letters "C", "A", and "T"
const letters = ['C', 'A', 'T', 'D', 'G', 'O', 'S', 'I', 'F', 'W'];

for (let i = 0; i < letters.length; i++) {
    const column = document.createElement("div");
    column.classList.add("column");

    let tilename = document.createElement("p");
    tilename.style.color = "black";
    tilename.textContent = `${letters[i]}`;
    column.appendChild(tilename);

    row.appendChild(column);
}

// Start automatic movement
startAutoMovement();
