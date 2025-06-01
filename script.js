document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");
  const sizeSelect = document.getElementById("size");
  const newGameButton = document.getElementById("new-game");
  const undoButton = document.getElementById("undo-move");

  // Game State
  let boardSize = 3;
  let board = [];
  let moveHistory = [];
  let currentPlayer = "X";
  let gameActive = true;

  // Initialize Game
  function initGame() {
    boardSize = parseInt(sizeSelect.value);
    board = Array(boardSize)
      .fill()
      .map(() => Array(boardSize).fill(""));
    currentPlayer = "X";
    gameActive = true;
    moveHistory = [];

    renderBoard();
    updateStatus(`Player ${currentPlayer}'s turn`);
    updateUndoButton();
  }

  // Render Board
  function renderBoard() {
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.innerHTML = "";

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.textContent = board[row][col];
        cell.addEventListener("click", handleCellClick);
        boardElement.appendChild(cell);
      }
    }
  }

  // Handle Cell Click
  function handleCellClick(e) {
    if (!gameActive) return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (board[row][col] !== "") return;

    // Save move to history
    moveHistory.push({
      board: board.map((row) => [...row]),
      currentPlayer,
      row,
      col,
    });

    // Make move
    board[row][col] = currentPlayer;
    e.target.textContent = currentPlayer;

    // Check game state
    if (checkWin(row, col)) {
      updateStatus(`Player ${currentPlayer} wins!`);
      gameActive = false;
    } else if (checkDraw()) {
      updateStatus("Game ended in a draw!");
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus(`Player ${currentPlayer}'s turn`);
    }

    updateUndoButton();
  }

  // Undo Functionality
  function undoMove() {
    if (moveHistory.length === 0 || !gameActive) return;

    const lastMove = moveHistory.pop();
    board = lastMove.board;
    currentPlayer = lastMove.currentPlayer;

    renderBoard();
    updateStatus(`Player ${currentPlayer}'s turn (undo)`);
    updateUndoButton();
  }

  // Game Logic
  function checkWin(row, col) {
    return (
      checkConsecutive(row, 0, 0, 1) || // Check row
      checkConsecutive(0, col, 1, 0) || // Check column
      (row === col && checkConsecutive(0, 0, 1, 1)) || // Check diagonal 1
      (row + col === boardSize - 1 && checkConsecutive(0, boardSize - 1, 1, -1)) // Check diagonal 2
    );
  }

  function checkConsecutive(startRow, startCol, rowIncrement, colIncrement) {
    let count = 0;
    let row = startRow;
    let col = startCol;

    while (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
      if (board[row][col] === currentPlayer) {
        count++;
        if (count === 3) return true;
      } else {
        count = 0;
      }
      row += rowIncrement;
      col += colIncrement;
    }
    return false;
  }

  function checkDraw() {
    return board.every((row) => row.every((cell) => cell !== ""));
  }

  // UI Updates
  function updateStatus(message) {
    statusElement.textContent = message;
  }

  function updateUndoButton() {
    undoButton.disabled = moveHistory.length === 0 || !gameActive;
  }

  // Event Listeners
  newGameButton.addEventListener("click", initGame);
  sizeSelect.addEventListener("change", initGame);
  undoButton.addEventListener("click", undoMove);

  // Initialize
  initGame();
});
