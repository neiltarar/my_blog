from datetime import date
from flask import Flask, render_template, redirect, request, session
from flask_socketio import SocketIO, send, emit
import os
import bcrypt
from decouple import config

from models.tictactoe_logic import *
from models.comments import delete_comment, read_comment, write_comment, edit_comment
from models.signup_login import login_check, signup_new_user, score_save, get_score, get_user_score

app = Flask(__name__)
app.config['SECRET_KEY'] = config('FLASK_SECRET_KEY')
socketio = SocketIO(app)

############################ HOME PAGE ################################

@app.route('/' , methods=["GET" ,"POST"])
def home():
    user = session.get('user_name')
    scores = get_score()
    high_score = scores[0][0]
    high_score_user = scores[0][1]
    return render_template('home.jinja' , user = user , high_score = high_score , high_score_user = high_score_user)

############################# SCORE CAPTURE & SAVE VIA SOCKET(IO) #################################

@socketio.on('score')
def receive_score(score):
    user_id = session.get('user_id')
    print(user_id)
    user_score = get_user_score(user_id)[0][0]
    if score > user_score:
        score_save(score , user_id)

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
        password_hash = result[5]
        valid = bcrypt.checkpw(password.encode(), password_hash.encode())
        if valid == False:
            return redirect(request.referrer)
        else:
            user_id = result[0]
            user_name = result[4]
            session['user_id'] = user_id
            session['user_name'] = user_name
            
            return redirect(request.referrer)

@app.route('/logout' , methods=["POST"])
def logout():
    message = request.form.get('logout')
    if message == 'logout':
        session.clear()
        return redirect(request.referrer)
    else:
        return redirect(request.referrer)
################################# BLOG PAGES ##################################

@app.route('/blog')
def blog():
    return render_template('blog.jinja')

@app.route('/tic-tac-toe')
def tic_tac_toe():
    url = request.url.split("/")[::-1][0]
    comments = read_comment(url)
    user = session.get('user_name')
    return render_template('posts/tic-tac-toe-blogpost.jinja' , comments = comments , user=user )

@app.route('/tic-tac-toe-play')
def tictactoeplay():
    return render_template('posts/tic-tac-toe.jinja')

@app.route('/robot-arm')
def robot_arm():
    url = request.url.split("/")[::-1][0]
    comments = read_comment(url)
    user = session.get('user_name')
    return render_template('posts/robot-arm.jinja' , comments = comments , user=user )

########################## HANDLE POST/GET REQUESTS ################################################

@app.route('/add_comment' , methods =["POST"])
def add_comment():
    ####################### GET CURRENT DATE ####################################
    today = date.today().strftime("%d-%m-%Y")
    
    url = request.referrer.split("/")[::-1][0]
    new_comment = request.form.get('comment')
    user_id = session.get('user_id')
    write_comment(user_id, new_comment , url , today)
    return redirect (request.referrer)

@app.route('/edit-save', methods=["POST"])
def edit_save():
    today = date.today().strftime("%d-%m-%Y")

    comment_id = request.form.get('comment-id')
    comment = request.form.get('edited-comment')
    user_id = request.form.get('user_id')
    url = request.form.get('url')
    user_id = session.get('user_id')
    edit_comment(user_id, comment_id, comment, today)
    return redirect(f'/{url}')

@app.route('/edit' , methods = ['POST'])
def edit():
    url = request.referrer.split("/")[::-1][0]    
    comment_id = request.form.get('comment-id')
    comment = request.form.get('comment')
    return render_template('/edit.jinja', comment_id = comment_id, comment = comment, url = url)


@app.route('/delete', methods=["POST"])
def delete():
    comment_id = request.form.get("comment-id")
    delete_comment(comment_id)
    return redirect (request.referrer)

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