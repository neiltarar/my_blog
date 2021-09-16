let canvas;
let context; 

canvas = document.getElementById('minigame');
context = canvas.getContext("2d");

document.addEventListener("keyup", keyUpHandler, false);

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


//let laserGun = new LaserGun(lasergunStartingPoint_x , lasergunStartingPoint_y , 10 ,3 , 'red', 2)

// function draw() {
//     
//     spaceship.draw()
//     spaceship.flame()
    
//     planets.forEach(planet => {
//         planet.draw()
//         planet.update()
//         const distance = Math.hypot(laser[0]['x'] - planet['x'] , laser[0]['y'] - planet['y'])
        
//     });

//     console.log(planets)
//     // laser.x - planet.x , laser.y - planet.y
    
//     const distance = Math.hypot(laser[0]['x'] - planets[0]['x'] , laser[0]['y'] - planets[0]['y'])
//     //console.log(distance)
    
//     for(let i = 0 ; i < laser.length ; i++){
//         laser[i].update()
//         };
    
//     
    
//     if(distance - planets[0]['r'] < 1){
//         planets.shift();
//         laser.shift();
//     };
    
//     if(planets[0]['x'] < 0){
//         planets.shift()
//     };
// }
 

const laser_array = [];
const planets = [];

let starshipStartingPoint_x = 45;
let starshipStartingPoint_y = 68;
let lasergunStartingPoint_x = starshipStartingPoint_x
let lasergunStartingPoint_y = starshipStartingPoint_y
let spaceship = new Spaceship(20, 55 , 70 , 0 , 1)


// // Random Planet Spaw Funtion using `Math.floor(Math.random() * (max - min + 1)) + min`
// // y coordinate between 25 - 175
// // r (size) between size 10 -25
// // time interval between 1000 - 3000
function spawnPlanet() {
    setInterval(() => {
        const x = 600;
        const y = Math.floor(Math.random() * 151) + 25;
        const r = Math.floor(Math.random() * 16) + 10;
        const color = '#964B00';
        const velocity = 1;

        planets.push(new Planet(x , y , r , color , velocity));

    } , Math.floor(Math.random() * 1999) + 1000)
};

spawnPlanet();

function animate() {
    requestAnimationFrame(animate)
    context.clearRect(0,0,600,200);
    spaceship.draw();
    spaceship.flame();

    laser_array.forEach(laser => {
        laser.update()
    })
    
    planets.forEach((planet)=>{
        planet.update()
        let distance = Math.hypot(laser_array[0]['x'] - planet['x'] , laser_array[0]['y'] - planet['y'])
        console.log(distance)
        if(distance - planet['r'] < 1){
                    planets.shit();
                    laser.shift();
                };
    });

    if((laser_array[0]['x'] > 600)){
            // clearing the laser object when it leaves the canvas to free space in the memory.
            laser_array.shift()
            }
};
    

function keyUpHandler(e) {
    if(e.keyCode === 32) {
        laser_array.push(new LaserGun(lasergunStartingPoint_x , lasergunStartingPoint_y , 10 ,3 , 'red', 2))   
    }
}

animate()



    