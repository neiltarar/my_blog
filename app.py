from flask import Flask, render_template, redirect, request
from flask_socketio import SocketIO, send, emit
import os

from models.tictactoe_logic import *
from models.comments import read_comment , write_comment

app = Flask(__name__)
app.config['SECRET_KEY'] = 'YOUR SECRET KEY HERE'
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('home.jinja')
                
@app.route('/blog')
def blog():
    return render_template('blog.jinja')

@app.route('/tic-tac-toe')
def tic_tac_toe():
    comments = read_comment()[::-1]
    print(comments[::-1])
    return render_template('posts/tic-tac-toe-blogpost.jinja' , comments = comments)

@app.route('/tic-tac-toe-play')
def tictactoeplay():
    return render_template('posts/tic-tac-toe.jinja')

########################## HANDLE POST/GET REQUESTS ################################################33

@app.route('/add_comment' , methods =["POST"])
def add_comment():
    new_comment = request.form.get('comment')
    print(new_comment)
    write_comment(1, new_comment, False)
    # write_comment(0, new_comment , 'False')
    return redirect ('/tic-tac-toe')


########################## SOCKET CONNECTIONS #######################################################

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