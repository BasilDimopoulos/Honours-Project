//collision
//scalable for screen size
//create number of dots that represent 10% of the population each, this can be changed later
//when you get number of infected see how many times tis greater than the value, and convert that many cells into infected
var ratio = 10; // number of dots for the simulation
var xDimension = 1600;
var yDimension = 800;
var sizeOfCricle = 8;
var population = 1000;
var totalInfected = 600;
var valueOfEachCell = Math.round(population / ratio);
var people = [];
var people2 = [];
var people3 = [];
var states = [];
function setup() {
  createCanvas(xDimension,yDimension);
  //SEIRD
  for(var i = 0; i < 30; i ++){
  people.push(new Cell(50,50,300,250,'S'));
  }

  for(var i = 0; i < 11; i ++){
  people.push(new Cell(50,50,300,250,'E'));
  }

  for(var i = 0; i < 4; i ++){
  people.push(new Cell(50,50,300,250,'I'));
  }

  for(var i = 0; i < 2; i ++){
  people.push(new Cell(50,50,300,250,'R'));
  }

  for(var i = 0; i < 1; i ++){
  people.push(new Cell(50,50,300,250,'D'));
  }
  states.push(new section(50,50,500,250,people,"SA"));

  for(var i = 0; i < 3; i ++){
  people2.push(new Cell(50,380,500,325,'S'));
  }

  for(var i = 0; i < 5; i ++){
  people2.push(new Cell(50,380,500,325,'e'));
  }

  for(var i = 0; i < 21; i ++){
  people2.push(new Cell(50,380,500,325,'I'));
  }

  for(var i = 0; i < 18; i ++){
  people2.push(new Cell(50,380,500,325,'R'));
  }

  for(var i = 0; i < 20; i ++){
  people2.push(new Cell(50,380,500,325,'D'));
  }

  states.push(new section(50,380,500,325,people2,"VIC"));


  for(var i = 0; i < 23; i ++){
  people3.push(new Cell(600,50,500,650,'S'));
  }

  for(var i = 0; i < 13; i ++){
  people3.push(new Cell(600,50,500,650,'E'));
  }

  for(var i = 0; i < 12; i ++){
  people3.push(new Cell(600,50,500,650,'I'));
  }

  for(var i = 0; i < 20; i ++){
  people3.push(new Cell(600,50,500,650,'R'));
  }

  for(var i = 0; i < 10; i ++){
  people3.push(new Cell(600,50,500,650,'D'));
  }

  states.push(new section(600,50,500,650,people3,"NSW"));
}

function draw() {
  background(0,0,0);
  for(var i = 0; i < states.length; i++){
  states[i].display();
  states[i].drawCircles();
  }
noStroke();
textSize(32);
fill(255,255,255);
text("Susceptible", 1130, 100);
fill(255,255,0);
text("Exposed", 1130, 200);
fill(255,0,0);
text("Infected", 1130, 300);
fill(0,0,255);
text("Recovered", 1130, 400);
fill(0,255,255);
text("Deceased", 1130, 500);
}

class Cell {
  constructor(xD1,yD1, xD2, yD2, state){
    this.cellx = Math.floor(Math.random() * xD2) + xD1; // give random location on the screen
    this.celly = Math.floor(Math.random() * yD2) + yD1; // give random location on the screen
    this.state = state;
    this.diameter = sizeOfCricle;
    this.xspeed = random(-2,2);
    this.yspeed = random(-2,2);
  }

  move(xD1, yD1, xD2, yD2){
  if(this.state == 'I'){
      this.cellx += this.xspeed/2;
      this.celly += this.yspeed/2;
      }else if(this.state == 'D'){
      }else{
      this.cellx += this.xspeed;
      this.celly += this.yspeed;
  }
  if(this.cellx >= xD2+xD1 - this.diameter/2 || this.cellx <= xD1+ this.diameter/2){
    this.xspeed *= -1;
  }

  if(this.celly >= yD2 + yD1 - this.diameter/2|| this.celly <= yD1 + this.diameter/2){
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

class section{
  constructor(x, y, width, height, people, label){
    this.x= x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.peopleInside = people;
    this.label = label;
  }

  display(){
    stroke(255,255,255);
    noFill();
    rect(this.x,this.y,this.width,this.height);
    text(this.label, this.x, this.height + this.y + 40)
  }

  drawCircles(){
    for(var i = 0; i < this.peopleInside.length; i++){
      this.peopleInside[i].move(this.x, this.y, this.width, this.height);
      this.peopleInside[i].display();
    }
  }
}
