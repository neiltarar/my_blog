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

const my_board  = [0,1,2
    ,3,4,5
    ,6,7,8
    ,0,3,6
    ,1,4,7
    ,2,5,8
    ,0,4,8
    ,2,4,6]

function swapSides() {
    circleTurn = !circleTurn;
};



function clickManager(event){ 
    
    const cell = event.target;
    const currentMark = circleTurn ? oClass : xClass;
    cell.textContent = currentMark
    swapSides()
    // Sending the server which cell was marked and whether it was an "X" or "O"
    
    socket.emit('marked_cell' , cell.dataset['cell']+currentMark);
};


function startGame() {
    message.classList.remove('show');
    circleTurn = true;
    for(cell of cells){
        //Clear all the cells to start a new game 
        cell.textContent = "";
        cell.removeEventListener("click", clickManager)
        socket.emit("restart", "restart")
        cell.addEventListener("click", clickManager, {once: true})
    }
}
    

restartButton.addEventListener("click" , startGame);

startGame();



chatButton.addEventListener("click", (event) =>{
    socket.emit('chat_message' , chatBar.value);
});



chatBar.addEventListener("keydown", function search(e){
    if(e.keyCode === 13){
        chatButton.click();
    }
})



loginButton.addEventListener("click", (event)=>{
    // sending the server 'send' message on 'active_game' socket listener to send
    // data on the current gameplay. By this way if a user joins to an ongoing game
    // they can see the game that was played before they joined. 
    
    socket.emit('username', loginInput.value);
    socket.emit('active_game' , 'send');
    // Listening the server for the recent information about the game board. The data
    // comes as an array 'game_board'
    socket.on('active_game' , function(data){
        
        count = 0;

        for (let i of data) {
          console.log("printing i " + i)
          count++
            
            if (i === 'X' || i === 'O') {
                console.log("printing count " + count);
                console.log("my board " + my_board[count-1])
                document.querySelectorAll('#cell')[my_board[count-1]].textContent = i;
            } 
        
        }
      
      })
    
    document.getElementById("login").style.display = 'none';
})



socket.on('private_message', function(msg){
    alert(msg)
})



socket.on('private_chat_message', function(msg){
    chatWrite.textContent = msg;
    chatBar.value = ""
})



socket.on('username', function(username){
    console.log(username);
    // document.getElementById("playerInfo").textContent = username;
})



socket.on('restart', function(msg){
    if (msg === 'restart'){
        restartButton.click();
    };
});

