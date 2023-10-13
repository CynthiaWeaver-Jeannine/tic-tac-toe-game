/** @format */

import {
	humanSymbol,
	aiSymbol,
	boardConfig,
	hasWon,
	getAIMove
} from "./ai.js";

window.addEventListener("DOMContentLoaded", function () {
	let humanWinCount = 0;
	let aiWinCount = 0;
	const FIRST_PLAYER_CHANCE = 0.5;

	// initial state
	let filled = Array(boardConfig.size * boardConfig.size).fill(false);
	let boardSymbols = Array(boardConfig.size * boardConfig.size).fill("");
	let turn = 1;
	let gameOver = false;

	function consistencyCheck() {
		if (filled.length !== boardConfig.size * boardConfig.size) {
			console.error('Inconsistency detected in "filled" array size!');
		}
		if (boardSymbols.length !== boardConfig.size * boardConfig.size) {
			console.error('Inconsistency detected in "boardSymbols" array size!');
		}
	}

	function clearOldBoard() {
		for (let i = 1; i <= boardConfig.size * boardConfig.size; i++) {
			const canvas = document.getElementById("canvas" + i);
			if (canvas) {
				// Check if the canvas element exists
				const context = canvas.getContext("2d");
				context.clearRect(0, 0, canvas.width, canvas.height);
				canvas.style.backgroundColor = "";
			}
		}
	}

	function generateBoard(size) {
		const boardDiv = document.getElementById("board");
		boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
		boardDiv.innerHTML = "";
		for (let i = 1; i <= size * size; i++) {
			const canvas = document.createElement("canvas");
			canvas.id = "canvas" + i;
			boardDiv.appendChild(canvas);
		}
		console.log("Current board size:", boardConfig.size);
	}

	function resetBoardAndGameState() {
		clearOldBoard();

		filled = Array(boardConfig.size * boardConfig.size).fill(false);
		boardSymbols = Array(boardConfig.size * boardConfig.size).fill("");
		gameOver = false;
		document.getElementById("result").innerText = "";

		generateBoard(boardConfig.size);
		consistencyCheck();
	}

function drawSymbolOnBox(context, player, box) {
	const canvasWidth = context.canvas.width;
	const canvasHeight = context.canvas.height;

	const lineWidth = canvasWidth * 0.1;
	const margin = canvasWidth * 0.15;
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
		const circleRadius = Math.min(canvasWidth, canvasHeight) / 2 - lineWidth;

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



		
	function isBoardFull(board) {
		return board.every((cell) => cell === "X" || cell === "O");
	}

	// event listeners
	document.addEventListener("DOMContentLoaded", function () {
	
	});

	const radioButtons = document.querySelectorAll('input[name="boardSize"]');
	radioButtons.forEach((button) => {
		button.addEventListener("change", function (event) {
			const selectedSize = parseInt(event.target.value);
			boardConfig.size = selectedSize;
			console.log("Current board sizeline72:", boardConfig.size);
			resetBoardAndGameState();
			consistencyCheck();
			generateBoard(selectedSize);
			newGame();
		});
	});
	document.getElementById("gameMode").addEventListener("change", function (e) {
		const validModes = ["classic", "easy", "random"];
		if (!validModes.includes(e.target.value)) {
			alert("Invalid game mode selected. Please choose a valid game mode.");
			e.target.value = "classic";
		}
	});
	document.getElementById("newGameButton").addEventListener("click", newGame);
	document.getElementById("board").addEventListener("click", function (e) {
		handleBoxClick(e.target.id);
	});
	//score reset
	document.getElementById("resetButton").addEventListener("click", function () {
		humanWinCount = 0;
		aiWinCount = 0;
		// Update score display
		document.getElementById("humanWins").innerText = humanWinCount;
		document.getElementById("aiWins").innerText = aiWinCount;
		document.getElementById("draws").innerText = "0";
	});
	function handleBoardSizeChange() {
		// Clear the board
		clearBoard();

		// Reset the game state
		resetGameState();

		// Depending on the selected size, re-render the board
		let boardSize = 3; // default to 3x3
		if (document.getElementById("size4").checked) {
			boardSize = 4;
		}
		renderBoard(boardSize);
	}

	function clearBoard() {
		const boardElement = document.getElementById("board");
		while (boardElement.firstChild) {
			boardElement.removeChild(boardElement.lastChild);
		}
	}

	function resetGameState() {
		// Implement resetting your game's state here, like resetting turns, scores, etc.
		// Depending on how you've implemented the game logic, this function will vary.
	}

	function renderBoard(size) {
		const boardElement = document.getElementById("board");
		for (let i = 0; i < size * size; i++) {
			const canvas = document.createElement("canvas");
			canvas.id = "canvas" + (i + 1);
			boardElement.appendChild(canvas);
		}
		// Note: You might also want to attach event listeners to these new canvas elements or set up their initial styles.
	}

	// reset the game
	function newGame() {
		resetBoardAndGameState();
		consistencyCheck();

		console.log("Current board sizeline140:", boardConfig.size);

		const randomPlayer = Math.random() < FIRST_PLAYER_CHANCE ? "human" : "ai";
		if (randomPlayer === "human") {
			turn = 1;
		} else {
			turn = 0;
			handleAIMove();
		}
	}

	function checkForDraw() {
		if (isBoardFull(boardSymbols)) {
			document.getElementById("result").innerText =
				"It's a Draw! Click NEW GAME!";
			gameOver = true;
			const drawsCount = parseInt(document.getElementById("draws").innerText);
			document.getElementById("draws").innerText = drawsCount + 1;
		}
	}

	// handle user's box clicks; manage the game state
	function handleBoxClick(boxId) {
		console.log("Human clicked on:", boxId);
		const num = parseInt(boxId.replace("canvas", "")) - 1;
		const box = document.getElementById(boxId);
		const context = box.getContext("2d");
		if (filled[num]) {
			alert("This box is filled, please choose a differnt one.");
			return;
		}
		if (gameOver) {
			alert("The game is over. Click NEW GAME to play again!");
			return;
		}
		if (turn % 2 !== 0) {
			// Human player's turn
			drawSymbolOnBox(context, humanSymbol, box);
			if (hasWon(boardSymbols, humanSymbol)) {
				document.getElementById("result").innerText =
					"You won! Click NEW GAME!";
				humanWinCount++;
				document.getElementById("humanWins").innerText = humanWinCount;
				gameOver = true;
			} else {
				checkForDraw();
				if (!gameOver) {
					handleAIMove();
				}
			}
		}
	}
	// handle AI's move
	function handleAIMove() {
		const boxId = getAIMove(boardSymbols);
		console.log("Returned boxId from getAIMove:", boxId);
		console.log(boxId);
		const box = document.getElementById(boxId);
		const context = box.getContext("2d");
		if (gameOver) {
			alert("The game is over. Click NEW GAME to play again!");
			return;
		}
		drawSymbolOnBox(context, aiSymbol, box);
		if (hasWon(boardSymbols, aiSymbol)) {
			document.getElementById("result").innerText = "Max Won! Click NEW GAME!";
			aiWinCount++;
			document.getElementById("aiWins").innerText = aiWinCount;
			gameOver = true;
		} else {
			checkForDraw();
		}
	}

	generateBoard(boardConfig.size);
	console.log("Current board sizeline221:", boardConfig.size);

	newGame();
	document.getElementById("size" + boardConfig.size).checked = true;


});
