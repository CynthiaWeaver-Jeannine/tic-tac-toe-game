/** @format */
const humanSymbol = "X";
const aiSymbol = "O";
const HUMAN_WIN_SCORE = -10;
const AI_WIN_SCORE = 10;
const DRAW_SCORE = 0;
let depth = 0;
let maxDepth = 6;

function generateWinningCombinations(boardConfig) {
	boardConfig = boardConfig || { size: 3 };
	if (!boardConfig || !boardConfig.size) {
		console.error("boardConfig or boardConfig.size is not defined!");
		return [];
	}
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

function heuristicScore(board, boardConfig) {
	boardConfig = boardConfig || { size: 3 };
	let score = 0;
	const winningCombinations = generateWinningCombinations( boardConfig);

	for (let combination of winningCombinations) {
		const combinationSymbols = combination.map((i) => board[i]);
		const humanCount = combinationSymbols.filter((s) => s === humanSymbol).length;
		const aiCount = combinationSymbols.filter((s) => s === aiSymbol).length;
		if (humanCount === 0) {
			score += Math.pow(10, aiCount);
		} else if (aiCount === 0) {
			score -= Math.pow(10, humanCount);
		}
	}
	return score;
}





function hasWon(board, player, boardConfig) {
	const winningCombinations = generateWinningCombinations(boardConfig);

	function checkForWinner(board, player) {
		return winningCombinations.some((combination) =>
			combination.every((cell) => board[cell] === player),
		);
	}

	return checkForWinner(board, player);
}

//Minimax algorithm with alpha-beta pruning
function evaluateBestMove(
	currentBoardState,
	player,
	depth = 0,
	alpha = -Infinity,
	beta = Infinity,
	boardConfig,
) {
	let boardCopy = [...currentBoardState];
	const emptyPositions = getEmptyBoxPositions(boardCopy, boardConfig);
	if (hasWon(currentBoardState, humanSymbol, boardConfig)) {
		return { score: HUMAN_WIN_SCORE };
	}
	if (hasWon(currentBoardState, aiSymbol, boardConfig)) {
		return { score: 10 };
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
			return (
				"canvas" +
				(evaluateBestMove(
					boardSymbols,
					aiSymbol,
					0,
					-Infinity,
					Infinity,
					boardConfig,
				).id +
					1)
			);
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
