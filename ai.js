/** @format */
const humanSymbol = "X";
const aiSymbol = "O";
const HUMAN_WIN_SCORE = -10;
const AI_WIN_SCORE = 10;
const DRAW_SCORE = 0;
const BOARD_SIZE = 4;

function generateWinningCombinations() {
	let combinations = [];
	// rows
	for (let i = 0; i < BOARD_SIZE; i++) {
		combinations.push(
			[...Array(BOARD_SIZE).keys()].map((j) => i * BOARD_SIZE + j),
		);
	}
	// columns
	for (let j = 0; j < BOARD_SIZE; j++) {
		combinations.push(
			[...Array(BOARD_SIZE).keys()].map((i) => i * BOARD_SIZE + j),
		);
	}
	//diagonals
	combinations.push(
		[...Array(BOARD_SIZE).keys()].map((i) => i * BOARD_SIZE + i),
	);
	combinations.push(
		[...Array(BOARD_SIZE).keys()].map(
			(i) => i * BOARD_SIZE + (BOARD_SIZE - 1 - i),
		),
	);

	return combinations;
}

function hasWon(board, player) {
	const winningCombinations = generateWinningCombinations();

	return checkForWinner(board, player);

	function checkForWinner(board, player) {
		return winningCombinations.some((combination) =>
			combination.every((index) => board[index] === player),
		);
	}
}

function heuristicScore(board) {
	let score = 0;
	const winningCombinations = generateWinningCombinations();
	for(let combination of winningCombinations) {
		const symbols = combination.map(index => board[index]);
		if (symbols.every(symbol => symbol === aiSymbol)) {
			score += symbols.length;
		} else if (symbols.every(symbol => symbol === humanSymbol)) {
			score -= symbols.length;
		}
	}
	return score
}

// Minimax algorithm with alpha-beta pruning;
// includes depth-limiting logic
function evaluateBestMove(
	currentBoardState,
	player,
	depth = 0,
	alpha = -Infinity,
	beta = Infinity,
	maxDepth = 4
) {
	const emptyPositions = getEmptyBoxPositions(currentBoardState);
	if (hasWon(currentBoardState, humanSymbol)) {
		return { score: HUMAN_WIN_SCORE };
	}
	if (hasWon(currentBoardState, aiSymbol)) {
		return { score: AI_WIN_SCORE };
	}
	if (emptyPositions.length === 0) {
		return { score: DRAW_SCORE };
	}
	if (depth >= maxDepth) {
		return { score: heuristicScore(currentBoardState) };
	}
	if (player === aiSymbol) {
		let bestScore = -Infinity;
		let bestMove;
		for (let emptyIndex of emptyPositions) {
			currentBoardState[emptyIndex] = player;
			let currentScore = evaluateBestMove(
				currentBoardState,
				humanSymbol,
				depth+1,
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
				depth+1,
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
