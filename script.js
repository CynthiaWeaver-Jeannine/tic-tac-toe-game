/** @format */

window.onload = function () {
	let num;
	let box;
	let turn = 1;
	let context;
	let filled;
	let symbol;
    let winner;
    filled = new Array();
    symbol = new Array();
    winner = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6,], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
	let gameOver = false;
	let humanPlayer = "X";
	let ai = "O";
	let result = {};
    for (let i = 0; i<9; i++){
        filled[i] = false;
        symbol[i] = "";
    }
   let n = document.getElementById("new")
    n.addEventListener("click", newGame);
    function newGame() {
        document.location.reload();

    }
   document.getElementById("board").addEventListener("click", function (e) {
        boxClick(e.target.id);
    });
    function drawX(box) {
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
        symbol[num] = "X";
    }
    function drawO(next) {
        box.style.backgroundColor = "orange";
        context.beginPath();
        context.arc(50, 50, 35, 0, 2 * Math.PI);
        context.lineWidth = 10;
        context.strokeStyle = "orange";
        context.stroke();
        context.closePath();
        symbol [next] = ai;

    }
    function winnerCheck (symbol) {
        for (let j = 0; j < winner.length; j++) {
            if ((symbol[winner[j][0]] === humanPlayer) && (symbol[winner[j][1]] === humanPlayer) &&  (symbol[winner[j][2]] === humanPlayer)) {
                return true;
            }
        }
        return false;
    }
    function boxClick(numId) {
        const validNums = ["canvas1", "canvas2", "canvas3", "canvas4", "canvas5", "canvas6", "canvas7", "canvas8", "canvas9"]
        if (validNums.includes(numId)) {
            const num = validNums.indexOf(numId) + 1;
            if(!filled[num - 1]) {
                box = document.getElementById(numId);
                context = box.getContext("2d");
        switch(numId) {
            case "canvas1": num = 0; break;
            case "canvas2": num = 1; break;
            case "canvas3": num = 2; break;
            case "canvas4": num = 3; break;
            case "canvas5": num = 4; break;
            case "canvas6": num = 5; break;
            case "canvas7": num = 6; break;
            case "canvas8": num = 7; break;
            case "canvas9": num = 8; break;
        }

        if(filled[num -1] == false) {
            if(gameOver === false) {
                if(turn % 2 !== 0) {
                    drawX();
                    turn++;
                    filled[num-1] = true;
                    if(winnerCheck(symbol, symbol[num-1]) === true) {
                        document.getElementById("result").innerText = "Player '" + symbol[num-1] + " ' won!";                        
                        gameOver = true;                    
                    }
                    if(turn === 10 && gameOver !== true){
                        document.getElementById("result").innerText = "It's a tie!";
                        return
                    }
                    if(turn%2 ===0) {
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
};
