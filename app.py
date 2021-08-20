from flask import Flask, render_template,request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'YOUR SECRET KEY HERE'
socketio = SocketIO(app)

@app.route('/')
def sessions():
    return render_template('index.html')

users = {}
usernames = []
winningRules1 = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
]

result = []
count = 0

# Checking if all 
# elements in a List are same 
def checkList(lst):
    ele = lst[0]
    chk = True
    
    # Comparing each element with first item 
    for item in lst:
        if ele != item:
            chk = False
            break;
              
    if (chk == True and count < 10): 
        result.append("win")
        

def winningRule(msg):
    global count
    count += 1
    for i in range(len(winningRules1)):
        
        a = winningRules1[i]
        for item in range(3):
            
            if(a[item] == int(msg[0])):
                a[item] = [str(msg[1])]
                checkList(a)
                

@socketio.on('username')
def receive_username(username):
    if(len(users) < 2):
        users[username] = request.sid
        userId = users[username]
        usernames.append(username)
        length = len(users)
        emit('username', username, broadcast=True)
        emit('private_message', f"You are Player {length} {username}" , room=userId)
    elif(len(users) >= 2):
        users[username] = request.sid
        userId = users[username]
        emit('private_message', "room_full", room=userId)


# Listenening for the play of 'X' and 'O' then broadcast it to all clients
@socketio.on('message')
def receive_message_event(message):
    global count
    socketio.emit('one_move' , message[1], room = request.sid)
    for i in range(2):
        if(request.sid == users[usernames[i]]):
            winningRule(message) 
            if(result == ['win']):
                count = 0
                result.clear()
                socketio.send(f"{usernames[i]} <br> WINS!!!", broadcast=True)
            elif(count == 9):
                count = 0
                socketio.send('DRAW' , broadcast = True)
            socketio.send(message, broadcast=True)
    
            
            
@socketio.on('restart')
def restart(msg):
    global winningRules1
    winningRules1 = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
]
    if msg == "restart":
        socketio.send(msg, broadcast=True)
    
# Listening for the chat message and broadcast it to all clients
@socketio.on('chat_message')
def send_chat_message(chat_message):
    socketio.emit('private_chat_message', chat_message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port= 9000)