from datetime import date
from flask import Flask, render_template, redirect, request, session
from flask_socketio import SocketIO, send, emit
import bcrypt
from decouple import config

from models.comments import delete_comment, read_comment, write_comment, edit_comment
from models.signup_login import login_check, signup_new_user, score_save, get_score, get_user_score

from time import sleep

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
    return render_template('posts/tic-tac-toe-blogpost.jinja' , comments = comments , user = user )

@app.route('/tic-tac-toe-play' , methods=["GET" ,"POST"])
def tictactoeplay():

    return render_template('posts/tic-tac-toe.jinja')

@app.route('/robot-arm')
def robot_arm():
    url = request.url.split("/")[::-1][0]
    comments = read_comment(url)
    user = session.get('user_name')
    return render_template('posts/robot-arm.jinja' , comments = comments , user = user )

########################## HANDLE POST/GET REQUESTS ################################################

@app.route('/add_comment' , methods =["POST"])
def add_comment():
    
    # Get current date 
    today = date.today().strftime("%d-%m-%Y")
    # Get blog post url to save it in the database accordingly
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


@app.route('/delete', methods = ["POST"])
def delete():
    comment_id = request.form.get("comment-id")
    delete_comment(comment_id)
    return redirect (request.referrer)

########################## SOCKET CONNECTIONS #######################################################

# Create game rooms in a dictionary or add players joining to a game room.
# Rooms will look like the example below. User id of whom created the room will be a key in the dictionary. Second user will be saved with their own id in an array.
# Only two players (element) will be allowed in an array. If a room is inactive for 33 minutes, the key will be deleted from the dictionary. 

# Games = {'8ed9147bba0b44f5948d9a3109d12adf': ['george', 'neil-f415330c93034667925afc981ccaf02f'], 
#           '58141c3efc204af580cb8658113c1b4e': ['lily', 'Susan-23feef494b15455598a665ff1a5baa97'], 
#           '1a6c943d12484fd7973703288e54fd1c': ['Tom', 'Jane-f2f52a9996564e2b84f2e9f844933049']}

games = {}

@socketio.on("game_type")
def game_type(type):
    type = type.split("-")
    user_name = type[1]
    
    if type[0] == "new_game":
        game_id = request.sid
        games[game_id] = [user_name]
        emit('session_id' , game_id , room = game_id)
        
    else:
        game_id = type[0]
        for i in games:
            
            if game_id == i[-10:] and len(games[i]) == 2:
                user_id = request.sid
                emit('session_id' , "full" , room = user_id)
            
            elif game_id == i[-10:]:
                user_id = request.sid
                games[i].append(user_name+'-'+user_id)
                emit('session_id' , game_id , room = user_id)
                
            elif game_id != i[-10:]:
                user_id = request.sid
                emit('session_id' , "none" , room = user_id)
            

# Listenening for the play of 'X' and 'O' then broadcast it to the players in individual rooms

@socketio.on('message')
def receive_message_event(message):
    # Delete disconnected user from the games dictionary.
    if message == "disconnected":
        for i in games:
            if i == request.sid:
                del games[i]
    else:
        for i in games:
            if message == "restart" and (request.sid == i or request.sid == games[i][1].split("-")[1]):
                room_1 = i
                room_2 = games[i][1].split("-")[1]
                socketio.send("restart", room = room_1)
                socketio.send("restart", room = room_2)

            elif request.sid == i:
                room_1 = i
                room_2 = games[i][1].split("-")[1]
                user_name = games[i][0]
                #socketio.send(message, room = room_1)
                socketio.send(message, room = room_2)
                if(message == 'win'):
                    socketio.send(f"{user_name} <br> WINS!!!", room = room_1)
                    socketio.send(f"{user_name} <br> WINS!!!", room = room_2)
                
                elif(message == 'draw'):   
                    socketio.send('draw' , room = room_1)
                    socketio.send('draw' , room = room_2)
                
            elif request.sid == games[i][1].split("-")[1]:
                room_1 = i
                room_2 = games[i][1].split("-")[1]
                user_name = games[i][1].split("-")[0]
                socketio.send(message, room = room_1)
                #socketio.send(message, room = room_2)
                if(message == 'win'):
                    socketio.send(f"{user_name} <br> WINS!!!", room = room_1)
                    socketio.send(f"{user_name} <br> WINS!!!", room = room_2)
                    
                elif(message == 'draw'):  
                    socketio.send('draw' , room = room_1)
                    socketio.send('draw' , room = room_2)
    
# Listening for the chat message and broadcast it to all clients
@socketio.on('chat_message')
def send_chat_message(chat_message):
    for i in games:
        if request.sid == i: 
            user_1 = games[i][0]
            room_1 = i 
            room_2 = games[i][1].split("-")[1]
            socketio.emit('private_chat_message', f"{user_1}: {chat_message}" , room = room_1)
            socketio.emit('private_chat_message', f"{user_1}: {chat_message}" , room = room_2)
        elif request.sid == games[i][1].split("-")[1]:
            user_2 = games[i][1].split("-")[0]
            room_1 = i
            room_2 = games[i][1].split("-")[1]
            socketio.emit('private_chat_message', f"{user_2}: {chat_message}", room = room_1)
            socketio.emit('private_chat_message', f"{user_2}: {chat_message}", room = room_2)
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port= 9000)