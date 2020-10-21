const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const progressText = document.querySelectorAll(".step p");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
var cells = [];
var policies = [];
let current = 1;
var numberOfCells = 1;
var oldCells = 1;
var numberofPolicies = 1;

class Cell{
  constructor(){
    var cellName = "Name";
    var population = 0;
    var initalI = 0;
    var initialE = 0;
    var initalR = 0;
    var initalD = 0;
    var infectionRate = 0.0;
    var incubationRate = 0.0;
    var recoveryRate = 0.0;
    var returnToSusceptibility = 0.0;
    var deathRate = 0.0;
  }
}

class Policy{
  constructor(){
    var policyName = "Name";
    var infectionMultipler = 0.0;
    var incubationMultiplier = 0.0;
    var recoveryMultiplier = 0.0;
    var susceptibilityMultiplier = 0.0;
    var compliance = 0.0;
  }
}

class Simulation {
  constructor(){
    var excersiseName = "";
    var simulationDays = "";
    var timeStep = "";
    var numberOfCells = 1;
  }
}
var simulation = new Simulation;

nextBtnFirst.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-25%";
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current += 1;
});
nextBtnSec.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-50%";
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current += 1;
});
nextBtnThird.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-75%";
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current += 1;
});

submitBtn.addEventListener("click", function(){
  //CODE HERE JOSH
  getPageOneData();
  getPageTwoData();
  getPageThreeData();
  var jsonString = JSON.stringify({simulation: simulation, cells: cells, policies: policies});
  console.log(jsonString);
});

prevBtnSec.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "0%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});
prevBtnThird.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-25%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});
prevBtnFourth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-50%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

function newCell(){
  numberOfCells = $(".CellNumber").val();
  if(numberOfCells == 0){
    numberOfCells = 1;
  }
  oldCells = numberOfCells;
  for(var i = 0; i < numberOfCells-1; i++){
     $("#seirdPage > div:first-child").clone(true).insertBefore("#seirdPage > div:last-child");
   }

   var titles = $(".seirdTitle");
   for(var i = 0; i < titles.length; i ++){
     titles[i].innerHTML = "Cell " + (i+1).toString();
   }
}

function removeCells(){
  for(var i = 0; i < numberOfCells; i++){
     $("#seirdPage > div:last-child").remove();
   }
}

function addNewPolicy(){
  $("#policiesPage > div:first-child").clone(true).insertBefore("#policiesPage > div:last-child");
  var policiesTitles = $(".policyTitle");
  for(var i = 0; i < policiesTitles.length; i ++){
    policiesTitles[i].innerHTML = "Policy " + (i+1).toString();
  }
  numberofPolicies++;


}

$(".removePolicyButton").click(function() {
  if(numberofPolicies > 1){
    $(this).parent().parent().remove();
    var policiesTitles = $(".policyTitle");
    for(var i = 0; i < policiesTitles.length; i ++){
      policiesTitles[i].innerHTML = "Policy " + (i+1).toString();
    }
    numberofPolicies--;
  }

});

function getPageOneData(){
  simulation.excersiseName = $(".excersise-name").val();
  simulation.simulationDays = $(".simulationDays").val();
  simulation.timeStep = $(".timeStep").val();
  simulation.numberOfCells = $(".CellNumber").val();
}

function getPageTwoData(){
  for(var i = 0; i < numberOfCells; i ++){
    cells.push(new Cell);
    cells[i].cellName = $(".cellName")[i].value;
    cells[i].population = $(".populations")[i].value;
    cells[i].initalI = $(".iI")[i].value;
    cells[i].initalE = $(".iE")[i].value;
    cells[i].initalR = $(".iR")[i].value;
    cells[i].initalD = $(".iD")[i].value;
    cells[i].infectionRate = $(".infection-rate")[i].value;
    cells[i].incubationRate = $(".incubation-rate")[i].value;
    cells[i].recoveryRate = $(".recovery-rate")[i].value;
    cells[i].deathRate = $(".death-rate")[i].value;
    cells[i].returnToSusceptibility = $(".rTS")[i].value;
  }
}
function getPageThreeData(){
  for(var i = 0; i < numberofPolicies; i ++){
    policies.push(new Policy);
    policies[i].policyName = $(".policy-name")[i].value;
    policies[i].infectionMultipler = $(".infection-multiplier")[i].value;
    policies[i].incubationMultiplier = $(".incubation-multiplier")[i].value;
    policies[i].recoveryMultiplier = $(".recovery-multiplier")[i].value;
    policies[i].susceptibilityMultiplier = $(".susceptibility-multiplier")[i].value;
    policies[i].complianceMultiplier = $(".compliance-multiplier")[i].value;

  }
}
