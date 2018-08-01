"use strict";

// 0 = empty
// 1 = player 1, plays as X
// 2 = player 2, plays as O
const gameBoard = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

// tracks whose turn it is
let turn = 1;

// tracks number of turns elapsed
let turns = 0;

// tracks winner.  0 = game in progress, 1 = p1 win, 2 = p2 win, -1 = tied game
let winner = 0;

// tracks human vs human, human vs cpu, cpu vs human, or cpu vs cpu
// 0 = not started, 1 = PvP, 2 = PvC, 3 = CvP, 4 = CvC
let mode = 0;

// flips turn
const changeTurn = function() {
    if (turn === 1) {
        turn = 2;
    } else {
        turn = 1;
    }

    turns++;
}

// updates game display
const refreshDisplay = function() {
    if (winner === 1) {
        document.getElementById("turn").textContent = "Player 1 wins";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#778899";
        document.getElementById("board").style.backgroundColor = "#2196F3";
    } else if (winner === 2) {
        document.getElementById("turn").textContent = "Player 2 wins";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#aa8484";
        document.getElementById("board").style.backgroundColor = "#f32121";
    } else if (winner === -1) {
        document.getElementById("turn").textContent = "Tied game";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#c4fcc2";
        document.getElementById("board").style.backgroundColor = "#36fc2f";
    } else if (!winner) {
        if (turn === 1) {
            document.getElementsByTagName("body")[0].style.backgroundColor = "#778899";
            document.getElementById("board").style.backgroundColor = "#2196F3";
            document.getElementById("turn").textContent = "Player 1's turn";
        }
        else {
            document.getElementsByTagName("body")[0].style.backgroundColor = "#aa8484";
            document.getElementById("board").style.backgroundColor = "#f32121";
            document.getElementById("turn").textContent = "Player 2's turn";
        }
    }
        
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const cellId = 3 * i + j;

            if (gameBoard[i][j] === 1) {
                document.getElementById(cellId).textContent = "X";
                document.getElementById(cellId).style.backgroundColor = "#778899";
            } else if (gameBoard[i][j] === 2) {
                document.getElementById(cellId).textContent = "O";
                document.getElementById(cellId).style.backgroundColor = "#aa8484";
            }
        }
    }
}

// checks the value of the clicked cell
const cellCheck = function(cell) {
    return gameBoard[cell.row][cell.column];
}

// gets the coordinates of the clicked cell, triggered by click
const getCellCoords = function(event) {
    const cell = {
        "row": Math.floor(Number(event.target.id)/3),
        "column": Math.floor(Number(event.target.id)%3)
    };

    console.log(`You clicked row: ${cell.row}, column: ${cell.column}`);
    console.log(cellCheck(cell));
    updateCell(cell);
}

// triggers game logic
const updateCell = function(cell) {
    if (!cellCheck(cell) && !winner) {
        gameBoard[cell.row][cell.column] = turn;
        checkWinner();
        checkTie();
        changeTurn();
        refreshDisplay();

        if (mode === 2  && turn === 2) {
            play();
        } else if (mode === 3 && turn === 1) {
            play();
        } else if (mode === 4) {
            setTimeout(function() {
                play();
            }, 200);
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

    for (let i = 0; i < gameBoard.length; i++) {
        const row = [];
        const column = [];
        let rowWin1 = true;
        let columnWin1 = true;
        let rowWin2 = true;
        let columnWin2 = true;

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

    for (let i = 0; i < gameBoard.length; i++) {
        diagA[diagA.length] = gameBoard[i][i];
        diagB[diagB.length] = gameBoard[i][2-i];
    }

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
    }

    if (winner === 1) {
        console.log("Player 1 wins");
    } else if (winner === 2) {
        console.log("Player 2 wins");
    }
}

// check to see if the game ended in a tied state
const checkTie = function() {
    let tie = true;

    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] === 0) {
                tie = false; 
            }
        }
    }

    if (tie) {
        console.log("Tied game.");
        winner = -1;
    }
}

// ===========================
// === AI Tic Tac Toe code ===
// ===========================

const twoOutOfThree = function(cellsArrayOfObj) {
    if (cellCheck(cellsArrayOfObj[0]) === 1 && cellCheck(cellsArrayOfObj[1]) === 1) {
        return 1;
    } else if (cellCheck(cellsArrayOfObj[0]) === 2 && cellCheck(cellsArrayOfObj[1]) === 2) {
        return 2;
    } else {
        return 0;
    }
}

// cellsInRow, cellsInColumn, cellsInDiagA, cellsInDiagB:  so not DRY.  todo:  refactor

const cellsInRow = function(input) {
    const cells = [
        {"row": input.row, "column": 0},
        {"row": input.row, "column": 1},
        {"row": input.row, "column": 2}
    ];

    for (let i = 0; i < cells.length; i++) {
        if (input.column === cells[i].column) {
            cells.splice(i, 1);
        }
    }

    return cells;
}

const cellsInColumn = function(input) {
    const cells = [
        {"row": 0, "column": input.column},
        {"row": 1, "column": input.column},
        {"row": 2, "column": input.column}
    ];

    for (let i = 0; i < cells.length; i++) {
        if (input.row === cells[i].row) {
            cells.splice(i, 1);
        }
    }

    return cells;
}

const cellsInDiagA = function(input) {
    const cells = [
        {"row": 0, "column": 0},
        {"row": 1, "column": 1},
        {"row": 2, "column": 2}
    ];

    for (let i = 0; i < cells.length; i++) {
        if (input.row === cells[i].row) {
            cells.splice(i, 1);
        }
    }

    return cells;
}

const cellsInDiagB = function(input) {
    const cells = [
        {"row": 0, "column": 2},
        {"row": 1, "column": 1},
        {"row": 2, "column": 0}
    ];

    for (let i = 0; i < cells.length; i++) {
        if (input.row === cells[i].row) {
            cells.splice(i, 1);
        }
    }

    return cells;
}

const play = function() {
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
    let maxScore = 0;
    let maxIndex = 0;
    const equivalentPlays = [];
    const cellToPlay = {
        "row": 0,
        "column": 0
    };

    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const index = 3 * i + j;
            const cellAsObj = {"row": i, "column": j};

            if (gameBoard[i][j] === 0) {
                const row = cellsInRow(cellAsObj);
                const col = cellsInColumn(cellAsObj);
                let diagA;
                let diagB;

                if (twoOutOfThree(row) !== 0) {
                    score[index].score += 2;
                }

                if (twoOutOfThree(col) !== 0) {
                    score[index].score += 2;
                }

                if (score[index].diagA) {
                    diagA = cellsInDiagA(cellAsObj);

                    if (twoOutOfThree(diagA) !== 0) {
                        score[index].score += 2;
                    }
                }
                
                if (score[index].diagB) {
                    diagB = cellsInDiagB(cellAsObj);

                    if (twoOutOfThree(diagB) !== 0) {
                        score[index].score += 2;
                    }
                }

                score[index].valid = true;
            }
        }
    }

    if (turns > 1) {
        score[4].score = 420;
    }

    for (let i = 0; i < score.length; i++) {
        if (score[i].score > maxScore && score[i].valid) {
            maxScore = score[i].score;
            maxIndex = i;
            equivalentPlays.length = 0;
            equivalentPlays[equivalentPlays.length] = i;
        } else if (score[i].score === maxScore && score[i].valid) {
            equivalentPlays[equivalentPlays.length] = i;
        }
    }

    if (equivalentPlays.length > 1) {
        maxIndex = equivalentPlays[Math.floor(Math.random() * equivalentPlays.length)];
    }

    cellToPlay.row = Math.floor(maxIndex / 3);
    cellToPlay.column = maxIndex % 3;

    console.log(turns);

    updateCell(cellToPlay);
}