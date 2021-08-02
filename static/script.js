const xClass = "X";
const oClass = "O";
const cells = document.querySelectorAll('[data-cell]');

let circleTurn = true;

function swapSides() {
    circleTurn = !circleTurn;
};


function clickManager(event){
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    cell.textContent = currentMark;
    console.log(currentMark);
    swapSides();
};


for(cell of cells){
    cell.addEventListener("click" , clickManager, {once: true});
};