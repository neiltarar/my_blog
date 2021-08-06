from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)

@app.route('/')
def sessions():
    return render_template('index.html')

# Listenening for the play of 'X' and 'O' then broadcast it to all clients
@socketio.on('message')
def receive_message_event(message):
    socketio.send(message, broadcast=True)

# Listening for the chat message and broadcast it to all clients
@socketio.on('chat_message')
def send_chat_message(chat_message):
    socketio.emit('private_chat_message', chat_message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port= 9000)