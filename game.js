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
let inverseTurn = 2;

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
    button3.setAttribute("onclick", "mode=3;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(function(){play(true)},500)");
    button4.textContent = "Spectate CPU vs CPU";
    button4.setAttribute("onclick", "mode=4;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(function(){play(true)},900)");

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
        inverseTurn--;
    } else {
        playSound("o.webm");
        turn--;
        inverseTurn++;
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

// blinks cell
const blink = function(cellId, turn, numBlinks) {
    let colorClass;

    if (turn === 1) {
        colorClass = "xWin";
    } else {
        colorClass = "oWin";
    }

    for (let i = 0; i < numBlinks; i++) {
        setTimeout(function() {
            document.getElementById(String(cellId)).classList.add(colorClass);
            setTimeout(function() {
                document.getElementById(String(cellId)).classList.remove(colorClass)
            }, 250);
        }, 500*i);
    }
}

// I admit this is poorly named.  Only the very last part of the function is refreshDisplay.
// This function also handles determining wins or draws.
// updates game display (background color, whose turn it is, who won or game tied, and the state of the board itself)
const refreshDisplay = function() {
    // intentionally using var here (because const is block scoped)
    var turnId = document.getElementById("turn");
    var html = document.getElementsByTagName("html")[0];
    var board = document.getElementById("board");
    
    // appends game status text and changes the page and board colors
    if (winner === 1) {
        record.p1++;
        turnId.textContent = "Player 1 wins";
        html.style.backgroundColor = "#778899";
        board.style.backgroundColor = "#2196F3";
    } else if (winner === 2) {
        record.p2++;
        turnId.textContent = "Player 2 wins";
        html.style.backgroundColor = "#aa8484";
        board.style.backgroundColor = "#f32121";
    } else if (winner === -1) {
        record.ties++;
        turnId.textContent = "Tied game";
        html.style.backgroundColor = "#c4fcc2";
        board.style.backgroundColor = "#36fc2f";
    } else if (!winner && mode) {
        // if I used const for turnId, html, and board, they wouldn't be defined here!

        const buttonList = document.createElement("div");
        buttonList.id = "start-buttons";

        const hint = document.createElement("button");
        hint.textContent = "Give me a hint!";
        hint.setAttribute("onclick", "play(false)");

        buttonList.appendChild(hint);

        if (turn === 1) {
            html.style.backgroundColor = "#778899";
            board.style.backgroundColor = "#2196F3";
            turnId.textContent = "Player 1's turn";
            if (mode === 2) {
                turnId.appendChild(buttonList);
            }
            if (mode === 3) {
                hint.disabled = true;
                turnId.appendChild(buttonList);
            }
        }
        else {
            html.style.backgroundColor = "#aa8484";
            board.style.backgroundColor = "#f32121";
            turnId.textContent = "Player 2's turn";
            if (mode === 2) {
                hint.disabled = true;
                turnId.appendChild(buttonList);
            }
            if (mode === 3) {
                turnId.appendChild(buttonList);
            }
        }

        if (mode === 1) {
            turnId.appendChild(buttonList);
        }
    }

    // updates win record display
    document.getElementById("score").innerHTML = `Player 1 wins: ${record.p1}<br>Player 2 wins: ${record.p2}<br>Ties: ${record.ties}`;

    // appends "play again" button and saves win/loss record to localStorage
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
            const cellId = document.getElementById(String(gameBoard.length * i + j));

            if (gameBoard[i][j] === 1) {
                cellId.textContent = "X";
                cellId.classList.add("x");
            } else if (gameBoard[i][j] === 2) {
                cellId.textContent = "O";
                cellId.classList.add("o");
            } else {
                cellId.textContent = "";
                cellId.classList.remove("x", "xWin", "o", "oWin");
            }
        }
    }
}

// checks the value of the clicked cell
const cellCheck = function(cell, target) {
    if (!target) {
        return gameBoard[cell.row][cell.column];
    } else {
        return target[cell.row][cell.column];
    }
}

// gets the coordinates of the clicked cell, triggered by click.  Triggers game logic by calling updateCell.
const getCellCoords = function(event) {
    const cell = {
        "row": Math.floor(Number(event.target.id)/3),
        "column": Math.floor(Number(event.target.id)%3),
        "cellId": event.target.id
    };

    updateCell(cell);
}

// triggers game logic
const updateCell = function(cell) {
    if (!cellCheck(cell) && !winner) {
        gameBoard[cell.row][cell.column] = turn;
        blink(cell.cellId, turn, 1);
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
                    play(true);
                }, 1000);
            }
        } else if (mode === 3 && !winner) {
            if (turn === 2) {
                modifyEventHandlers("getCellCoords(event)");
            } else if (turn === 1) {
                modifyEventHandlers("");
                setTimeout(function() {
                    play(true);
                }, 1000);
            }
        } else if (mode === 4 && !winner) {
            setTimeout(function() {
                play(true);
            }, 900);
        }
    }
}

// check to see if there is a winner
const checkWinner = function() {
    const diagA = [];
    const diagB = [];
    let diagWin1A = false;
    let diagWin1B = false;
    let diagWin2A = false;
    let diagWin2B = false;

    var highlightCells = function(index, typeOfWin) {
        let cells;

        if (typeOfWin === 1) {
            cells = [index * gameBoard.length, index * gameBoard.length + 1, index * gameBoard.length + 2];
        } else if (typeOfWin === 2) {
            cells = [index, gameBoard.length + index, 2 * gameBoard.length + index];
        } else if (typeOfWin === 3) {
            cells = [0, 4, 8];
        } else if (typeOfWin === 4) {
            cells = [2, 4, 6];
        }

        for (let i = 0; i < cells.length; i++) {
            blink(cells[i], inverseTurn, 6);
        }
    }

    // checks rows and columns
    for (let i = 0; i < gameBoard.length; i++) {
        const row = [];
        const column = [];
        let rowWin1 = false;
        let columnWin1 = false;
        let rowWin2 = false;
        let columnWin2 = false;

        diagA[diagA.length] = gameBoard[i][i];
        diagB[diagB.length] = gameBoard[i][2-i];

        for (let j = 0; j < gameBoard[i].length; j++) {
            row[row.length] = gameBoard[i][j];
            column[column.length] = gameBoard[j][i];
        }

        if (row[0] === 1 && row[1] === 1 && row[2] === 1) {
            rowWin1 = true;
            highlightCells(i, 1);
        }

        if (column[0] === 1 && column[1] === 1 && column[2] === 1) {
            columnWin1 = true;
            highlightCells(i, 2);
        }

        if (row[0] === 2 && row[1] === 2 && row[2] === 2) {
            rowWin2 = true;
            highlightCells(i, 1);
        }

        if (column[0] === 2 && column[1] === 2 && column[2] === 2) {
            columnWin2 = true;
            highlightCells(i, 2);
        }

        if (rowWin1 || columnWin1) {
            winner = 1;
        } else if (rowWin2 || columnWin2) {
            winner = 2;
        }
    }

    // checks the two diagonals
    if (diagA[0] === 1 && diagA[1] === 1 && diagA[2] === 1) {
        diagWin1A = true;
        highlightCells(0, 3, "xWin");
    }
    if (diagB[0] === 1 && diagB[1] === 1 && diagB[2] === 1) {
        diagWin1B = true;
        highlightCells(0, 4, "xWin");
    }

    if (diagA[0] === 2 && diagA[1] === 2 && diagA[2] === 2) {
        diagWin2A = true;
        highlightCells(0, 3, "oWin");
    }
    if (diagB[0] === 2 && diagB[1] === 2 && diagB[2] === 2) {
        diagWin2B = true;
        highlightCells(0, 4, "oWin");
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
const twoOutOfThree = function(cellsArrayOfObj, altTarget) {
    if (cellCheck(cellsArrayOfObj[0], altTarget) === 1 && cellCheck(cellsArrayOfObj[1], altTarget) === 1) {
        return 1;
    } else if (cellCheck(cellsArrayOfObj[0], altTarget) === 2 && cellCheck(cellsArrayOfObj[1], altTarget) === 2) {
        return 2;
    // added in to prevent suboptimal play (no need to play a cell that won't benefit the player)
    } else if ((cellCheck(cellsArrayOfObj[0], altTarget) === 1 && cellCheck(cellsArrayOfObj[1], altTarget) === 2) || (cellCheck(cellsArrayOfObj[0], altTarget) === 2 && cellCheck(cellsArrayOfObj[1], altTarget) === 1)) {
        return -1;
    }
     else {
        return 0;
    }
}

// code specifically to make it so AI can play non-diagonal + non-center cell in turn 1 without losing
const emptyLine = function(cellsArrayOfObj) {
    const cell0 = gameBoard[cellsArrayOfObj[0].row][cellsArrayOfObj[0].column];
    const cell1 = gameBoard[cellsArrayOfObj[1].row][cellsArrayOfObj[1].column];
    const cell2 = gameBoard[cellsArrayOfObj[2].row][cellsArrayOfObj[2].column];

    if (!cell0 && !cell1 && !cell2) {
        return true;
    } else {
        return false;
    }
}

// dir:  0 = row, 1 = column, 2 = diagA, 3 = diagB
const cellsInDir = function(row, col, dir, remove) {
    let cells;

    if (dir === 0) {
        cells = [
            {"row": row, "column": 0},
            {"row": row, "column": 1},
            {"row": row, "column": 2}
        ];
    } else if (dir === 1) {
        cells = [
            {"row": 0, "column": col},
            {"row": 1, "column": col},
            {"row": 2, "column": col}
        ];
    } else if (dir === 2) {
        cells = [
            {"row": 0, "column": 0},
            {"row": 1, "column": 1},
            {"row": 2, "column": 2}
        ];
    } else if (dir === 3) {
        cells = [
            {"row": 0, "column": 2},
            {"row": 1, "column": 1},
            {"row": 2, "column": 0}
        ];
    }

    if (remove) {
        if (dir === 0) {
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
    }
    
    return cells;
}

const play = function(actuallyPlay) {
    // score array holds all possible moves the AI can make
    const score = [
        {"score": 0, "valid": false, diagA: true, diagB: false},
        {"score": 0, "valid": false, diagA: false, diagB: false},
        {"score": 0, "valid": false, diagA: false, diagB: true},
        {"score": 0, "valid": false, diagA: false, diagB: false},
        {"score": 0, "valid": false, diagA: true, diagB: true},
        {"score": 0, "valid": false, diagA: false, diagB: false},
        {"score": 0, "valid": false, diagA: false, diagB: true},
        {"score": 0, "valid": false, diagA: false, diagB: false},
        {"score": 0, "valid": false, diagA: true, diagB: false},
    ];
    let maxScore = -Infinity;
    let maxIndex = 0;
    const equivalentPlays = [];
    const cellToPlay = {
        "row": 0,
        "column": 0,
        "cellId": 0
    };

    // iterate over the game board
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const index = gameBoard.length * i + j;

            // if the cell is unplayed, modify its score
            if (gameBoard[i][j] === 0) {
                const row = cellsInDir(i, j, 0, true);
                const col = cellsInDir(i, j, 1, true);
                let diagA;
                let diagB;
                let gameBoardCopy;
                
                // this looks ahead by 1 turn (in other words, it plays every possible play and scores the board position)
                if (featureToggle.lookAhead) {
                    gameBoardCopy = [...gameBoard];
                    gameBoardCopy[i][j] = turn;
                    const diagAAhead = cellsInDir(1, 1, 2, false);
                    const diagBAhead = cellsInDir(1, 1, 3, false);

                    if (score[index].diagA) {
                        if (twoOutOfThree([diagAAhead[0], diagAAhead[1]], gameBoardCopy) === turn && diagAAhead[2] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([diagAAhead[0], diagAAhead[2]], gameBoardCopy) === turn && diagAAhead[1] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([diagAAhead[1], diagAAhead[2]], gameBoardCopy) === turn && diagAAhead[0] !== inverseTurn) {
                            score[index].score += 2;
                        }
                    }
                    
                    if (score[index].diagB) {
                        if (twoOutOfThree([diagBAhead[0], diagBAhead[1]], gameBoardCopy) === turn && diagBAhead[2] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([diagBAhead[0], diagBAhead[2]], gameBoardCopy) === turn && diagBAhead[1] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([diagBAhead[1], diagBAhead[2]], gameBoardCopy) === turn && diagBAhead[0] !== inverseTurn) {
                            score[index].score += 2;
                        }
                    }

                    for (let k = 0; k < gameBoard.length; k++) {
                        const rowAhead = cellsInDir(k, k, 0, false);
                        const colAhead = cellsInDir(k, k, 1, false);

                        if (twoOutOfThree([rowAhead[0], rowAhead[1]], gameBoardCopy) === turn && rowAhead[2] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([rowAhead[0], rowAhead[2]], gameBoardCopy) === turn && rowAhead[1] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([rowAhead[1], rowAhead[2]], gameBoardCopy) === turn && rowAhead[0] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([colAhead[0], colAhead[1]], gameBoardCopy) === turn && colAhead[2] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([colAhead[0], colAhead[2]], gameBoardCopy) === turn && colAhead[1] !== inverseTurn) {
                            score[index].score += 2;
                        }
                        if (twoOutOfThree([colAhead[1], colAhead[2]], gameBoardCopy) === turn && colAhead[0] !== inverseTurn) {
                            score[index].score += 2;
                        }
                    }

                    gameBoardCopy[i][j] = 0;
                }

                // bump cell score if playing that cell would block the row or match 3 in the row
                if (twoOutOfThree(row) === -1) {
                    // don't make futile plays
                    score[index].score -= 1;
                } else if (twoOutOfThree(row) !== turn && twoOutOfThree(row) !== 0) {
                    // it's very important to block
                    score[index].score += 9;
                } else if (twoOutOfThree(row) === turn && twoOutOfThree(row) !== 0) {
                    // but it's more important to win
                    score[index].score += 10;
                }
                // same as above, but for column
                if (twoOutOfThree(col) === -1) {
                    score[index].score -= 1;
                } else if (twoOutOfThree(col) !== turn && twoOutOfThree(col) !== 0) {
                    score[index].score += 9;
                } else if (twoOutOfThree(col) === turn && twoOutOfThree(col) !== 0) {
                    score[index].score += 10;
                }
                // if diagonal is applicable for the cell, perform the same logic as above
                if (score[index].diagA) {
                    diagA = cellsInDir(i, j, 2, true);

                    if (twoOutOfThree(diagA) === -1) {
                        // this is not a mistake, as diagonals are different.  make the AI set up a trap.
                        score[index].score += 1;
                    } else if (twoOutOfThree(diagA) !== turn && twoOutOfThree(diagA) !== 0) {
                        score[index].score += 9;
                    } else if (twoOutOfThree(diagA) === turn && twoOutOfThree(diagA) !== 0) {
                        score[index].score += 10;
                    }
                }
                if (score[index].diagB) {
                    diagB = cellsInDir(i, j, 3, true);

                    if (twoOutOfThree(diagB) === -1) {
                        score[index].score += 1;
                    } else if (twoOutOfThree(diagB) !== turn && twoOutOfThree(diagB) !== 0) {
                        score[index].score += 9;
                    } else if (twoOutOfThree(diagB) === turn && twoOutOfThree(diagB) !== 0) {
                        score[index].score += 10;
                    }
                }

                // code specifically to make it so AI can play non-diagonal + non-center cell in turn 1 without losing
                if (((i === 0 && j === 0) || (i === 2 && j === 2)) && turns === 3) {
                    const emptyRowCandidateTop = cellsInDir(0, 0, 0, false);
                    const emptyRowCandidateBottom = cellsInDir(2, 2, 0, false);
                    const emptyColCandidateLeft = cellsInDir(0, 0, 1, false);
                    const emptyColCandidateRight = cellsInDir(2, 2, 1, false);
                    
                    var decreaseLineScore = function(cellsArrayOfObj) {
                        for (let i = 0; i < cellsArrayOfObj.length; i++) {
                            const cellId = cellsArrayOfObj[i].row * gameBoard.length + cellsArrayOfObj[i].column;
                        
                            score[cellId].score -= 1;
                        }
                    }

                    if (emptyLine(emptyRowCandidateTop) && !emptyLine(emptyRowCandidateBottom)) {
                        if (!emptyLine(emptyColCandidateLeft) && !emptyLine(emptyColCandidateRight)) {
                            decreaseLineScore(emptyRowCandidateTop);
                        } else if (!emptyLine(emptyColCandidateLeft)) {
                            decreaseLineScore(emptyRowCandidateTop);
                            decreaseLineScore(emptyColCandidateRight);
                        } else if (!emptyLine(emptyColCandidateRight)) {
                            decreaseLineScore(emptyRowCandidateTop);
                            decreaseLineScore(emptyColCandidateLeft);
                        }
                    } else if (!emptyLine(emptyRowCandidateTop) && emptyLine(emptyRowCandidateBottom)) {
                        if (!emptyLine(emptyColCandidateLeft) && !emptyLine(emptyColCandidateRight)) {
                            decreaseLineScore(emptyRowCandidateBottom);
                        } else if (!emptyLine(emptyColCandidateLeft)) {
                            decreaseLineScore(emptyRowCandidateBottom);
                            decreaseLineScore(emptyColCandidateRight);
                        } else if (!emptyLine(emptyColCandidateRight)) {
                            decreaseLineScore(emptyRowCandidateBottom);
                            decreaseLineScore(emptyColCandidateLeft);
                        }
                    } else if (emptyLine(emptyColCandidateLeft) && !emptyLine(emptyColCandidateRight)) {
                        if (!emptyLine(emptyRowCandidateTop) && !emptyLine(emptyRowCandidateBottom)) {
                            decreaseLineScore(emptyColCandidateLeft);
                        } else if (!emptyLine(emptyRowCandidateTop)) {
                            decreaseLineScore(emptyColCandidateLeft);
                            decreaseLineScore(emptyRowCandidateBottom);
                        } else if (!emptyLine(emptyRowCandidateBottom)) {
                            decreaseLineScore(emptyColCandidateLeft);
                            decreaseLineScore(emptyRowCandidateTop);
                        }
                    } else if (!emptyLine(emptyColCandidateLeft) && emptyLine(emptyColCandidateRight)) {
                        if (!emptyLine(emptyRowCandidateTop) && !emptyLine(emptyRowCandidateBottom)) {
                            decreaseLineScore(emptyColCandidateRight);
                        } else if (!emptyLine(emptyRowCandidateTop)) {
                            decreaseLineScore(emptyColCandidateRight);
                            decreaseLineScore(emptyRowCandidateBottom);
                        } else if (!emptyLine(emptyRowCandidateBottom)) {
                            decreaseLineScore(emptyColCandidateRight);
                            decreaseLineScore(emptyRowCandidateTop);
                        }
                    }
                }

                // if the cell is playable, flag it as a valid play
                score[index].valid = true;
            }
        }
    }

    // increase diversity of AI moves by prioritizing the center later
    if (turns === 1) {
        score[4].score += 420;
    }

    // increase value of corners and center after the first turn
    if (turns > 0) {
        score[0].score += 1;
        score[2].score += 1;
        score[4].score += 1;
        score[6].score += 1;
        score[8].score += 1;
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

    cellToPlay.row = Math.floor(maxIndex / gameBoard.length);
    cellToPlay.column = maxIndex % gameBoard.length;
    cellToPlay.cellId = maxIndex;

    console.log("Turn:", turns);
    console.log(`Play: ${cellToPlay.row}, ${cellToPlay.column}`);
    console.log(score);
    console.log("");

    if (actuallyPlay) {
        updateCell(cellToPlay);
    } else {
        for (let i = 0; i < equivalentPlays.length; i++) {
            blink(equivalentPlays[i], turn, 3);
        }
    }
    
} // end of "AI" code

// on page load, load from localStorage and render the rest of the page
window.onload = function() {
    loadRecord();
    reset();
}

window.ondragstart = function() { return false; } 