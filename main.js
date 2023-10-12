
import { hasWon, evaluateBestMove, getEmptyBoxPositions, getAIMove, getEasyMove, getRandomMove} from "./ai.js"


window.onload = function () {
	let humanSymbol = "X";
	let aiSymbol = "O";
	let humanWinCount = 0;
	let aiWinCount = 0;

	// initial state
	let filled = Array(9).fill(false);
	let boardSymbols = Array(9).fill("");
	let turn = 1;
	let gameOver = false;

	function drawSymbolOnBox(context, player, box) {
		if (player === humanSymbol) {
			box.style.backgroundColor = "#fb5181";
			context.beginPath();
			context.moveTo(15, 15);
			context.lineTo(85, 85);
			context.moveTo(85, 15);
			context.lineTo(15, 85);
			context.lineWidth = 21;
			context.lineCap = "round";
			context.strokeStyle = "white";
			context.stroke();
			context.closePath();
		} else {
			box.style.backgroundColor = "#71e29c";
			context.beginPath();
			context.arc(50, 50, 35, 0, 2 * Math.PI);
			context.lineWidth = 20;
			context.strokeStyle = "white";
			context.stroke();
			context.closePath();
		}
		boardSymbols[parseInt(box.id.replace("canvas", "")) - 1] = player;
		filled[parseInt(box.id.replace("canvas", "")) - 1] = true;
		turn++;
	}

	function isBoardFull(board) {
		return board.every((cell) => cell === "X" || cell === "O");
	}

	// event listeners
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

	// reset the game
	function newGame() {
		for (let i = 1; i <= 9; i++) {
			const canvas = document.getElementById("canvas" + i);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			canvas.style.backgroundColor = "";
			gameOver = false;
		}
		filled.fill(false);
		boardSymbols.fill("");
		document.getElementById("result").innerText = "";
		const randomPlayer = Math.random() < 0.5 ? "human" : "ai";
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
		const num = parseInt(boxId.replace("canvas", "")) - 1;
		const box = document.getElementById(boxId);
		const context = box.getContext("2d");
		if (filled[num] || gameOver) {
			alert(
				"If the box is filled, choose a differnt one. \nIf the game is over, click NEW GAME!",
			);
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
}

        



	