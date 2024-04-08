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

    constructor(x,y,velX,velY,color){
        this.x=x;
        this.y=y;
        this.velX=velX;
        this.velY=velY;
        this.color=color;
        this.radius=20;
        this.elasticity=0.95;
        this.friction=0.97;
        this.weight=1;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
    }

    update(){
        if(Math.abs(this.velX)<0.01){
            this.velX=0;
        }
        if(Math.abs(this.velY)<0.01){
            this.velY=0;
        }
        this.x+=this.velX;
        this.y+=this.velY;
        this.velX*=this.friction;
        this.velY*=this.friction; 
        console.log(this.velX,this.velY);
        this.wallCollision(); 
    }
    wallCollision(){
        if(this.x+this.radius>=width){
            this.velX=-this.velX*this.elasticity;
        }
        if(this.y+this.radius>=height){
            this.velY=-this.velY *this.elasticity;
        }
        if(this.x-this.radius<=0){
            this.velX=-this.velX *this.elasticity;
        }
        if(this.y-this.radius<=0){
            this.velY=-this.velY*this.elasticity;
        }
    }
}

let ballsarray=[];
ballsarray.push(new balls(100,100,50,50,'blue'));



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0;i<ballsarray.length;i++){
        
        ballsarray[i].draw();
        ballsarray[i].update();
    }
    requestAnimationFrame(draw);
}

draw();