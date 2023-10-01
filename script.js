/** @format */

window.onload = function () {
	let box;
	let turn = 1;
	let context;
	let filled;
	let symbol;
	let winner;
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
		[6, 4, 2],
	];
	let gameOver = false;
	let humanPlayer = "X";
	let ai = "O";
	for (let i = 0; i < 9; i++) {
		filled[i] = false;
		symbol[i] = "";
	}
	let n = document.getElementById("new");
	n.addEventListener("click", newGame);

	function newGame() {
		document.location.reload();
		filled = new Array(9).fill(false);
	}

	document.getElementById("board").addEventListener("click", function (e) {
		boxClick(e.target.id);
	});

	function drawX(box) {
		if (box && box.style) {
			box.style.backgroundColor = "white";
			const context = box.getContext("2d");
			context.beginPath();
			context.moveTo(15, 15);
			context.lineTo(85, 85);
			context.moveTo(85, 15);
			context.lineTo(15, 85);
			context.lineWidth = 10;
			context.lineCap = "round";
			context.strokeStyle = "#ff6666";
			context.stroke();
			context.closePath();
			const num = parseInt(box.id.replace("canvas", "")) - 1;
			symbol[num] = "X";
		}
	}

	function drawO(next) {
		box.style.backgroundColor = "orange";
		context.beginPath();
		context.arc(50, 50, 35, 0, 2 * Math.PI);
		context.lineWidth = 10;
		context.strokeStyle = "orange";
		context.stroke();
		context.closePath();
		symbol[next] = ai;
	}

	function winnerCheck(symbol) {
		for (let j = 0; j < winner.length; j++) {
			if (
				symbol[winner[j][0]] === humanPlayer &&
				symbol[winner[j][1]] === humanPlayer &&
				symbol[winner[j][2]] === humanPlayer
			) {
				return true;
			}
		}
		return false;
	}

	function boxClick(numId) {
		const validNums = [
			"canvas1",
			"canvas2",
			"canvas3",
			"canvas4",
			"canvas5",
			"canvas6",
			"canvas7",
			"canvas8",
			"canvas9",
		];

		if (validNums.includes(numId)) {
			let num = validNums.indexOf(numId) + 1;
			if (!filled[num - 1]) {
				box = document.getElementById(numId);
				context = box.getContext("2d");
				drawX(box);
				switch (numId) {
					case "canvas1":
						num = 0;
						break;
					case "canvas2":
						num = 1;
						break;
					case "canvas3":
						num = 2;
						break;
					case "canvas4":
						num = 3;
						break;
					case "canvas5":
						num = 4;
						break;
					case "canvas6":
						num = 5;
						break;
					case "canvas7":
						num = 6;
						break;
					case "canvas8":
						num = 7;
						break;
					case "canvas9":
						num = 8;
						break;
				}

				if (filled[num - 1] == false) {
					if (gameOver === false) {
						if (turn % 2 !== 0) {
							drawX(box);
							turn++;
							filled[num - 1] = true;
							if (winnerCheck(symbol, symbol[num - 1]) === true) {
								document.getElementById("result").innerText =
									"Player '" + symbol[num - 1] + " ' won!";
								gameOver = true;
							}
							if (turn > 9 && gameOver !== true) {
								document.getElementById("result").innerText = "It's a tie!";
								return;
							}
							if (turn % 2 === 0) {
								playAI();
							}
						}
					} else {
						alert("Game Over! Click on 'New Game' to start again.");
					}
				} else {
					alert("This box has already been filled!");
				}
			}
		}
	}
	function emptyBoxes(newSymbol) {
		let indexOfEmptyArray = 0;
		let isEmpty = [];
		for (let i = 0; i < newSymbol.length; i++) {
			if (newSymbol[i] === "") {
				isEmpty[indexOfEmptyArray] = i;
				indexOfEmptyArray++;
			}
		}
		return isEmpty;
	}
	function playAI() {
		if (gameOver === false) {
			const nextMove = minimax(symbol, ai);
			nextMove.index = emptyBoxes(symbol)[nextMove.index];
			const nextId = "canvas" + (nextMove.index + 1);
			box = document.getElementById(nextId);
			context = box.getContext("2d");
			drawO(box);
			filled[nextMove.index] = true;
			turn++;
			if (winnerCheck(symbol, symbol[nextMove.index]) === true) {
				document.getElementById("result").innerText =
					"Player '" + symbol[nextMove.index] + "' won!";
				gameOver = true;
			}
			if (turn >= 9 && gameOver !== true) {
				document.getElementById("result").innerText = "It's a tie!";
				return;
			}
		} else {
			alert("Game Over! Click on 'New Game' to start again.");
		}
	}
	function minimax(newSymbol, player) {
		const empty = emptyBoxes(newSymbol);
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

		const possibleMoves = [];
		for (let i = 0; i < empty.length; i++) {
			const currentMove = {};
			currentMove.index = empty[i];
			newSymbol[empty[i]] = player;
			let result;
			if (player == ai) {
				const result = minimax(newSymbol, humanPlayer);
				currentMove.score = result.score;
			} else {
				result = minimax(newSymbol, ai);
				currentMove.score = result.score;
			}
			newSymbol[empty[i]] = "";
			possibleMoves.push(currentMove);
		}
		let bestMove;
		if (player === ai) {
			let bestScore = -10000;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].score > bestScore) {
					bestScore = possibleMoves[i].score;
					bestMove = i;
				}
			}
		} else {
			let lowestScore = 10000;
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
