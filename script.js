/** @format */

window.onload = function () {
	const humanPlayer = "X";
	const ai = "O";
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
	let symbol = Array(9).fill("");
	let turn = 1;
	let gameOver = false;

	document.getElementById("new").addEventListener("click", newGame);
	document.getElementById("board").addEventListener("click", function (e) {
		boxClick(e.target.id);
	});

	function newGame() {
		for (let i = 1; i <= 9; i++) {
			const canvas = document.getElementById("canvas" + i);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			canvas.style.backgroundColor = "";
		}

		filled.fill(false);
		symbol.fill("");
		turn = 1;
		gameOver = false;
		document.getElementById("result").innerText = "";
	}

	function boxClick(boxId) {
		const num = boxId.replace("canvas", "") - 1;
		const box = document.getElementById(boxId);
		const context = box.getContext("2d");

		if (!filled[num] && !gameOver) {
			if (turn % 2 !== 0) {
				drawXorO(context, humanPlayer, box);
				if (winnerCheck(symbol, humanPlayer)) {
					document.getElementById(
						"result",
					).innerText = `Player ${humanPlayer} won!`;
					gameOver = true;
				} else if (turn >= 9) {
					document.getElementById("result").innerText = "It's a Draw!";
				} else {
					playAI();
				}
			}
		} else {
			alert("This box was already filled. Please click on another one.");
		}
	}

	function drawXorO(context, player, box) {
		if (player === humanPlayer) {
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
		symbol[parseInt(box.id.replace("canvas", "")) - 1] = player;
		filled[parseInt(box.id.replace("canvas", "")) - 1] = true;
		turn++;
	}

	function winnerCheck(board, player) {
		return winner.some(
			(combination) =>
				board[combination[0]] === player &&
				board[combination[1]] === player &&
				board[combination[2]] === player,
		);
	}
	//human player box click
	function boxClick(numId) {
		box = document.getElementById(numId);
		context = box.getContext("2d");
		switch (numId) {
			case "canvas1":
				num = 1;
				break;
			case "canvas2":
				num = 2;
				break;
			case "canvas3":
				num = 3;
				break;
			case "canvas4":
				num = 4;
				break;
			case "canvas5":
				num = 5;
				break;
			case "canvas6":
				num = 6;
				break;
			case "canvas7":
				num = 7;
				break;
			case "canvas8":
				num = 8;
				break;
			case "canvas9":
				num = 9;
				break;
		}

		if (filled[num - 1] === false) {
			if (gameOver === false) {
				if (turn % 2 !== 0) {
					drawX();
					turn++;
					filled[num - 1] = true;

					if (winnerCheck(symbol, symbol[num - 1]) === true) {
						document.getElementById("result").innerText =
							"Player '" + symbol[num - 1] + "' won!";
						gameOver = true;
					}

					if (turn > 9 && gameOver !== true) {
						document.getElementById("result").innerText =
							"It's a Draw! Click NEW GAME!";
						return;
					}

					if (turn % 2 == 0) {
						playAI();
					}
				}
			} else {
				document.getElementById("result").innerText =
					"Max Won! Click NEW GAME!";
			}
		} else {
			alert("This box was already filled. Please click on another one.");
		}
	}

	function emptyBoxes(newSymbol) {
		let j = 0;
		let empty = [];
		for (let i = 0; i < newSymbol.length; i++) {
			if (newSymbol[i] !== "X" && newSymbol[i] !== "O") {
				empty[j] = i;
				j++;
			}
		}
		return empty;
	}

	function playAI() {
		let nextMove = miniMax(symbol, ai);
		let nextId = "canvas" + (nextMove.id + 1);
		box = document.getElementById(nextId);
		context = box.getContext("2d");
		if (gameOver === false) {
			if (turn % 2 === 0) {
				drawO(nextMove.id);
				turn++;
				filled[nextMove.id] = true;

				//win condition
				if (winnerCheck(symbol, symbol[nextMove.id]) === true) {
					document.getElementById("result").innerText =
						"Max Won! Click NEW GAME!";
					gameOver = true;
				}

				//draw condition
				if (turn > 9 && gameOver !== true) {
					document.getElementById("result").innerText =
						"It's a Draw! Click NEW GAME!";
				}
			}
		} else {
			alert("Click the NEW GAME button to start again");
		}
	}

	//minimax logic

	function miniMax(newSymbol, player) {
		let empty = [];
		empty = emptyBoxes(newSymbol);

		if (winnerCheck(newSymbol, humanPlayer)) {
			return { score: -10 };
		} else if (winnerCheck(newSymbol, ai)) {
			return { score: 10 };
		} else if (empty.length === 0) {
			if (winnerCheck(newSymbol, humanPlayer)) {
				return { score: -10 };
			} else if (winnerCheck(newSymbol, ai)) {
				return { score: 10 };
			}
			return { score: 0 };
		}

		let possibleMoves = [];
		for (let i = 0; i < empty.length; i++) {
			let currentMove = {};
			currentMove.id = empty[i];
			newSymbol[empty[i]] = player;

			if (player === ai) {
				result = miniMax(newSymbol, humanPlayer);
				currentMove.score = result.score;
			} else {
				result = miniMax(newSymbol, ai);
				currentMove.score = result.score;
			}

			newSymbol[empty[i]] = "";

			possibleMoves.push(currentMove);
		}

		let bestMove;
		if (player === ai) {
			let highestScore = -1000;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].score > highestScore) {
					highestScore = possibleMoves[i].score;
					bestMove = i;
				}
			}
		} else {
			let lowestScore = 1000;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].score < lowestScore) {
					lowestScore = possibleMoves[i].score;
					bestMove = i;
				}
			}
		}
		return possibleMoves[bestMove];
	}
};
