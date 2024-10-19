const moves = document.getElementById("moves");
const row = document.getElementById("row");
//let currentLetterIndex = 0; // Tracks the current letter being moved
//let intervalId = null; // Store the interval ID to control automatic movement

function createSpan(r, c,) {
    const span = document.createElement("span");
    span.style.width = "20px";
    span.style.height = "20px";
    span.style.backgroundColor = "bisque";
    span.id = `${r},${c},moves,span1`;  // Corrected template literal
    //span.textContent = letter;
    //span.style.position = "absolute"; // Allow overlapping
    //span.style.zIndex = "10"; // Ensure the letter is on top
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
            col.id = `${r},${c},moves`;  // Corrected template literal
            col.style.border = "2px solid grey";
            //col.style.position = "relative"; // Needed for absolute positioning of letters

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

genBoard();