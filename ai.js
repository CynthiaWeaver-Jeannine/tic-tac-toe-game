/** @format */
const humanSymbol = "X";
const aiSymbol = "O";
const HUMAN_WIN_SCORE = -10;
const AI_WIN_SCORE = 10;
const DRAW_SCORE = 0;
export let boardConfig = {
	size: 3
}

function generateWinningCombinations() {
	let combinations = [];
	// rows
	for (let i = 0; i < boardConfig.size; i++) {
		combinations.push(
			[...Array(boardConfig.size).keys()].map((j) => i * boardConfig.size + j),
		);
	}
	// columns
	for (let j = 0; j < boardConfig.size; j++) {
		combinations.push(
			[...Array(boardConfig.size).keys()].map((i) => i * boardConfig.size + j),
		);
	}
	//diagonals
	combinations.push(
		[...Array(boardConfig.size).keys()].map((i) => i * boardConfig.size + i),
	);
	combinations.push(
		[...Array(boardConfig.size).keys()].map(
			(i) => i * boardConfig.size + (boardConfig.size - 1 - i),
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
	for (let combination of winningCombinations) {
		const symbols = combination.map((index) => board[index]);
		// Calculate AI's potential wins
		if (
			symbols.filter((symbol) => symbol === aiSymbol).length ===
				boardConfig.size - 1 &&
			symbols.filter((symbol) => symbol === "").length === 1
		) {
			score += 3;
		}

		// Calculate Human's potential wins
		if (
			symbols.filter((symbol) => symbol === humanSymbol).length ===
				boardConfig.size - 1 &&
			symbols.filter((symbol) => symbol === "").length === 1
		) {
			score -= 4; // Note: Higher penalty for human potential wins to prioritize blocking
		}

		// Prioritize center for larger boards
		if (boardConfig.size > 3) {
			const centerIndexes = [
				Math.floor(boardConfig.size / 2) * boardConfig.size +
					Math.floor(boardConfig.size / 2),
				Math.floor(boardConfig.size / 2) * boardConfig.size +
					Math.floor(boardConfig.size / 2) -
					1,
				(Math.floor(boardConfig.size / 2) - 1) * boardConfig.size +
					Math.floor(boardConfig.size / 2),
				(Math.floor(boardConfig.size / 2) - 1) * boardConfig.size +
					Math.floor(boardConfig.size / 2) -
					1,
			];
			for (const centerIndex of centerIndexes) {
				if (board[centerIndex] === aiSymbol) {
					score += 1;
				} else if (board[centerIndex] === humanSymbol) {
					score -= 1;
				}
			}
		}
	}
	return score;}

// Minimax algorithm with alpha-beta pruning;
// includes depth-limiting logic
function evaluateBestMove(
	currentBoardState,
	player,
	depth = 0,
	alpha = -Infinity,
	beta = Infinity,
	maxDepth = 6,
) {
	let boardCopy = [...currentBoardState];
	const emptyPositions = getEmptyBoxPositions(boardCopy, boardConfig);
	if (hasWon(currentBoardState, humanSymbol, boardConfig)) {
		return { score: HUMAN_WIN_SCORE };
	}
	if (hasWon(currentBoardState, aiSymbol)) {
		return { score: AI_WIN_SCORE };
	}
	if (emptyPositions.length === 0) {
		return { score: DRAW_SCORE };
	}
	if (depth >= maxDepth) {
		return { score: heuristicScore(currentBoardState, boardConfig) };
	}
	if (player === aiSymbol) {
		let bestScore = -Infinity;
		let bestMove;
		for (let emptyIndex of emptyPositions) {
			boardCopy[emptyIndex] = player;
			const expectedLength = boardConfig.size * boardConfig.size;
			if (currentBoardState.length !== expectedLength) {
				console.error(
					"Inconsistency detected in currentBoardState length during evaluation!",
				);
			}
			let currentScore = evaluateBestMove(
				boardCopy,
				humanSymbol,
				depth + 1,
				alpha,
				beta,
				boardConfig,
			).score;
			boardCopy[emptyIndex] = "";
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
				depth + 1,
				alpha,
				beta,
				boardConfig,
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

function getAIMove(boardSymbols, boardConfig) {
	switch (document.getElementById("gameMode").value) {
		case "classic":
			return "canvas" + (evaluateBestMove(boardSymbols, aiSymbol).id + 1);
		case "easy":
			return getEasyMove(boardSymbols, boardConfig);
		case "random":
			return getRandomMove(boardSymbols);
		default:
			console.error("Unknown game mode:", gameMode);
			alert("Invalid game mode selected. Please choose a valid game mode.");
			return;
	}
}

function getEasyMove(boardSymbols, boardConfig) {
	// Check if there's a winning move for AI
	for (let i = 0; i < boardSymbols.length; i++) {
		if (!boardSymbols[i]) {
			boardSymbols[i] = aiSymbol;
			if (hasWon(boardSymbols, aiSymbol, boardConfig)) {
				return "canvas" + (i + 1);
			}
			boardSymbols[i] = "";
		}
	}
	return getRandomMove(boardSymbols, boardConfig);
}

function getRandomMove(boardSymbols, boardConfig) {
	const emptyPositions = getEmptyBoxPositions(boardSymbols, boardConfig);
	const randomIndex = Math.floor(Math.random() * emptyPositions.length);
	return "canvas" + (emptyPositions[randomIndex] + 1);
}

export {
	humanSymbol,
	aiSymbol,
	hasWon,
	evaluateBestMove,
	getEmptyBoxPositions,
	getAIMove,
	getEasyMove,
	getRandomMove,
};
