var xDimension = 1200;
var yDimension = 750;
var people = [];
function setup() {
  createCanvas(1500,800);
  for(var i = 0; i < random(5) + 1;i++){
      people.push(new Cell('S'));
  }
  for(var i= 0; i < random(5) + 1;i++){
      people.push(new Cell('E'));
  }
  for(var i= 0; i < random(5) + 1;i++){
      people.push(new Cell('I'));
  }
  for(var i= 0; i < random(5) + 1;i++){
      people.push(new Cell('R'));
  }
  for(var i= 0; i < random(5) + 1;i++){
      people.push(new Cell('D'));
  }
  print("Hello");
}

function draw() {
  background(110,110,110);
  fill(110,110,110);
  stroke(255,255,255);
  rect(0,0,xDimension,yDimension);
  noStroke();
  for(var i = 0; i < people.length; i++){
  people[i].move();
  people[i].display();
  }

  textSize(32);
  fill(255,255,255);
  text("Susceptible", 1250, 100);
  fill(255,255,0);
  text("Exposed", 1250, 200);
  fill(255,0,0);
  text("Infected", 1250, 300);
  fill(0,0,255);
  text("Recovered", 1250, 400);
  fill(0,255,255);
  text("Deceased", 1250, 500);
}

class Cell {
  constructor(state){
    this.cellx = Math.floor(Math.random() * xDimension - 20) + 1; // give random location on the screen
    this.celly = Math.floor(Math.random() * yDimension - 20) + 1; // give random location on the screen
    this.state = state;
    this.diameter = 20;
    this.xspeed = random(-3,3);
    this.yspeed = random(-3,3);
    console.log(this.yspeed);
  }

  move(){
    if(this.state == 'I'){
    this.cellx += this.xspeed/2;
    this.celly += this.yspeed/2;
    }else if(this.state == 'D'){
    }else{
    this.cellx += this.xspeed;
    this.celly += this.yspeed;
  }
  if(this.cellx >= xDimension -10 || this.cellx <= 10){
    this.xspeed *= -1;
  }else if(this.celly >= yDimension - 10 || this.celly <= 10){
    this.yspeed *= -1;
    }
  }

  display(){
    if(this.state == "S"){
      fill(255,255,255);
    }else if(this.state == "E") {
      fill(255,255,0);
    }else if(this.state == "I") {
      fill(255,0,0);
    }else if(this.state == "R") {
      fill(0,0,255);
    }else if(this.state == "D") {
      fill(0,255,255);
    }
    ellipse(this.cellx, this.celly, this.diameter, this.diameter);
  }
}
