const score = document.getElementById("score");
const loginButton = document.getElementById("login");
const modal = document.getElementById('id01');
const signupWindow = document.getElementById('signup-window');
const signupButton = document.getElementById('signup-button');
const closeButton = document.getElementById('close-window');
const signupCloseButton = document.getElementById('signup-close-window');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const saveScoreButton = document.getElementById('save-score-button');

const socket = io();

let start = 0;

let canvas;
let context; 

canvas = document.getElementById('minigame');
context = canvas.getContext("2d");


document.addEventListener("keydown" , keyDownHandler, false);

class Planet{
    constructor(x , y , r , color , velocity){
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        // brown color code: '#964B00'
        context.fillStyle = this.color;
        context.fill();
    }
    update(){
        this.draw();
        this.x -= this.velocity; 
    }
}

class LaserGun{
    constructor(x , y, w , h, color , velocity){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.rect(this.x , this.y, this.w ,this.h);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity;
    }

    reset() {
        this.x = starshipStartingPoint_x;
    }

    edge(){
        return this.x;
    }
}

class Spaceship{
    constructor(x1 , y1 , x2, y2 ,x3 ,y3 , opacity){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.opacity = opacity;
    }
    draw(){
        context.beginPath();
        context.moveTo(this.x1,this.y1);
        context.lineTo(this.x2, this.y2);
        context.lineTo(this.x3, this.y3);
        context.fillStyle = 'rgb(255, 200, 250)';
        context.fill();
        context.beginPath();
        context.moveTo(this.x1,this.y1-6);
        context.lineTo(this.x2-40, this.y2-2);
        context.lineTo(this.x1, this.y3+6);
        context.fillStyle = `rgba(255, 0, 0, ${this.opacity})`;
        context.fill();
    }
    flame(){
        if(this.opacity >= 0 ){
            this.opacity -= 0.09;
            if (this.opacity <= 0){
                this.opacity = 1
            }
        } 
        
    }
}   

// Create an animation frame variable and assign it to undefined.
let animationFrame 

let starshipStartingPoint_x = 70;
let starshipStartingPoint_y = 50;
let lasergunStartingPoint_y = starshipStartingPoint_x;
let lasergunStartingPoint_x = starshipStartingPoint_y;
let spaceship = new Spaceship(20, 80 , starshipStartingPoint_y , starshipStartingPoint_x , 20, 55 , 1);

let point = 0;

// Populate laser beams and planets to refresh frame create movement
const laser_array = [];
const planets = [];

// // Random Planet Spaw Funtion using `Math.floor(Math.random() * (max - min + 1)) + min`
// // y coordinate between 25 - 175
// // r (size) between size 10 - 25 (25 = 3pt , 10 = 10pt)
// // time interval between 1000 - 3000
function spawnPlanet() {
    setInterval(() => {
        const colorVariable1 = Math.floor(Math.random() * (256))
        const colorVariable2 = Math.floor(Math.random() * (256))
        const colorVariable3 = Math.floor(Math.random() * (256))
        const x = 600;
        const y = Math.floor(Math.random() * 151) + 25;
        const r = Math.floor(Math.random() * 16) + 10;
        const color = `rgb(${colorVariable1} , ${colorVariable2} , ${colorVariable3})`;
        const velocity = Math.floor(Math.random() * (6 -1 +1)) +1;

        planets.push(new Planet(x , y , r , color , velocity));

    } , Math.floor(Math.random() * 1999) + 1000)
};


function animate() {
    score.innerText = `Score:${point}`;
    animationFrame = requestAnimationFrame(animate)
    context.clearRect(0,0,600,200);
    spaceship.draw();
    spaceship.flame();
    laser_array.forEach((laser , index) => {
        laser.update();
        // clearing the laser object when it leaves the canvas to free space in the memory.
        if(laser.x > 600){
            setTimeout(() => {
                laser_array.splice(index , 1);
            }, 0);
        };
    });
    
    planets.forEach((planet , index)=>{
        planet.update()
        let distance1 = Math.hypot(spaceship.x1 - planet.x, spaceship.y1 - planet.y)
        let distance2 = Math.hypot(spaceship.x2 - planet.x, spaceship.y2 - planet.y)
        let distance3 = Math.hypot(spaceship.x3 - planet.x, spaceship.y3 - planet.y)
        // Detect collision
        if(distance1 - planet.r < 1 || distance2 - planet.r < 1 || distance3 - planet.r < 1){
            // Freeze the animation on the frame where the laser touches the spaceship
            cancelAnimationFrame(animationFrame);
            context.font = "50px Press-Start-2P";
            context.fillStyle = 'red';
            context.texAlign = "center";
            context.fillText("GAME OVER!",  50, 120);
            socket.emit('score', point);
        };

        laser_array.forEach((laser , laserIndex) => {
            let distance = Math.hypot(laser.x - planet.x , laser.y - planet.y)

            // Detect when and which planet the laser hits:
            if(distance - planet.r < 1){
                if(planet.r < 15){
                    point += 10;
                }else if(planet.r > 15 && planet.r < 20){
                    point += 5;
                }else{
                    point += 3;
                }
                // Avoid the screen flashing when remove objects from the array/frame
                setTimeout(() => {
                    planets.splice(index, 1);
                    laser_array.splice(laserIndex, 1);
                } , 0);
            };
        });
        
        // clearing the planet object when it leaves the canvas to free space in the memory.
        if(planet.x < 0){
            setTimeout(() => {
                planets.splice(index , 1);
            }, 0);
        };
    });

};
    

// function keyUpHandler(e) {
//     if(e.keyCode === 32) {
//         laser_array.push(new LaserGun(lasergunStartingPoint_x , lasergunStartingPoint_y , 10 ,3 , 'red', 2))   
//     }
// }

function keyDownHandler(e) {
    if(e.keyCode === 32) {
        laser_array.push(new LaserGun(lasergunStartingPoint_x , lasergunStartingPoint_y , 10 ,3 , 'red', 2))   
    }
    if(e.keyCode === 68){
        spaceship.x1 += 3;
        spaceship.x2 += 3;
        spaceship.x3 += 3;
        lasergunStartingPoint_x += 3;

        if(spaceship.x1 >= 550){
            spaceship.x1 -= 3;
            spaceship.x2 -= 3;
            spaceship.x3 -= 3;
            lasergunStartingPoint_x -= 3
        };
    }else if(e.keyCode === 65){
        spaceship.x1 -= 3;
        spaceship.x2 -= 3;
        spaceship.x3 -= 3;
        lasergunStartingPoint_x -= 3;

        if(spaceship.x1 <= 0){
            spaceship.x1 += 3;
            spaceship.x2 += 3;
            spaceship.x3 += 3;
            lasergunStartingPoint_x += 3;
        };
    }else if(e.keyCode === 87){
        spaceship.y1 -= 3;
        spaceship.y2 -= 3;
        spaceship.y3 -= 3;
        lasergunStartingPoint_y -= 3;

        if(spaceship.y3 <= 0){
            spaceship.y1 += 3;
            spaceship.y2 += 3;
            spaceship.y3 += 3;
            lasergunStartingPoint_y += 3;
        };
    }else if(e.keyCode === 83){
        spaceship.y1 += 3;
        spaceship.y2 += 3;
        spaceship.y3 += 3;
        lasergunStartingPoint_y += 3;

        if(spaceship.y3 >= 175){
            spaceship.y1 -= 3;
            spaceship.y2 -= 3;
            spaceship.y3 -= 3;
            lasergunStartingPoint_y -= 3;
        };
    }
};

spawnPlanet();
animate();

loginButton.addEventListener('click' , (event) => {
    modal.classList.add('show')
});

function showEditBox() {
    console.log('pressed')
    editBox.classList.add('show')
};

closeButton.addEventListener('click' , (event) => {
        modal.classList.remove('show')
});

signupButton.addEventListener('click' , (event) =>{
    signupWindow.classList.add('show')
    console.log('pressed')
    modal.classList.remove('show')
});

signupCloseButton.addEventListener('click' , (event)=>{
    signupWindow.classList.remove('show')
});



function validatePassword(){
    if(password.value !== confirmPassword.value){
        confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPassword.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;
