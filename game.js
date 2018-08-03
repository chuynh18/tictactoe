"use strict";

// 0 = empty
// 1 = player 1, plays as X
// 2 = player 2, plays as O
let gameBoard = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

// tracks whose turn it is
let turn = 1;

// tracks number of turns elapsed.  Only useful for AI workaround due to deprioritizing the center of the board.
let turns = 0;

// tracks winner.  0 = game in progress, 1 = p1 win, 2 = p2 win, -1 = tied game
let winner = 0;

// tracks human vs human, human vs cpu, cpu vs human, or cpu vs cpu
// 0 = not started, 1 = PvP, 2 = PvC, 3 = CvP, 4 = CvC
let mode = 0;

// tracks wins and draws
const record = {
    p1: 0,
    p2: 0,
    ties: 0
};

// why not save the record to localStorage?
const ls = window.localStorage;

const saveRecord = function() {
    ls.setItem("record", JSON.stringify(record));
}

const loadRecord = function() {
    const loadedRecord = JSON.parse(ls.getItem("record"));

    if (loadedRecord) {
        [record.p1, record.p2, record.ties] = [loadedRecord.p1, loadedRecord.p2, loadedRecord.ties];
    }
}

// resets game state
const reset = function() {
    gameBoard = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];
    turn = 1;
    turns = 0;
    winner = 0;
    mode = 0;

    refreshDisplay();

    modifyEventHandlers("");

    document.getElementById("board").classList.add("hidden");

    const targetDiv = document.getElementById("turn");
    targetDiv.textContent = "Play as...";
    const buttonList = document.createElement("div");
    buttonList.id = "start-buttons";
    
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const button3 = document.createElement("button");
    const button4 = document.createElement("button");

    button1.textContent = "Human vs Human";
    button1.setAttribute("onclick", "mode=1;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)');");
    button2.textContent = "Human vs CPU";
    button2.setAttribute("onclick", "mode=2;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)')");
    button3.textContent = "CPU vs Human";
    button3.setAttribute("onclick", "mode=3;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(play,1000)");
    button4.textContent = "Spectate CPU vs CPU";
    button4.setAttribute("onclick", "mode=4;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(play,1000)");

    buttonList.appendChild(button1);
    buttonList.appendChild(button2);
    buttonList.appendChild(button3);
    buttonList.appendChild(button4);

    targetDiv.appendChild(buttonList);
}

// makes it so that playable cells get highlighted on mouseover, but only during the human player's turn
// accomplishes this by adding the "hover" class to the appropriate cells
const highlight = function(bool, event) {
    const i = Math.floor(Number(event.target.id) / 3);
    const j = Number(event.target.id) % 3;

    if (bool && !gameBoard[i][j] && ((mode === 2 && turn === 1) || (mode === 3 && turn === 2) || mode === 1)) {
        event.target.classList.add("hover");
    } else if (!bool) {
        event.target.classList.remove("hover");
    }
}

// plays scribble sound
const playSound = function(sound) {
    const audio = new Audio(sound);
    audio.play();
}

// flips turn and plays sound
const changeTurn = function() {
    if (turn === 1) {
        playSound("x.webm");
        turn++;
    } else {
        playSound("o.webm");
        turn--;
    }

    turns++;
}

// Removes or attaches event handlers to each cell on the game board
const modifyEventHandlers = function(input) {
    const cells = document.getElementsByClassName("grid-item");

    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("onclick", input);
    }
}

const showBoard = function() {
    document.getElementById("board").classList.remove("hidden");
}

// updates game display (background color, whose turn it is, who won or game tied, and the state of the board itself)
const refreshDisplay = function() {
    
    // appends game status text and changes the page and board colors
    if (winner === 1) {
        record.p1++;
        document.getElementById("turn").textContent = "Player 1 wins";
        document.getElementsByTagName("html")[0].style.backgroundColor = "#778899";
        document.getElementById("board").style.backgroundColor = "#2196F3";
    } else if (winner === 2) {
        record.p2++;
        document.getElementById("turn").textContent = "Player 2 wins";
        document.getElementsByTagName("html")[0].style.backgroundColor = "#aa8484";
        document.getElementById("board").style.backgroundColor = "#f32121";
    } else if (winner === -1) {
        record.ties++;
        document.getElementById("turn").textContent = "Tied game";
        document.getElementsByTagName("html")[0].style.backgroundColor = "#c4fcc2";
        document.getElementById("board").style.backgroundColor = "#36fc2f";
    } else if (!winner && mode) {
        if (turn === 1) {
            document.getElementsByTagName("html")[0].style.backgroundColor = "#778899";
            document.getElementById("board").style.backgroundColor = "#2196F3";
            document.getElementById("turn").textContent = "Player 1's turn";
        }
        else {
            document.getElementsByTagName("html")[0].style.backgroundColor = "#aa8484";
            document.getElementById("board").style.backgroundColor = "#f32121";
            document.getElementById("turn").textContent = "Player 2's turn";
        }
    }

    // updates win record display
    document.getElementById("score").innerHTML = `Player 1 wins: ${record.p1}<br>Player 2 wins: ${record.p2}<br>Ties: ${record.ties}`;

    // appends "play again" button
    if (winner) {
        const buttons = document.createElement("div");
        buttons.id = "start-buttons";

        const restartButton = document.createElement("button");
        restartButton.textContent = "Play again!";
        restartButton.setAttribute("onclick", "reset();");
        buttons.appendChild(restartButton);
        
        document.getElementById("turn").appendChild(buttons);

        saveRecord();
    }
    
    // applies X and O + associated background color to the game board according to the game state
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const cellId = document.getElementById(gameBoard.length * i + j);

            if (gameBoard[i][j] === 1) {
                cellId.textContent = "X";
                cellId.classList.add("x");
            } else if (gameBoard[i][j] === 2) {
                cellId.textContent = "O";
                cellId.classList.add("o");
            } else {
                cellId.textContent = "";
                cellId.classList.remove("x");
                cellId.classList.remove("o");
            }
        }
    }
}

// checks the value of the clicked cell
const cellCheck = function(cell) {
    return gameBoard[cell.row][cell.column];
}

// gets the coordinates of the clicked cell, triggered by click.  Triggers game logic by calling updateCell.
const getCellCoords = function(event) {
    const cell = {
        "row": Math.floor(Number(event.target.id)/3),
        "column": Math.floor(Number(event.target.id)%3)
    };

    updateCell(cell);
}

// triggers game logic
const updateCell = function(cell) {
    if (!cellCheck(cell) && !winner) {
        gameBoard[cell.row][cell.column] = turn;
        changeTurn();
        checkWinner();
        refreshDisplay();

        // causes "AI" to make its play
        if (mode === 2 && !winner) {
            if (turn === 1) {
                modifyEventHandlers("getCellCoords(event)");
            } else if (turn === 2) {
                modifyEventHandlers("");
                setTimeout(function() {
                    play();
                }, 1000);
            }
        } else if (mode === 3 && !winner) {
            if (turn === 2) {
                modifyEventHandlers("getCellCoords(event)");
            } else if (turn === 1) {
                modifyEventHandlers("");
                setTimeout(function() {
                    play();
                }, 1000);
            }
        } else if (mode === 4 && !winner) {
            setTimeout(function() {
                play();
            }, 900);
        }
    }
}

// check to see if there is a winner
const checkWinner = function() {
    const diagA = [];
    const diagB = [];
    let diagWin1A = true;
    let diagWin1B = true;
    let diagWin2A = true;
    let diagWin2B = true;

    // checks rows and columns
    for (let i = 0; i < gameBoard.length; i++) {
        const row = [];
        const column = [];
        let rowWin1 = true;
        let columnWin1 = true;
        let rowWin2 = true;
        let columnWin2 = true;

        diagA[diagA.length] = gameBoard[i][i];
        diagB[diagB.length] = gameBoard[i][2-i];

        for (let j = 0; j < gameBoard[i].length; j++) {
            row[row.length] = gameBoard[i][j];
            column[column.length] = gameBoard[j][i];
        }

        for (let k = 0; k < gameBoard.length; k++) {
            if (row[k] !== 1) {
                rowWin1 = false;
            }

            if (column[k] !== 1) {
                columnWin1 = false;
            }

            if (row[k] !== 2) {
                rowWin2 = false;
            }

            if (column[k] !== 2) {
                columnWin2 = false;
            }
        }

        if (rowWin1 || columnWin1) {
            winner = 1;
        } else if (rowWin2 || columnWin2) {
            winner = 2;
        }
    }

    // checks the two diagonals
    for (let i = 0; i < diagA.length; i++) {
        if (diagA[i] !== 1) {
            diagWin1A = false;
        }
        if (diagB[i] !== 1) {
            diagWin1B = false;
        }

        if (diagA[i] !== 2) {
            diagWin2A = false;
        }
        if (diagB[i] !== 2) {
            diagWin2B = false;
        }
    }

    if (diagWin1A || diagWin1B) {
        winner = 1;
    } else if (diagWin2A || diagWin2B) {
        winner = 2;
    // handle ties, eliminates checkTie function which was always unnecessary!
    } else if (turns === 9 && !winner) {
        winner = -1
    }
}

// ===========================
// === AI Tic Tac Toe code ===
// ===========================

// checks to see if a move would lead to winning or denying the other player a win
const twoOutOfThree = function(cellsArrayOfObj) {
    if (cellCheck(cellsArrayOfObj[0]) === 1 && cellCheck(cellsArrayOfObj[1]) === 1) {
        return 1;
    } else if (cellCheck(cellsArrayOfObj[0]) === 2 && cellCheck(cellsArrayOfObj[1]) === 2) {
        return 2;
    // added in to prevent suboptimal play (no need to play a cell that won't benefit the player)
    } else if ((cellCheck(cellsArrayOfObj[0]) === 1 && cellCheck(cellsArrayOfObj[1]) === 2) || (cellCheck(cellsArrayOfObj[0]) === 2 && cellCheck(cellsArrayOfObj[1]) === 1)) {
        return -1;
    } else {
        return 0;
    }
}

// === cellsInRow, cellsInColumn, cellsInDiagA, cellsInDiagB:  so not DRY.  todo:  refactor ===

// direction:  0 = row, 1 = column, 2 = diagA, 3 = diagB
const cellsInDir = function(row, col, direction) {
    let cells;

    if (direction === 0) {
        cells = [
            {"row": row, "column": 0},
            {"row": row, "column": 1},
            {"row": row, "column": 2}
        ];
    } else if (direction === 1) {
        cells = [
            {"row": 0, "column": col},
            {"row": 1, "column": col},
            {"row": 2, "column": col}
        ];
    } else if (direction === 2) {
        cells = [
            {"row": 0, "column": 0},
            {"row": 1, "column": 1},
            {"row": 2, "column": 2}
        ];
    } else if (direction === 3) {
        cells = [
            {"row": 0, "column": 2},
            {"row": 1, "column": 1},
            {"row": 2, "column": 0}
        ];
    }

    if (direction === 0) {
        for (let i = 0; i < cells.length; i++) {
            if (col === cells[i].column) {
                cells.splice(i, 1);
            }
        }
    } else {
        for (let i = 0; i < cells.length; i++) {
            if (row === cells[i].row) {
                cells.splice(i, 1);
            }
        }
    }

    return cells;
}

const play = function() {
    // score array holds all possible moves the AI can make
    const score = [
        {"score": 2, "valid": false, diagA: true, diagB: false},
        {"score": 1, "valid": false, diagA: false, diagB: false},
        {"score": 2, "valid": false, diagA: false, diagB: true},
        {"score": 1, "valid": false, diagA: false, diagB: false},
        {"score": 2, "valid": false, diagA: true, diagB: true},
        {"score": 1, "valid": false, diagA: false, diagB: false},
        {"score": 2, "valid": false, diagA: false, diagB: true},
        {"score": 1, "valid": false, diagA: false, diagB: false},
        {"score": 2, "valid": false, diagA: true, diagB: false},
    ];
    let maxScore = -Infinity;
    let maxIndex = 0;
    const equivalentPlays = [];
    const cellToPlay = {
        "row": 0,
        "column": 0
    };

    // iterate over the game board
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const index = gameBoard.length * i + j;
            const cellAsObj = {"row": i, "column": j};

            // if the cell is unplayed, modify its score
            if (gameBoard[i][j] === 0) {
                const row = cellsInDir(i, j, 0);
                const col = cellsInDir(i, j, 1);
                let diagA;
                let diagB;

                // bump cell score by 2 if playing that cell would block the row or match 3 in the row
                if (twoOutOfThree(row) === -1) {
                    score[index].score -= 1;
                } else if (twoOutOfThree(row) !== 0) {
                    score[index].score += 2;
                }
                // same as above, but for column
                if (twoOutOfThree(col) === -1) {
                    score[index].score -= 1;
                } else if (twoOutOfThree(col) !== 0) {
                    score[index].score += 2;
                }
                // if diagonal is applicable for the cell, perform the same logic as above
                if (score[index].diagA) {
                    diagA = cellsInDir(i, j, 2);

                    if (twoOutOfThree(diagA) === -1) {
                        score[index].score -= 1;
                    } else if (twoOutOfThree(diagA) !== 0) {
                        score[index].score += 2;
                    }
                }
                
                if (score[index].diagB) {
                    diagB = cellsInDir(i, j, 3);

                    if (twoOutOfThree(diagB) === -1) {
                        score[index].score -= 1;
                    } else if (twoOutOfThree(diagB) !== 0) {
                        score[index].score += 2;
                    }
                }
                // if the cell is playable, flag it as a valid play
                score[index].valid = true;
            }
        }
    }

    // increase diversity of AI moves by prioritizing the center later
    if (turns > 0) {
        score[4].score = 420;
    }

    // prevent edge case loss by increasing score of non-diagonal moves
    // this became necessary when I made the AI deprioritize playing the center cell
    if (gameBoard[0][0] === gameBoard[2][2] && gameBoard[0][0]) {
        score[1].score += 2;
        score[3].score += 2;
        score[5].score += 2;
        score[7].score += 2;
    }
    if (gameBoard[0][2] === gameBoard[2][0] && gameBoard[0][2]) {
        score[1].score += 2;
        score[3].score += 2;
        score[5].score += 2;
        score[7].score += 2;
    }

    // loop through the list of possible plays and find the best play
    for (let i = 0; i < score.length; i++) {
        if (score[i].score > maxScore && score[i].valid) {
            maxScore = score[i].score;
            maxIndex = i;
            equivalentPlays.length = 0;
            equivalentPlays[equivalentPlays.length] = i;
        // if there are plays that are tied for best possible play, store them in an array
        } else if (score[i].score === maxScore && score[i].valid) {
            equivalentPlays[equivalentPlays.length] = i;
        }
    }

    // if there are multiple plays that are tied for best, randomly pick one of those plays
    if (equivalentPlays.length > 1) {
        maxIndex = equivalentPlays[Math.floor(Math.random() * equivalentPlays.length)];
    }

    cellToPlay.row = Math.floor(maxIndex / 3);
    cellToPlay.column = maxIndex % 3;

    updateCell(cellToPlay);
} // end of "AI" code

// on page load, load from localStorage and render the rest of the page
window.onload = function() {
    loadRecord();
    reset();
}