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

function Rules(currentPlayer){
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
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    cell.textContent = currentMark;
    if (Rules(currentMark)){
        if(currentMark === "O"){
            winnerText.innerHTML = "FIRST PLAYER <br> WINS!!!"
            message.classList.add('show');
        }else {
            winnerText.innerHTML = "SECOND PLAYER <br> WINS!!!"
            message.classList.add('show');
        }
    };
    swapSides();
};


function startGame() {
    circleTurn = true;
    for(cell of cells){
        cell.textContent = "";
        cell.removeEventListener("click", clickManager)
        cell.addEventListener("click", clickManager, {once: true})
    }
    message.classList.remove('show');
};

restartButton.addEventListener("click" , startGame);

startGame();