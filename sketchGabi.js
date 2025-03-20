let myCircle=new circleFunction();

function setup() {
  createCanvas(400, 400);
}


function draw() {
  background(200);
  checkInput();
  myCircle.render();
}

function checkInput() {
  if (keyIsDown(UP_ARROW)) {
    myCircle.move(0,-1);
  } else if (keyIsDown(DOWN_ARROW)) {
    myCircle.move(0,1);
  }
  if (keyIsDown(LEFT_ARROW)) {
     myCircle.move(-1,0);
  } else if (keyIsDown(RIGHT_ARROW)) {
     myCircle.move(1,0);
  }
  
}

function circleFunction(){
  let position={x:0, y:0,d:30};
  let speed=3;
  this.render=function(){
    circle(position.x,position.y,position.d);
  }
  this.move= function(xDir,yDir){
    position.x+=xDir*speed;
    position.y+=yDir*speed;
  }
  
}