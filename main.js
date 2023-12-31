/** @format */
import { humanSymbol, aiSymbol, hasWon, getAIMove } from "./ai.js";

const boardConfig = {
	size: 3,
};

function updateBoardSize(newSize) {
	boardConfig.size = newSize;
}

// utility functions
function initializeBoardState(boardConfig) {
	boardConfig = boardConfig || { size: 3 };
	return {
		filled: Array(boardConfig.size * boardConfig.size).fill(false),
		boardSymbols: Array(boardConfig.size * boardConfig.size).fill(""),
	};
}

function isBoardFull(board, playerSymbol, opponentSymbol) {
	return board.every(
		(cell) => cell === playerSymbol || cell === opponentSymbol,
	);
}

function updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount) {
	document.getElementById("humanWins").innerText = humanWinCount;
	document.getElementById("aiWins").innerText = aiWinCount;
	document.getElementById("draws").innerText = drawCount;
}

// game logic functions
function drawSymbolOnBox(context, player, box) {
	const canvasWidth = context.canvas.width;
	const canvasHeight = context.canvas.height;

	const lineWidth = canvasWidth * 0.1;
	const margin = canvasWidth * 0.1;
	const endPositionWidth = canvasWidth - margin;
	const endPositionHeight = canvasHeight - margin;

	if (player === humanSymbol) {
		box.style.backgroundColor = "#fb5181";
		context.beginPath();
		context.moveTo(margin, margin);
		context.lineTo(endPositionWidth, endPositionHeight);
		context.moveTo(endPositionWidth, margin);
		context.lineTo(margin, endPositionHeight);
		context.lineWidth = lineWidth;
		context.lineCap = "round";
		context.strokeStyle = "white";
		context.stroke();
	} else {
		box.style.backgroundColor = "#71e29c";
		const circleCenterWidth = canvasWidth / 2;
		const circleCenterHeight = canvasHeight / 2;
		const circleRadius = Math.min(canvasWidth, canvasHeight) / 1.75 - lineWidth;

		context.beginPath();
		context.arc(
			circleCenterWidth,
			circleCenterHeight,
			circleRadius,
			0,
			2 * Math.PI,
		);
		context.lineWidth = lineWidth;
		context.lineCap = "round";
		context.strokeStyle = "white";
		context.stroke();
	}
	boardSymbols[parseInt(box.id.replace("canvas", "")) - 1] = player;
	filled[parseInt(box.id.replace("canvas", "")) - 1] = true;
	turn++;
}

function checkForDraw() {
	if (isBoardFull(boardSymbols, humanSymbol, aiSymbol)) {
		document.getElementById("result").innerText =
			"It's a Draw! Click NEW GAME!";
		gameOver = true;
		drawCount++;
		updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount);
	}
}

function checkGameState(playerSymbol) {
	if (hasWon(boardSymbols, playerSymbol, boardConfig)) {
		if (playerSymbol === humanSymbol) {
			document.getElementById("result").innerText = "You won! Click NEW GAME!";
			humanWinCount++;
			updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount);
		} else {
			document.getElementById("result").innerText = "Max Won! Click NEW GAME!";
			aiWinCount++;
			updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount);
		}
		gameOver = true;
	} else {
		checkForDraw();
	}
}

function clearCompleteBoard() {
	for (let i = 1; i <= boardConfig.size * boardConfig.size; i++) {
		const canvas = document.getElementById("canvas" + i);
		if (canvas) {
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			canvas.style.backgroundColor = "";
		}
	}
	const boardElement = document.getElementById("board");
	while (boardElement.firstChild) {
		boardElement.removeChild(boardElement.lastChild);
	}
}

function handleBoxClick(boxId) {
	const num = parseInt(boxId.replace("canvas", "")) - 1;
	const box = document.getElementById(boxId);
	const context = box.getContext("2d");
	if (filled[num]) {
		showGameOverModal("This box is filled, please choose a different one.");
		return;
	}
	if (gameOver) {
		showGameOverModal("The game is over. Click NEW GAME to play again!");
		return;
	} // Human player's turn
	if (turn % 2 !== 0) {
		drawSymbolOnBox(context, humanSymbol, box);
		checkGameState(humanSymbol);
		if (!gameOver) {
			handleAIMove(boardSymbols, boardConfig);
		}
	}
}

function handleAIMove() {
	let gameMode = document.getElementById("gameMode").value;
	gameMode = gameMode || "easy";
	const boxId = getAIMove(boardSymbols, boardConfig, gameMode);
	console.log("Returned boxId:", boxId);
	const box = document.getElementById(boxId);
	if (!box) {
		console.error("No canvas found for the provided boxId:", boxId);
		return;
	}
	const context = box.getContext("2d");
	drawSymbolOnBox(context, aiSymbol, box);
	checkGameState(aiSymbol);
	if (gameOver) {
		return;
	}
}

function setupBoard(size = boardConfig.size) {
	const boardDiv = document.getElementById("board");
	boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
	boardDiv.innerHTML = "";
	for (let i = 1; i <= size * size; i++) {
		const canvas = document.createElement("canvas");
		canvas.id = "canvas" + i;
		boardDiv.appendChild(canvas);
	}
}

const FIRST_PLAYER_CHANCE = 0.5;
let humanWinCount = 0,
	aiWinCount = 0,
	drawCount = 0,
	turn = 1,
	{ filled, boardSymbols } = initializeBoardState(),
	gameOver = false;

let elements = {
	board: document.getElementById("board"),
	gameOverModal: document.getElementById("gameOverModal"),
	gameOverMessage: document.querySelector("#modalOverlay p"),
	modalOverlay: document.getElementById("modalOverlay"),
	result: document.getElementById("result"),
};

let closeSpan = document.querySelector(".close");

closeSpan.onClick = function () {
	elements.modalOverlay.style.display = "none";
};

window.onclick = function (event) {
	if (event.target == elements.modalOverlay) {
		elements.modalOverlay.style.display = "none";
	}
};

function openModal() {
	elements.modalOverlay.style.display = "block";
}

// game state management functions
function resetBoardAndGameState() {
	clearCompleteBoard();
	filled = Array(boardConfig.size * boardConfig.size).fill(false);
	boardSymbols = Array(boardConfig.size * boardConfig.size).fill("");
	gameOver = false;
	elements.result.innerText = "";
	setupBoard();
}

function resetGameState() {
	turn = 1;
	gameOver = false;
	elements.result.innerText = "";
}

function newGame() {
	closeGameOverModal();
	resetBoardAndGameState();
	resetGameState();
	const randomPlayer = Math.random() < FIRST_PLAYER_CHANCE ? "human" : "ai";
	if (randomPlayer === "human") {
		turn = 1;
	} else {
		turn = 0;
		handleAIMove(boardSymbols, boardConfig);
	}
}

function initializeModal() {
	elements.modalOverlay.style.display = "none";
	elements.gameOverModal.style.display = "none";
}

function showGameOverModal(message) {
	elements.gameOverMessage.textContent = message;
	elements.modalOverlay.style.display = "block";
	elements.gameOverModal.style.display = "block";
}

function closeGameOverModal() {
	elements.modalOverlay.style.display = "none";
}

function handleClickOutsideModal(event) {
	if (event.target === elements.modalOverlay) {
		closeGameOverModal();
	}
}

function drawNewBoard() {
	clearCompleteBoard();
	resetBoardAndGameState();
	setupBoard();
}

// event listeners and main logic
window.addEventListener("DOMContentLoaded", function () {
	elements = {
		board: document.getElementById("board"),
		gameOverModal: document.getElementById("gameOverModal"),
		gameOverMessage: document.querySelector("#modalOverlay p"),
		modalOverlay: document.getElementById("modalOverlay"),
		result: document.getElementById("result"),
	};

	document
		.querySelector(".close")
		.addEventListener("click", closeGameOverModal);
	elements.modalOverlay.addEventListener("click", handleClickOutsideModal);

	document.querySelectorAll('input[name="boardSize"]').forEach((radio) => {
		radio.addEventListener("change", (event) => {
			const newSize = parseInt(event.target.value, 10);
			updateBoardSize(newSize);
			drawNewBoard();
		});
	});

	document.getElementById("gameMode").addEventListener("change", function (e) {
		const validModes = ["classic", "easy", "random"];
		if (!validModes.includes(e.target.value)) {
			showGameOverModal(
				"Invalid game mode selected. Please choose a valid game mode.",
			);
			e.target.value = "classic";
		}
	});
	document.getElementById("newGameButton").addEventListener("click", newGame);
	document.getElementById("resetButton").addEventListener("click", function () {
		humanWinCount = aiWinCount = drawCount = 0;
		updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount);
	});
	elements.board.addEventListener("click", function (e) {
		handleBoxClick(e.target.id);
	});

	initializeModal(boardConfig.size);
	setupBoard(boardConfig.size);
	newGame();
	document.getElementById("size" + boardConfig.size).checked = true;
});
