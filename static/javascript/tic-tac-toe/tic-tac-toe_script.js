// Assign a variable to socketio
const socket = io();

// Assign a variable to player markings
const xClass = "X";
const oClass = "O";

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Winning & Draw condition page had the id of 'message' and it is hidden as the game starts
const message = document.getElementById("message");

const startNewGameButton = document.getElementById("start_new_game");
const joinAGame = document.getElementById("join_a_game");
const roomId = document.getElementById("room_id")
const cells = document.querySelectorAll('.square');
const restartButton = document.getElementById("restart");
const board = document.getElementById("board");
const winnerText = document.getElementById("gameEnd");
const chatBar = document.getElementById("chatInput");
const chatButton = document.getElementById("messageButton");
const chatWrite = document.getElementById("receiveMessage");
const loginInput = document.getElementById("loginId");
const loginButton = document.getElementById("loginButton");
const fullRoom = document.getElementById("room_full");
const gameId = document.getElementById('game-id');

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return cells[index].classList.contains(currentClass)
      })
    })
  }

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function subString(string) {
    const subString = string.substring(string.length -10)
    return subString
}

startNewGameButton.addEventListener("click" , (event)=> {
    username = loginInput.value
    document.getElementById("game-type").style.display = 'none';
    socket.emit("game_type" , `new_game-${username}`);
});

joinAGame.addEventListener("click" , (event)=>{
    username = loginInput.value;
    socket.emit("game_type" , `${roomId.value}-${username}`);    
});

function swapSides() {
    circleTurn = !circleTurn;
};

function clickManager(event){ 
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    // Sending the server which cell was marked and whether it was an "X" or "O"
    placeMark(cell , currentMark);
    socket.send(cell.dataset['cell']+currentMark);
    if(checkWin(currentMark)){
        socket.send("win");
    };
};

function startGame() {
    message.classList.remove('show');
    circleTurn = true;
    for(cell of cells){
        //Clear all the cells to start a new game 
        cell.classList.remove(xClass)
        cell.classList.remove(oClass)
        cell.textContent = "";
        cell.removeEventListener("click", clickManager)
        cell.addEventListener("click", clickManager, {once: true})
    }
}
    
restartButton.addEventListener("click" , (event)=>{
    socket.send("restart");
    
});


// Listen messages from the server
socket.on('session_id' , function(data) {
    if(data === "Room Doesn't Exist, Check the code."){
        alert(data);
    } else if(data == "Room Is Full!!!"){
        alert(data);
    }else{
        document.getElementById("game-type").style.display = 'none';
        gameId.innerHTML = `<h4>Room: ${subString(data)}</h4>`
    };
});

socket.on('message' , function(data) {
    
    // If one of the players press restart button, restart the game for both parties
    if(data === "restart"){
        startGame();
    }
    
    else if (data === 'DRAW'){
        winnerText.innerHTML = `${data}`
        message.classList.add('show');
    }
    else if(data[1] === "X" || data[1] === "O"){
        for(cell of cells){
            // Matching the mark with the correct cell by checking its data-attribute
            if(cell.dataset['cell'] === data[0]){
                cell.textContent = data[1];
                //cell.removeEventListener("click")
                
                swapSides()

            }
        }
    }
    
    else {
        winnerText.innerHTML = `${data}`
        message.classList.add('show');
    }

})

chatButton.addEventListener("click", (event) =>{
    socket.emit('chat_message' , chatBar.value);
});

chatBar.addEventListener("keydown", function search(e){
    if(e.keyCode === 13){
        chatButton.click();
    }
})

socket.on('private_chat_message', function(msg){
    chatWrite.textContent = msg;
    chatBar.value = ""
})

// Start the game
startGame();