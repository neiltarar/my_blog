let canvas 
let context 


function planet(x , y, r){
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2, true);
    context.fillStyle = '#964B00';
    context.fill();
}


function spaceship(x , y, z){
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(y-5, z);
    context.lineTo(x, z+10);
    context.fillStyle = 'black';
    context.fill();
}

function spaceshipFlame(x , y , z , t) {
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x-10, z);
    context.lineTo(x, z+6);
    context.fillStyle = `rgba(255, 0, 0, ${t})`;
    context.fill();
}

// function laserGun(x , y, w, h){
//     context.beginPath();
//     context.rect(x , y, w ,h);
//     context.closePath();
//     context.fillStyle = 'blue';
//     context.fill();
    
// }
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
        this.x = spaceshipStartingPoint - 20;
    }

    edge(){
        return this.x;
    }
}


// variables for the movement of the objects on x dimention
let dx_slow = 0.5;
let dx_med = 2;
let dx_fast = 4;

let flameInterval = 0.1;
let planetStartingPoint = 525;
let spaceshipStartingPoint = 55;
let laserStartingPoint = spaceshipStartingPoint - 20;
let gameOver = false;
let spacePressed = false;
let planetDestroyed = false;
let accelerate = true;

const laser = [];

const laserGun = new LaserGun(spaceshipStartingPoint - 20 , 70 , 10 ,3 , 'blue', 0.5)

function draw() {
    context.clearRect(0,0,500,150);
    if (spacePressed === true) {
        laser.push(laserGun)
        console.log(laser)
        
        accelerate = true
      
        if (accelerate === true){
            laser.forEach(laserGun => {
                laserGun.update();
                if(planetStartingPoint - laserGun.edge() < 0 && planetDestroyed === false){
                    laser.pop()
                }
            })
            
        }
        spacePressed === false
    }

    if (planetStartingPoint - (spaceshipStartingPoint+5) < 0){
        context.font = "20px Press-Start-2P";
        context.fillStyle = 'red'
        context.fillText("GAME OVER!", 150, 80);
        gameOver = true;

    } if (flameInterval > 1) {
        flameInterval = 0.1; 

    }  if (planetStartingPoint - laserGun.edge() < 0 && planetDestroyed === false) {
        planetStartingPoint = 500;
        accelerate = false;
        spacePressed = false;
        // planetDestroyed = true;
        console.log(planetDestroyed)
      
        laserGun.reset()
        flameInterval += 0.06;
        
            // if (gameOver === false && planetDestroyed === false){
            //     spaceship(20, spaceshipStartingPoint , 70);
            //     spaceshipFlame(20 , 62 , 68 , flameInterval);
            //     gameOver = true;
            // }

    } else {
        spaceship(20, spaceshipStartingPoint , 70);
        spaceshipFlame(20 , 62 , 68 , flameInterval);
        planet(planetStartingPoint , 55 , 25);
        flameInterval += 0.06;
        planetStartingPoint -= dx_fast;
       
    };
    
};

function keyUpHandler(e) {
    if(e.keyCode === 32) {
        console.log("pressed")
        spacePressed = true;
    }
}

function init() {
    canvas = document.getElementById('minigame');
    context = canvas.getContext("2d");
    document.addEventListener("keyup", keyUpHandler, false);
    
    return setInterval(draw , 20);
}


init();