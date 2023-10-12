/** @format */
const humanSymbol = "X";
const aiSymbol = "O";

function hasWon(board, player) {
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	return checkForWinner(board, player);

	function checkForWinner(board, player) {
		return winningCombinations.some(
			(combination) =>
				board[combination[0]] === player &&
				board[combination[1]] === player &&
				board[combination[2]] === player,
		);
	}
}
//Minimax algorithm with alpha-beta pruning
function evaluateBestMove(
	currentBoardState,
	player,
	alpha = -Infinity,
	beta = Infinity,
) {
	const emptyPositions = getEmptyBoxPositions(currentBoardState);
	if (hasWon(currentBoardState, humanSymbol)) {
		return { score: -10 };
	}
	if (hasWon(currentBoardState, aiSymbol)) {
		return { score: 10 };
	}
	if (emptyPositions.length === 0) {
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
		return bestMove || { score: -Infinity };
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
		return bestMove || { score: Infinity };
	}
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

function getAIMove(boardSymbols) {
	switch (document.getElementById("gameMode").value) {
		case "classic":
			return "canvas" + (evaluateBestMove(boardSymbols, aiSymbol).id + 1);
		case "easy":
			return getEasyMove(boardSymbols);
		case "random":
			return getRandomMove(boardSymbols);
		default:
			console.error("Unknown game mode:", gameMode);
			alert("Invalid game mode selected. Please choose a valid game mode.");
			return;
	}
}

function getEasyMove(boardSymbols) {
	// Check if there's a winning move for AI
	for (let i = 0; i < boardSymbols.length; i++) {
		if (!boardSymbols[i]) {
			boardSymbols[i] = aiSymbol;
			if (hasWon(boardSymbols, aiSymbol)) {
				return "canvas" + (i + 1);
			}
			boardSymbols[i] = "";
		}
	}
	return getRandomMove(boardSymbols);
}

function getRandomMove(boardSymbols) {
	const emptyPositions = getEmptyBoxPositions(boardSymbols);
	const randomIndex = Math.floor(Math.random() * emptyPositions.length);
	return "canvas" + (emptyPositions[randomIndex] + 1);
}

export {
	hasWon,
	evaluateBestMove,
	getEmptyBoxPositions,
	getAIMove,
	getEasyMove,
	getRandomMove,
};
