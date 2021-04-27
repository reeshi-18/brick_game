const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const score= document.querySelector('#score');
const hscore= document.querySelector('#hscore');
let point=0;

const begin= document.querySelector('#begin');
const board= document.querySelector('.board');
const showPoint= document.querySelector('#showpoint');


var isLeft=false;
var isRight=false;

//handling keyboard input
addEventListener('keydown',(event)=>{
    if(event.keyCode==37){
        isLeft=true;
        isRight=false;
    }
    else if(event.keyCode==39){
        isLeft=false;
        isRight=true;
    }
});

window.addEventListener('keyup',()=>{
    isLeft=false;
    isRight=false;
});


var slider_sprite= new Image();
slider_sprite.src='assets/yellowbrick.png'

// creating the slider
class Slider{
    constructor(x,y,w,h,color){
        this.x=x;
        this.y=y;
        this.width=w;
        this.height=h;
        this.color=color;
        this.dx=10;
    }
    
    draw(){
        /*ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.closePath();*/

        ctx.drawImage(slider_sprite,0,0,384,130,this.x,this.y,this.width,this.height);
    }

    update(){
        this.draw();
        if(isRight && this.x+this.width<canvas.width){
            this.x=this.x+this.dx;
        }
        else if(isLeft && this.x>0){
            this.x=this.x-this.dx;
        }
    }

    
}


//creating the ball

class Player{
    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.dx=8;
        this.dy=8;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(){
        this.draw();
        this.x=this.x+this.dx;
        this.y=this.y+this.dy;

        if(this.x+this.radius>canvas.width || this.x-this.radius<0)
        {
            this.dx=-this.dx;
        }
        if(this.y-this.radius<0)
        {
            this.dy=-this.dy;
        }
        if(this.y+this.radius>canvas.height)
        {
            for(let i=0; i<5; i++)
            {
               particles.push(new Particle(player.x, player.y+player.radius,3,'rgb(255,255,255)',Math.random()-0.5, Math.random()-1.5));
            }

            cancelAnimationFrame(animationId);
            board.style.display='flex';
            if(point>localStorage.getItem('hscore'))
            {
                localStorage.setItem('hscore',point);
            }
            hscore.innerHTML= localStorage.getItem('hscore');
            
            

            //this.dy=-this.dy;
        }

    }
}




//collision between ball and slider
function collison_ball_slider(){
    if(player.y+player.radius>=slider.y && player.y-player.radius<=slider.y+slider.height && player.x+player.radius>=slider.x && player.x-player.radius<=slider.x+slider.width)
    {
        player.dy=-player.dy;
    }
}


var brick_sprite1= new Image();
var brick_sprite2= new Image();
brick_sprite1.src= 'assets/skybrick.png';
brick_sprite2.src= 'assets/breaksky.png';


//creating the bricks
class Brick{
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.width=w;
        this.height=h;
        this.color='brown';
        this.frame=1;
    }

    draw(){
        /*ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.closePath();*/
            if(this.frame==1)
            {
                ctx.drawImage(brick_sprite1,0,0,378,127,this.x,this.y,this.width,this.height);

            }
            else
            {
                ctx.drawImage(brick_sprite2,0,0,384,130,this.x,this.y,this.width,this.height);

            }   
    }

}


let brickArr=[];
let brickIndex=0;
let particles=[];
let player;
let slider;

function init(){

    
    player= new Player(canvas.width/2 -130,650,12,'white');
    slider= new Slider(canvas.width/2 - 130,680,130,20,'green');
    particles=[];
    brickArr=[];
    brickIndex=0;
    point=0;
    score.innerHTML=point;
    



    for(var i=0;i<320;i+=37)
    {
    for(var j=0;j< canvas.width-65;j+=65)
    {
        if(i%2==0)
        {
            brickArr[brickIndex]= new Brick(5+j,60+i,60,35);
        }
        else
        {
            brickArr[brickIndex]= new Brick(25+j,60+i,60,35);
        }
        
        brickIndex++;
    }
}

    animation=true;
}





class Particle{
    constructor(x,y,radius,color,dx,dy)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.dx=dx;
        this.dy=dy;
        this.alpha=1;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha=this.alpha;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2, false);
        ctx.fillStyle=this.color;
        ctx.fill();
        ctx.restore();
    }

    update(){
        this.draw();
        this.x+=this.dx;
        this.y+=this.dy;
        this.alpha-=0.01;
    }
}


//collision between brick and ball
function collision_brick_ball()
{
    brickArr.forEach((b,index)=>{
        if(player.y-player.radius<=b.y+b.height && player.y+player.radius>=b.y && player.x+player.radius>=b.x && player.x-player.radius<=b.x+b.width)
        {
            player.dy=-player.dy;

            for(let i=0; i<8; i++)
            {
               particles.push(new Particle(player.x, player.y-player.radius,3,'rgb(12,149,170)',Math.random()-0.5, Math.random()+0.5));
            }

            if(b.frame==1)
            {
                point+=10;
            }
            else
            {
                point+=20;
            }

            score.innerHTML= point;
            showPoint.innerHTML=point;
            b.frame++;

    

            if(b.frame==3)
            {
                brickArr.splice(index,1);
            }
            
        }
    });
}


//controls the game
function gameplay(){
    
    slider.update();
    player.update();
    for(i=0;i<brickArr.length;i++)
    {
        brickArr[i].draw();
    }

    
    particles.forEach((particle,index)=>{
        if(particle.alpha<=0.0){

            particles.splice(index,1);
    
        }
        else{
        particle.update();
        
            
        }
        
    });
    
    collison_ball_slider();
    collision_brick_ball();
}




let animationId=0;

function animate(){

    if(animation)
    {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        gameplay();
        requestAnimationFrame(animate);
    }
    

}

let animation=false;

begin.addEventListener('click',()=>{

        animation=false;
        setTimeout(()=>{
            init();
        animate();
        board.style.display='none';
        },500);
        
    
    
    
    
});
