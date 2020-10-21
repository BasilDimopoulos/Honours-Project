var ratio = 10; // number of dots for the simulation
var xDimension = 1200;
var yDimension = 800;
var sizeOfCricle = 8;
var population = 1000;
var totalInfected = 600;
var valueOfEachCell = Math.round(population / ratio);
var people = [];
var people2 = [];
var people3 = [];
var people4 = [];
var selectedPeople = [];
var states = [];
var enableMovement = false;
var selectedS = 20;
var selectedE = 20;
var selectedI = 20;
var selectedR = 20;
var selectedD = 20;

function setup() {
  createCanvas(xDimension,yDimension);

  for(var i = 0; i < 9; i ++){
  people.push(new Cell(910,90,220,80,'S'));
  people.push(new Cell(910,90,220,80,'E'));
  people.push(new Cell(910,90,220,80,'I'));
  people.push(new Cell(910,90,220,80,'R'));
  people.push(new Cell(910,90,220,80,'D'));
  }
  states.push(new section(900,82,240,91,people,"OVERALL"));

  for(var i = 0; i < 4; i ++){
  people2.push(new Cell(910,260,220,80,'S'));
  people2.push(new Cell(910,260,220,80,'E'));
  people2.push(new Cell(910,260,220,80,'I'));
  people2.push(new Cell(910,260,220,80,'R'));
  people2.push(new Cell(910,260,220,80,'D'));
  }
  states.push(new section(900,250,240,91,people2,"VIC"));

  for(var i = 0; i < 2; i ++){
  people3.push(new Cell(910,428,220,80,'S'));
  people3.push(new Cell(910,428,220,80,'E'));
  people3.push(new Cell(910,428,220,80,'I'));
  people3.push(new Cell(910,428,220,80,'R'));
  people3.push(new Cell(910,428,220,80,'D'));
  }
  states.push(new section(900,418,240,91,people3,"SA"));

  for(var i = 0; i < 3; i ++){
  people4.push(new Cell(910,586,220,80,'S'));
  people4.push(new Cell(910,586,220,80,'E'));
  people4.push(new Cell(910,586,220,80,'I'));
  people4.push(new Cell(910,586,220,80,'R'));
  people4.push(new Cell(910,586,220,80,'D'));
  }
  states.push(new section(900,586,240,91,people4,"NSW"));

  for(var i = 0; i < 9; i ++){
  selectedPeople.push(new Cell(260,82,560,290,'S'));
  selectedPeople.push(new Cell(260,82,560,290,'E'));
  selectedPeople.push(new Cell(260,82,560,290,'I'));
  selectedPeople.push(new Cell(260,82,560,290,'R'));
  selectedPeople.push(new Cell(260,82,560,290,'D'));
  }
  states.push(new section(250,82,580,300,selectedPeople,"OVERALL"));
}

function changeOverallState(newLabel, people){
  states[states.length-1].label = newLabel;
  states[states.length-1].peopleInside = people;
  console.log(states[states.length-1].peopleInside);
}

function toggleMovment(){
  if(enableMovement == false){
    enableMovement = true;
  }else{
    enableMovement = false;
  }
}

function draw() {
  background(255);
  stroke(0);
  fill(0);
  line(180, 0, 180, height);
  noFill();
  rect(0,0,width,height);
  text("OVERALL", 20,150);
  text("Susceptible: " + str(selectedS), 20,200);
  text("Infected: " + str(selectedI), 20, 230);
  text("Exposed: " + str(selectedE), 20, 260);
  text("Recovered: " + str(selectedR), 20, 290);
  text("Dead: " + str(selectedD), 20, 320);

  stepNext = createButton('Step Next');
  stepNext.position(250, 750);
  stepX = createButton('Step x');
  stepX.position(350, 750);
  stepLast = createButton('Step Last');
  stepLast.position(428, 750);
  auto = createButton('Auto');
  auto.position(525, 750);
  movement = createButton('Toggle Movement');
  movement.position(590, 750);
  movement.mousePressed(toggleMovment);
  options = createButton('Options');
  options.position(735, 750);

  for(var i = 0; i < states.length; i++){
  states[i].display();
  states[i].drawCircles();
  }
}

function mousePressed(){
  for(var i = 0; i < states.length;i++){
    states[i].clicked(mouseX,mouseY);
  }
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
    if(enableMovement == true){
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
    noStroke();
    if(this.state == "S"){
      fill(0);
    }else if(this.state == "E") {
      fill(255,150,0);
    }else if(this.state == "I") {
      fill(255,0,0);
    }else if(this.state == "R") {
      fill(0,0,255);
    }else if(this.state == "D") {
      fill(0,100,255);
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

  changeXYValues(newX,newY,newWidth,newHeight){
    var newPeople =[];
    for(var i = 0; i < this.peopleInside.length; i ++){
    newPeople.push(new Cell(newX,newY,newWidth,newHeight,this.peopleInside[i].state));
    }
    return newPeople;
    // this.cellx = Math.floor(Math.random() * newWidth) + newX;
    // this.celly = Math.floor(Math.random() * newHeight) + newY;
  }

  getLabel(){
    return this.label;
  }
  getPeople(){
    return this.peopleInside;
  }

  display(){
    stroke(0);
    noFill();
    rect(this.x,this.y,this.width,this.height);
    text(this.label, this.x, this.height + this.y + 25)
  }

  drawCircles(){
    for(var i = 0; i < this.peopleInside.length; i++){
      this.peopleInside[i].move(this.x, this.y, this.width, this.height);
      this.peopleInside[i].display();
    }
  }
  clicked(px,py){
    if(px <= (this.x + this.width) && px > this.x && py < (this.y+this.height+20) && py > this.y){
    var newPeopleForState = this.changeXYValues(250,82,580,300);
    changeOverallState(this.label, newPeopleForState);
    }
  }
}
