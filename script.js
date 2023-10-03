/** @format */

window.onload = function () {
	const humanSymbol = "X";
	const aiSymbol = "O";
	const winner = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let filled = Array(9).fill(false);
	let boardSymbols = Array(9).fill("");
	let turn = 1;
	let gameOver = false;

	document.getElementById("newGameButton").addEventListener("click", newGame);
	document.getElementById("board").addEventListener("click", function (e) {
		handleBoxClick(e.target.id);
	});

	function newGame() {
		for (let i = 1; i <= 9; i++) {
			const canvas = document.getElementById("canvas" + i);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			canvas.style.backgroundColor = "";
		}

		filled.fill(false);
		boardSymbols.fill("");
		turn = 1;
		gameOver = false;
		document.getElementById("result").innerText = "";
	}

	function handleBoxClick(boxId) {
		const num = parseInt(boxId.replace("canvas", "")) - 1;
		const box = document.getElementById(boxId);
		const context = box.getContext("2d");

		if (!filled[num] && !gameOver) {
			if (turn % 2 !== 0) {
				drawSymbolOnBox(context, humanSymbol, box);
				if (checkForWinner(boardSymbols, humanSymbol)) {
					document.getElementById(
						"result",
					).innerText = `Player ${humanSymbol} won!`;
					gameOver = true;
				} else if (turn >= 9) {
					document.getElementById("result").innerText = "It's a Draw!";
				} else {
					handleAIMove();
				}
			}
		} else {
			alert("This box was already filled. Please click on another one.");
		}
	}

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

	function checkForWinner(board, player) {
		return winner.some(
			(combination) =>
				board[combination[0]] === player &&
				board[combination[1]] === player &&
				board[combination[2]] === player,
		);
	}

	function getEmptyBoxPositions(currentBoardState) {
		const emptyPositions = [];
		for (let i = 0; i < currentBoardState.length; i++) {
			if (
				currentBoardState[i] !== humanSymbol &&
				currentBoardState[i] !== aiSymbol
			) {
				emptyPositions.push(i);
			}
		}
		return emptyPositions;
	}

	function handleAIMove() {
		let nextMove = evaluateBestMove(boardSymbols, aiSymbol);
		let nextId = "canvas" + (nextMove.id + 1);
		const box = document.getElementById(nextId);
		const context = box.getContext("2d");

		if (!gameOver) {
			drawSymbolOnBox(context, aiSymbol, box);
			if (checkForWinner(boardSymbols, aiSymbol)) {
				document.getElementById("result").innerText =
					"Max Won! Click NEW GAME!";
				gameOver = true;
			} else if (turn >= 9) {
				document.getElementById("result").innerText =
					"It's a Draw! Click NEW GAME!";
			}
		} else {
			alert("Click the NEW GAME button to start again");
		}
	}

	/* 
		Minimax algorithm with alpha-beta pruning
		https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
	*/
	function evaluateBestMove(
		currentBoardState,
		player,
		alpha = -Infinity,
		beta = Infinity,
	) {
		const emptyPositions = getEmptyBoxPositions(currentBoardState);

		if (checkForWinner(currentBoardState, humanSymbol)) {
			return { score: -10 };
		} else if (checkForWinner(currentBoardState, aiSymbol)) {
			return { score: 10 };
		} else if (emptyPositions.length === 0) {
			return { score: 0 };
		}

		if (player === aiSymbol) {
			let bestScore = -Infinity;
			let bestMove;

			for (let emptyIndex of emptyPositions) {
				currentBoardState[emptyIndex] = player;
				let currentScore = evaluateBestMove(
					currentBoardState,
					humanSymbol,
					alpha,
					beta,
				).score;
				currentBoardState[emptyIndex] = "";

				if (currentScore > bestScore) {
					bestScore = currentScore;
					bestMove = { id: emptyIndex, score: bestScore };
				}

				alpha = Math.max(alpha, bestScore);
				if (beta <= alpha) {
					break;
				}
			}

			return bestMove;
		} else {
			let bestScore = Infinity;
			let bestMove;

			for (let emptyIndex of emptyPositions) {
				currentBoardState[emptyIndex] = player;
				let currentScore = evaluateBestMove(
					currentBoardState,
					aiSymbol,
					alpha,
					beta,
				).score;
				currentBoardState[emptyIndex] = "";

				if (currentScore < bestScore) {
					bestScore = currentScore;
					bestMove = { id: emptyIndex, score: bestScore };
				}

				beta = Math.min(beta, bestScore);
				if (beta <= alpha) {
					break; 
				}
			}

			return bestMove;
		}
	}
};
