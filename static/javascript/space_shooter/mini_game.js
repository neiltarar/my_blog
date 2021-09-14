let canvas;
let context; 


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
        this.x = spaceshipStartingPoint - 20;
    }

    edge(){
        return this.x;
    }
}

class Spaceship{
    constructor(x , y , z, velocity, opacity){
        this.x = x;
        this.y = y;
        this.z = z;
        this.velocity = velocity;
        this.opacity = opacity;
    }
    draw(){
        
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.y-5, this.z);
        context.lineTo(this.x, this.z+10);
        context.fillStyle = 'black';
        context.fill();
        context.beginPath();
        context.moveTo(this.x,this.y+6);
        context.lineTo(this.x-8, this.z-2);
        context.lineTo(this.x, this.z+4);
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


// variables for the movement of the objects on x dimention
let dx_slow = 0.5;
let dx_med = 2;
let dx_fast = 4;

const laser = [];

let starshipStartingPoint_x = 45;
let starshipStartingPoint_y = 68;
const planet = new Planet(400 , 70 , 25, '#964B00', 0.2)
const spaceship = new Spaceship(20, 55 , 70 , 0 , 1)

function draw() {
    context.clearRect(0,0,500,150);
    spaceship.draw()
    spaceship.flame()
    
    for(let i = 0 ; i < laser.length ; i++){
        laser[i].update()
        }
   
    if(typeof(laser[0])!==undefined && (laser[0]['x'] > 500)){
        // clearing the laser object left the canvas to free space in the memory.
        laser.shift()
    }
    
}
 
function keyUpHandler(e) {
    if(e.keyCode === 32) {
        const laserGun = new LaserGun(starshipStartingPoint_x , starshipStartingPoint_y , 10 ,3 , 'red', 2)
        laser.push(laserGun)
            
    }
}

function init() {
    canvas = document.getElementById('minigame');
    context = canvas.getContext("2d");
    document.addEventListener("keyup", keyUpHandler, false);
   
    return setInterval(draw , 30);
}


init();