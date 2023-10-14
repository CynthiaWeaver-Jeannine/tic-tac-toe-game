/** @format */

const boardConfig = {
	size: 3,
};

function initializeBoardState() {
	return {
		filled: Array(boardConfig.size * boardConfig.size).fill(false),
		boardSymbols: Array(boardConfig.size * boardConfig.size).fill(""),
	};
}

function setupBoard(size = boardConfig.size) {
	const boardDiv = document.getElementById("board");
	boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
	boardDiv.innerHTML = "";
	for (let i = 1; i <= size * size; i++) {
		const canvas = document.createElement("canvas");
		canvas.id = "canvas" + i;
		boardDiv.appendChild(canvas);
	}
}


function isBoardFull(board) {
	return board.every((cell) => cell === "X" || cell === "O");
}

function updateScoreboardDisplay(humanWinCount, aiWinCount, drawCount) {
	document.getElementById("humanWins").innerText = humanWinCount;
	document.getElementById("aiWins").innerText = aiWinCount;
	document.getElementById("draws").innerText = drawCount;
}

export {
	initializeBoardState,
	setupBoard,
	isBoardFull,
	updateScoreboardDisplay,
    boardConfig,
};
