// Assign a variable to socketio
const socket = io();

// Assign a variable to player markings
const xClass = "X";
const oClass = "O";

// Winning & Draw condition page had the id of 'message' and it is hidden as the game starts
const message = document.getElementById("message");

const cells = document.querySelectorAll('#cell');
const restartButton = document.getElementById("restart");
const board = document.getElementById("board");
const winnerText = document.getElementById("gameEnd");
const chatBar =document.getElementById("chatInput");
const chatButton = document.getElementById("messageButton");
const chatWrite = document.getElementById("receiveMessage");

// Winning conditions defined in an array.
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

// Assign a varible to click counter to see when 9 cells are all clicked once. 
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
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    socket.send(cell.dataset['cell']+currentMark);
};


function startGame() {
    
    message.classList.remove('show');
    circleTurn = true;
    for(cell of cells){
        //Clear all the cells to start a new game 
        cell.textContent = "";
        
        cell.removeEventListener("click", clickManager)
        socket.send("restart")
        
        cell.addEventListener("click", clickManager, {once: true})
    }
}
    



restartButton.addEventListener("click" , startGame);

startGame();


// Listen messages from the server
socket.on('message' , function(data) {
    
    
    // If one of the players press restart button, restart the game for both parties
    if(data === "restart"){
        startGame();
    }

    else{
        for(cell of cells){
            cell.addEventListener("click", clickManager, {once: true})
            if(cell.dataset['cell'] === data[0]){
                cell.textContent = data[1];
                swapSides()
                
                if (winningRule(data[1])){
                    if(data[1] === "O"){
                        winnerText.innerHTML = "FIRST PLAYER <br> WINS!!!"
                        message.classList.add('show');
                        drawCount = 0;
                    }else if (data[1] === "X"){
                        winnerText.innerHTML = "SECOND PLAYER <br> WINS!!!"
                        message.classList.add('show');
                        drawCount = 0;
                    };
                }
                else{ 
                    drawCount ++
                    console.log(drawCount)
                    if(drawCount === 9){
                            winnerText.innerHTML = "IT IS A DRAW!!!"
                            message.classList.add('show');
                            drawCount = 0;
                        }
                    };
                }
            }
    }

})

chatButton.addEventListener("click", (event)=>{
    socket.emit('chat_message', chatInput.value);
    chatBar.value = ""
})

socket.on('private_chat_message', function(msg){
    chatWrite.textContent = msg;
})