const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth*0.85;
const height = canvas.height = window.innerHeight*0.75;

console.log(width,height);

const handleResize=()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', handleResize)

class balls{

    constructor(x,y,dx,dy,color,weight=1){
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.color=color;
        this.radius=20;
        this.elasticity=0.95;
        this.friction=0.97;
        this.weight=weight;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
    }

    update(){
        if(Math.abs(this.dx)<0.01){
            this.dx=0;
        }
        if(Math.abs(this.dy)<0.01){
            this.dy=0;
        }
        this.x+=this.dx;
        this.y+=this.dy;
        this.dx*=this.friction;
        this.dy*=this.friction; 
        console.log(this.dx,this.dy);
        this.wallCollision(); 
    }
    wallCollision(){
        if(this.x+this.radius>=width){
            this.dx=-this.dx*this.elasticity;
        }
        if(this.y+this.radius>=height){
            this.dy=-this.dy *this.elasticity;
        }
        if(this.x-this.radius<=0){
            this.dx=-this.dx *this.elasticity;
        }
        if(this.y-this.radius<=0){
            this.dy=-this.dy*this.elasticity;
        }
    }
}

let ballsarray=[];
ballsarray.push(new balls(100,100,0,0,'blue',1));
ballsarray.push(new balls(100,500,0,-20,'red',2));


function ballCollide(ball1, ball2) {
    // Calculate the distance between the balls
    var dx = ball1.x - ball2.x;
    var dy = ball1.y - ball2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the angle of the collision
    var angle = Math.atan2(dy, dx);

    // Calculate the components of the velocity of each ball
    var velocity1 = Math.sqrt(ball1.dx * ball1.dx + ball1.dy * ball1.dy);
    var velocity2 = Math.sqrt(ball2.dx * ball2.dx + ball2.dy * ball2.dy);

    // Calculate the direction of each ball
    var direction1 = Math.atan2(ball1.dy, ball1.dx);
    var direction2 = Math.atan2(ball2.dy, ball2.dx);

    // Calculate the new velocity of each ball
    var velocity1x = velocity1 * Math.cos(direction1 - angle);
    var velocity1y = velocity1 * Math.sin(direction1 - angle);
    var velocity2x = velocity2 * Math.cos(direction2 - angle);
    var velocity2y = velocity2 * Math.sin(direction2 - angle);

    // The final velocities after collision are calculated considering the mass and elasticity
    var finalVelocity1x = ((ball1.weight - ball2.weight) * velocity1x + 2 * ball2.weight * velocity2x) / (ball1.weight + ball2.weight) * ball1.elasticity;
    var finalVelocity2x = ((ball2.weight - ball1.weight) * velocity2x + 2 * ball1.weight * velocity1x) / (ball1.weight + ball2.weight) * ball2.elasticity;

    // Convert velocities back to vectors
    ball1.dx = Math.cos(angle) * finalVelocity1x + Math.cos(angle + Math.PI/2) * velocity1y;
    ball1.dy = Math.sin(angle) * finalVelocity1x + Math.sin(angle + Math.PI/2) * velocity1y;
    ball2.dx = Math.cos(angle) * finalVelocity2x + Math.cos(angle + Math.PI/2) * velocity2y;
    ball2.dy = Math.sin(angle) * finalVelocity2x + Math.sin(angle + Math.PI/2) * velocity2y;

    if (distance < ball1.radius + ball2.radius) {
        var overlap = ball1.radius + ball2.radius - distance;
        var angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
        ball1.x -= overlap * Math.cos(angle) / 2;
        ball1.y -= overlap * Math.sin(angle) / 2;
        ball2.x += overlap * Math.cos(angle) / 2;
        ball2.y += overlap * Math.sin(angle) / 2;
    } else {
        // If balls are not overlapping, they should not be moving towards each other
        var relativeVelocityX = ball2.dx - ball1.dx;
        var relativeVelocityY = ball2.dy - ball1.dy;
        var relativeVelocityDotProduct = dx * relativeVelocityX + dy * relativeVelocityY;
        if (relativeVelocityDotProduct > 0) {
            return;  // Balls are moving apart, not colliding
        }
    }
  }

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collision detection
    for (let i = 0; i < ballsarray.length; i++) {
        for (let j = i + 1; j < ballsarray.length; j++) {
            const dx = ballsarray[i].x - ballsarray[j].x;
            const dy = ballsarray[i].y - ballsarray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballsarray[i].radius + ballsarray[j].radius) {
                ballCollide(ballsarray[i], ballsarray[j]);
            }
        }
    }
    for(let i=0;i<ballsarray.length;i++){
        
        ballsarray[i].draw();
        ballsarray[i].update();
    }
    requestAnimationFrame(draw);
}

draw();