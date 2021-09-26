// Assign a variable to socketio
const socket = io();

// Assign a variable to player markings
const xClass = "X";
const oClass = "O";

// Set a toggle to force the players to wait for their turns.
let toggle = 'on';

// All the winning combinations
const winning_rule = [
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

////////////////////////// Event Listeners //////////////////////////////

startNewGameButton.addEventListener("click" , (event)=> {
    username = loginInput.value
    socket.emit("game_type" , `new_game-${username}`);
});

joinAGame.addEventListener("click" , (event)=>{
    username = loginInput.value;
    socket.emit("game_type" , `${roomId.value}-${username}`);    
});

restartButton.addEventListener("click" , (event)=>{
    socket.send("restart");
});

/////////////////////////////////////////////////////////////////////

function checkWin(currentClass) {
    return winning_rule.some(combination => {
      return combination.every(index => {
        return cells[index].classList.contains(currentClass)
      })
    })
  }

function draw(){
    return[...cells].every(cell => {
        // check if every cell class is switched to either 'O' or 'X' to detect the draw condition.
        return cell.classList.contains(oClass) || cell.classList.contains(xClass);
    });
};

function placeMark(cell, currentClass) {
    // Add a class 'O' or 'X' to the cell to check for winning, draw conditions.
    cell.classList.add(currentClass);
    // Mark the played token on the board of the current player, and the play will be sent to the opponent via socketio.
    cell.textContent = currentClass;
};

// cut the last 10 digits of the user id who started the game. 
function subString(string) {
    const subString = string.substring(string.length -10)
    return subString
}

function swapSides() {
    circleTurn = !circleTurn;
};

function clickManager(event){ 
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    // Sending the server which cell was marked and whether it was an "X" or "O"
    
    // if the toggle is on player can make a move then turn the toggle off to wait for the opponent to make a move.
    if(toggle === 'on'){
        placeMark(cell , currentMark);
        socket.send(cell.dataset['cell']+currentMark);
        toggle = 'off';
    };
    // here remove event listener 
    
    if(checkWin(currentMark)){
        socket.send("win");
    }else if(draw()){
        socket.send("draw");
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
    };
};

// Listen messages from the server
socket.on('session_id' , function(data) {
    if(data === "none"){
        //alert(data);
        roomId.value = ""
        roomId.placeholder = "Room Doesn't Exist!";
    } else if(data == "full"){
        roomId.value = ""
        roomId.placeholder = "Room is full!";
    }else{
        document.getElementById("game-type").style.display = 'none';
        gameId.innerHTML = `<h4>Room: ${subString(data)}</h4>`
    };
});

socket.on('message' , function(data) {
    // let the player play (after waiting for their turn)
    toggle = 'on';

    // Disconnect the user if inactive for 33 minutes. Time starts after the first play (when the firs message is sent to the server)
    clearTimeout(socket.inactivityTimeout); 
    socket.inactivityTimeout = setTimeout(function() {
        socket.send('disconnected');
        socket.disconnect(true);
    }, 1000 * 2000);

    // Mark cells on both side and add class 'O' and 'X' on each side. Send winning or draw messaged to both sides. 
    // If one of the players press restart button, restart the game for both parties
    if(data === "restart"){
        startGame();
    }else if (data === 'draw'){
        winnerText.innerHTML = "IT'S A <br> DRAW";
        message.classList.add('show');
    }else if(data[1] === "X" || data[1] === "O"){
        for(cell of cells){
            
            // Matching the mark with the correct cell by checking its data-attribute
            if(cell.dataset['cell'] === data[0]){
                cell.textContent = data[1];
                placeMark(cell , data[1]);
                swapSides();
                
            };
        };
    }else {
        winnerText.innerHTML = `${data}`;
        message.classList.add('show');
    };
});

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