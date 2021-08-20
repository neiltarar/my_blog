#!main.py

from os import read, write
from typing import ClassVar
from flask import Flask, render_template,request
from flask_socketio import SocketIO, send, emit
import csv
import numpy as np
from functions import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sdfjkhlhjk*sop_90934sdkl'
socketio = SocketIO(app)


@app.route('/')
def sessions():
    return render_template('index.html')

users = {}
usernames = []
csv_lines = []


# read csv

# csv_reset(csv_lines)
# csv_lines1 = np.array(csv_lines)
# csv_lines1[csv_lines1 == 'X'] = '0'


# csv_lines = []

#write cvs
# csv_write(csv_lines1)
#resets
# csv_write(csv_lines)
# result = []

# def winningRule(msg):
@socketio.on('active_game')
def current_game(msg):
    csv_rewrite_array(csv_lines)
    print(msg)
    print(usernames[-1])
    if msg == 'send':
        game_board = []
        for row in csv_read():
            for i in row:
                game_board.append(i)
                
        emit('active_game' , game_board, room = users[usernames[-1]])

    
    #print(winningRules[i])
    # a = winningRules1[i]
    # for item in range(3):
        #print(a[item])
        # if(a[item] == int(msg[0])):
        #     a[item] = [str(msg[1])]
        #     checkList(a)
            

#print(winningRules)
@socketio.on('marked_cell')
def broadcast_gameplay(data):
    # print(data)
    
    csv_lines1 = np.array(csv_lines)
    print(csv_lines1)
    csv_lines1[csv_lines1 == data[0]] = data[1]
    csv_write(csv_lines1)
    csv_lines.clear()
    csv_rewrite_array(csv_lines)



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
        usernames.append(username)
        emit('private_message', f"Hi {username}, the room is full.\n You can watch as a guest.", room=userId)
    

# Listenening for the play of 'X' and 'O' then broadcast it to all clients
# @socketio.on('message')
# def receive_message_event(message):
#     print(message)
#     print(request.sid)
#     for i in range(2):
#         #print(usernames[i])
#         if(request.sid == users[usernames[i]]):
#             #print(users[usernames[i]])
#             winningRule(message) 
#             print(result)
#             if(result == ['win']):
#                 socketio.send(f"{usernames[i]}", broadcast=True)
#             socketio.send(message, broadcast=True)
            
            
@socketio.on('restart')
def restart(msg):
    if msg == 'restart':
        socketio.emit('restart', 'restart', broadcast = True)


# # # Listening for the chat message and broadcast it to all clients
@socketio.on('chat_message')
def send_chat_message(chat_message):
    socketio.emit('private_chat_message', chat_message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port= 8000)