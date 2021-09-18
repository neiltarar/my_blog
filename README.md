# Personal Blog - Website
## Second GA Project:
<br><br/>
![mock_image](./static/images/mock_images/my_blog/my_blog_main_mock.png)
<br><br/>
# Dependencies:

- For full list please check [here](./requirements.txt)
- https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js
<br> <br/>

### Installation of dependencies:

Please intall the adviced versions, there are some backwards compatibility issues with SocketIO.
<br>

`pip install -r requirements.txt`

<br><br/>
# Overlook

After completing this project I will be serving this as my personal website on https://neil-tarar.com
For the demonstration purposes I will be serving the site on port 80 without an encryption key on http://neil-tarar.com

The site runs on Flask server, some sections are using [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/). I used an apache server to reverse proxy to the flask server and port forwarded it to the internet on http://neil-tarar.com. 

I will be sharing my projects on the [blog](http://neil-tarar.com/blog) section. I designed the website to reflect my personality and I wrote a mini game to be put on the [main page](http://neil-tarar.com). By this way I am hoping to make the website more engaging. I have been inspired by good old [Astroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)) game which I spent countless hours playing on my Atari!  

![mini_game_Mock_image](./static/images/mock_images/my_blog/space_shooter_mock.png) 

If users login with their accounts their scores will be captured automatically when the game ends. The Highest score is visible on the main page to showcase the glory of the score owner. 

<p align="center" width="100%">
    <img width="33%" src="./static/images/mock_images/my_blog/login_mock.png?style=centerme">
</p>

<br>

## Blog Comments



# Future Improvements

Detect if the username is taken. Add more games to the main page. 

<br><br/>
# What I Learned
I spent majority of my time on researching and learning how to use Flask Socketio library as well as Apache Server settings. I learned how to create individual rooms to broadcast to a targeted audience however I didn't have enough time to implement this before the presentation day.  
