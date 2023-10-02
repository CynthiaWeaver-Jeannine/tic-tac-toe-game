/** @format */

window.onload = function () {
	let num;
	let box;
	let context;
	let turn = 1;
	let filled;
	let symbol;
	let winner;
	let gameOver = false;
	const humanPlayer = "X";
	const ai = "O";
	let result = {};
	filled = new Array();
	symbol = new Array();
	winner = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < 9; i++) {
		filled[i] = false;
		symbol[i] = "";
	}

	let n = document.getElementById("new");
	n.addEventListener("click", newGame);

	function newGame() {
		document.location.reload();
	}

	document.getElementById("board").addEventListener("click", function (e) {
		boxClick(e.target.id);
	});

	function drawX() {
		let box = document.getElementById("canvas" + num);
		box.classList.add("x-mark");
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

		symbol[num - 1] = humanPlayer;
	}

	function drawO(next) {
		let box = document.getelementById("canvas" + next);
		box.classList.add("o-mark");
		box.style.backgroundColor = "#71e29c";
		context.beginPath();
		context.arc(50, 50, 35, 0, 2 * Math.PI);
		context.lineWidth = 20;
		context.strokeStyle = "white";
		context.stroke();
		context.closePath();

		symbol[next] = ai;
	}

	function winnerCheck(symbol, player) {
		for (let i = 0; i < winner.length; i++) {
			if (
				symbol[winner[i][0]] == player &&
				symbol[winner[i][1]] == player &&
				symbol[winner[i][2]] == player
			) {
				return true;
			}
		}
		return false;
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
					"Maxi Won! Click NEW GAME!";
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
					document.getElementById("result").innerText = "Maxi Won! Click NEW GAME!";
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
