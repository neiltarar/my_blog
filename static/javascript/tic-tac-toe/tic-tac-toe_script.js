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
const chatBar = document.getElementById("chatInput");
const chatButton = document.getElementById("messageButton");
const chatWrite = document.getElementById("receiveMessage");
const loginInput = document.getElementById("loginId");
const loginButton = document.getElementById("loginButton");
const fullRoom = document.getElementById("room_full")

const winningRules1 = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
]

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
    // Sending the server which cell was marked and whether it was an "X" or "O"
    socket.send(cell.dataset['cell']+currentMark);
};


function startGame() {
    message.classList.remove('show');
    circleTurn = true;
    for(cell of cells){
        //Clear all the cells to start a new game 
        cell.textContent = "";
        cell.removeEventListener("click", clickManager)
        cell.addEventListener("click", clickManager, {once: true})
    }
}
    

restartButton.addEventListener("click" , (event)=>{
    socket.emit("restart", "restart")
    startGame()
    
});

startGame();


// Listen messages from the server
socket.on('message' , function(data) {
    
    // If one of the players press restart button, restart the game for both parties
    if(data === "restart"){
        startGame();
    }
    
    else if(data[1] === "X" || data[1] === "O"){
        for(cell of cells){
            // Matching the mark with the correct cell by checking its data-attribute
            if(cell.dataset['cell'] === data[0]){
                cell.textContent = data[1];
                //cell.removeEventListener("click")
                swapSides()
                // socket.on('one_move' , function(msg){
                    
                //     if(msg === data[1]){
                //         console.log('my move')
                //         cell.removeEventListener("click")
                //     } else {
                //         cell.addEventListener("click" , clickManager , {once : true})
                //     }
                // })
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

loginButton.addEventListener("click", (event)=>{
    socket.emit('username', loginInput.value);
    document.getElementById("login").style.display = 'none';
    
})

socket.on('private_message', function(msg){
        if(msg === "room_full"){
            fullRoom.classList.add('show')
        } else{
            alert(msg)
    }
    
})

socket.on('private_chat_message', function(msg){
    chatWrite.textContent = msg;
    chatBar.value = ""
})

socket.on('username', function(username){
    
    //document.getElementById("playerInfo").textContent = username;
})