from flask import Flask, render_template, redirect, request, session
from flask_socketio import SocketIO, send, emit
import os
import bcrypt
from decouple import config

from models.tictactoe_logic import *
from models.comments import read_comment , write_comment
from models.signup_login import login_check, signup_new_user

app = Flask(__name__)
app.config['SECRET_KEY'] = config('FLASK_SECRET_KEY')
socketio = SocketIO(app)

############################ HOME PAGE ################################

@app.route('/')
def home():
    return render_template('home.jinja')


########################### SIGNUP - LOGIN - LOGOUT HANDLE ########################################
@app.route('/signup' , methods=["POST"])
def signup():
    email = request.form.get('email')
    name = request.form.get('uname')
    password = request.form.get('psw')
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    signup_new_user(email, name , password_hash)
    return redirect(request.referrer)

@app.route('/login' , methods=['POST'])
def login():
    email = request.form.get('e-mail')
    password = request.form.get('psw')

    ###### Handle wrong password entry
    if login_check(email) == []:
        return redirect(request.referrer)
    else:
        result = login_check(email)[0]
        password_hash = result[3]
        valid = bcrypt.checkpw(password.encode(), password_hash.encode())
        if valid == False:
            return redirect(request.referrer)
        else:
            user_id = result[0]
            user_name = result[2]
            session['user_id'] = user_id
            session['user_name'] = user_name
            
            return redirect(request.referrer)

@app.route('/edit')
def edit():
    user_id = session.get('user_id')
    
    print(user_id)

    return redirect(request.referrer)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(request.referrer)

################################# BLOG PAGES ##################################

@app.route('/blog')
def blog():
    return render_template('blog.jinja')

@app.route('/tic-tac-toe')
def tic_tac_toe():
    comments = read_comment()
    user = session.get('user_name')
    user_id = session.get('user_id')
    return render_template('posts/tic-tac-toe-blogpost.jinja' , comments = comments , user=user )

@app.route('/tic-tac-toe-play')
def tictactoeplay():
    return render_template('posts/tic-tac-toe.jinja')

########################## HANDLE POST/GET REQUESTS ################################################

@app.route('/add_comment' , methods =["POST"])
def add_comment():
    new_comment = request.form.get('comment')
    user_id = session.get('user_id')
    print(new_comment)
    print(user_id)
    write_comment(user_id, new_comment)
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