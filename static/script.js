const xClass = "X";
const oClass = "O";
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

const cells = document.querySelectorAll('[data-cell]');

let circleTurn = true;

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
    console.log(currentMark);
    if (Rules(currentMark)){
        if(currentMark === "O"){
            alert("First Player WINS!!!");
        }else {
            alert("Second Player WINS!!!")
        }
    };
    swapSides();
};


for(cell of cells){
    cell.addEventListener("click" , clickManager, {once: true});
};