const moves = document.getElementById("moves");
const row = document.getElementById("row");
const scoreDisplay = document.createElement('div'); // Div for showing the score
scoreDisplay.style.marginTop = '20px';
scoreDisplay.style.fontSize = '18px';
scoreDisplay.style.fontWeight = 'bold';
document.body.appendChild(scoreDisplay); // Append the score display to the body
let currentLetterIndexCAT = 0; // Tracks the current letter being moved for CAT
let currentLetterIndexTASK = 0; // Tracks the current letter being moved for TASK
let intervalIdCAT = null; // Store the interval ID for CAT movement
let intervalIdTASK = null; // Store the interval ID for TASK movement

// Letter score mapping
const letterScores = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
    'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
    'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
    'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
    'Z': 10
};

function createSpan(r, c, letter = '') {
    const span = document.createElement("span");
    span.style.width = "20px";
    span.style.height = "20px";
    span.style.backgroundColor = "brown";
    span.id = `${r},${c},moves,span1`;
    span.style.position = "absolute"; // Allow overlapping
    span.style.zIndex = "10"; // Ensure the letter is on top
    span.innerHTML = `${letter}<sub style="font-size:10px;">${letterScores[letter] || ''}</sub>`;
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
                col.style.backgroundColor = "blue";
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
            col.style.border = "2px solid black";
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
const targetPositionsCAT = [
    { row: 8, col: 8 },  // C
    { row: 8, col: 9 },  // A
    { row: 8, col: 10 }  // T
];

// Array of predefined positions (row, column) for each letter of the word "TASK"
const targetPositionsTASK = [
    // { row: 8, col: 10 },  // T (below C)
    { row: 9, col: 10 },  // A (below A)
    { row: 10, col: 10 },  // S (below T)
    { row: 11, col: 10 }   // K (below S)
];

// Function to automate the movement of letters to specific positions for CAT
function autoMoveLettersCAT() {
    const letters = ['C', 'A', 'T'];

    if (currentLetterIndexCAT < letters.length) {
        const letter = letters[currentLetterIndexCAT];
        const { row: targetRow, col: targetCol } = targetPositionsCAT[currentLetterIndexCAT];

        moveLetterToBoard(letter, targetRow, targetCol);
        currentLetterIndexCAT++;
    } else {
        // All letters have been moved for CAT, calculate and display score
        clearInterval(intervalIdCAT); // Stop further movement
        calculateScoreCAT();
    }
}

// Function to automate the movement of letters to specific positions for TASK
function autoMoveLettersTASK() {
    const letters = ['A', 'S', 'K']; 

    if (currentLetterIndexTASK < letters.length) {
        const letter = letters[currentLetterIndexTASK];
        const { row: targetRow, col: targetCol } = targetPositionsTASK[currentLetterIndexTASK];

        moveLetterToBoard(letter, targetRow, targetCol);
        currentLetterIndexTASK++;
    } else {
        // All letters have been moved for TASK, calculate and display score
        clearInterval(intervalIdTASK); // Stop further movement
        calculateScoreTASK();
    }
}

// Function to calculate the score for CAT
function calculateScoreCAT() {
    // const bonuspoints = {
    //     DL: ["4,1", "12,1", "7,3", "9,3", "8,4", "15,4", "3,7", "7,7", "9,7", "13,7", "4,8", "12,8", "3,9", "7,9", "9,9", "13,9", "1,12", "8,12", "15,12", "7,13", "9,13", "4,15", "12,15"],
    //     TW: ["1,1", "8,1", "15,1", "1,8", "15,8", "1,15", "8,15", "15,15"],
    //     DW: ["2,2", "14,2", "3,3", "13,3", "4,4", "12,4", "5,5", "11,5", "5,11", "11,11", "4,12", "12,12", "3,13", "13,13", "2,14", "14,14"],
    //     TL: ["6,2", "10,2", "2,6", "6,6", "10,6", "14,6", "2,10", "6,10", "10,10", "14,10", "6,14", "10,14"]
    // };

    let score = 0;
    const letters = ['C', 'A', 'T'];

    letters.forEach(letter => {
        score += letterScores[letter] || 0;
        // const positions = targetPositionsCAT.map(pos => ${pos.row},${pos.col});
        // positions.forEach(pos => {
        //     if (bonuspoints.DL.includes(pos)) {
        //         score += (letterScores[letter] || 0) * 2; // Double Letter Score
        //     } else if (bonuspoints.DW.includes(pos)) {
        //         score += (letterScores[letter] || 0) * 3; // Triple Word Score
        //     } else {
        //         score += letterScores[letter] || 0; // Regular score
        //     }
        // });
    });

    // Update the score display
    scoreDisplay.innerText = `Score for Player 1: ${score};`
}

// Function to calculate the score for TASK
function calculateScoreTASK() {
    const bonuspoints = {
        DL: ["4,1", "12,1", "7,3", "9,3", "8,4", "15,4", "3,7", "7,7", "9,7", "13,7", "4,8", "12,8", "3,9", "7,9", "9,9", "13,9", "1,12", "8,12", "15,12", "7,13", "9,13", "4,15", "12,15"],
        TW: ["1,1", "8,1", "15,1", "1,8", "15,8", "1,15", "8,15", "15,15"],
        DW: ["2,2", "14,2", "3,3", "13,3", "4,4", "12,4", "5,5", "11,5", "5,11", "11,11", "4,12", "12,12", "3,13", "13,13", "2,14", "14,14"],
        TL: ["6,2", "10,2", "2,6", "6,6", "10,6", "14,6", "2,10", "6,10", "10,10", "14,10", "6,14", "10,14"]
    };

    let score = 0;
    const letters = ['A', 'S', 'K'];
    let wordMultiplier = 1;

    letters.forEach((letter, index) => {
        const { row, col } = targetPositionsTASK[index];
        const position = `${row},${col}`;

        console.log(position)

        if (bonuspoints.DL.includes(position)) {
            console.log("Double Letter Score", letterScores[letter] || 0)
            score += (letterScores[letter] || 0) * 2; // Double Letter Score
        } else if (bonuspoints.TL.includes(position)) {
            console.log("Triple Letter Score", letterScores[letter] || 0)
            score += (letterScores[letter] || 0) * 3; // Triple Letter Score
        } else if (bonuspoints.DW.includes(position)) {
            console.log("Double Word Score", letterScores[letter] || 0)
            score += letterScores[letter] || 0; // Regular score
            wordMultiplier *= 2; // Double Word Score
        } else if (bonuspoints.TW.includes(position)) {
            console.log("Triple Word Score", letterScores[letter] || 0)
            score += letterScores[letter] || 0; // Regular score
            wordMultiplier *= 3; // Triple Word Score
        } else {
            console.log("Regular Score", letterScores[letter] || 0)
            score += letterScores[letter] || 0; // Regular score
        }
    });

    score *= wordMultiplier; // Apply word multiplier

    // Update the score display
    scoreDisplay.innerText += `\nScore for Player 2: ${score}`;
}

// Initialize the game board
genBoard();

// Start automatic movement for CAT
intervalIdCAT = setInterval(autoMoveLettersCAT, 1000);

// Start automatic movement for TASK after CAT letters have been placed
setTimeout(() => {
    intervalIdTASK = setInterval(autoMoveLettersTASK, 1000);
}, 4000); // Delay to ensure CAT letters are placed before starting TASK