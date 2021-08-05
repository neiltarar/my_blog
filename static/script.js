const xClass = "X";
const oClass = "O";

const message = document.getElementById("message");
const cells = document.querySelectorAll('#cell');
const restartButton = document.getElementById("restart");
const board = document.getElementById("board");
const winnerText = document.getElementById("gameEnd");

const winningRules = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
]

let drawCount = 0;



function winningRule(currentPlayer){
    return winningRules.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        })
    })
} 

function swapSides() {
    circleTurn = !circleTurn;
};

function clickManager(event){ 
    drawCount ++
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    cell.textContent = currentMark;
    if (winningRule(currentMark)){
        if(currentMark === "O"){
            winnerText.innerHTML = "FIRST PLAYER <br> WINS!!!"
            message.classList.add('show');
            drawCount = 0;
        }else if (currentMark === "X"){
            winnerText.innerHTML = "SECOND PLAYER <br> WINS!!!"
            message.classList.add('show');
            drawCount = 0;
        };
    }
    else if(drawCount === 9){
            winnerText.innerHTML = "IT IS A DRAW!!!"
            message.classList.add('show');
            drawCount = 0;
        };


    swapSides();
};


function startGame() {
    message.classList.remove('show');
    circleTurn = true;
    for(cell of cells){
        cell.textContent = "";
        cell.removeEventListener("click", clickManager)
        cell.addEventListener("click", clickManager, {once: true})
    }
    
};

restartButton.addEventListener("click" , startGame);

startGame();