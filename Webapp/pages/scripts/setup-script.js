// const { json } = require("express");

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
var cellManagment = 1;
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
    var infectionMultiplier = 0.0;
    var incubationMultiplier = 0.0;
    var recoveryMultiplier = 0.0;
    var susceptibilityMultiplier = 0.0;
    var compliance = 0.0;
    var deathMultiplier = 0.0;
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

//model
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//

nextBtnFirst.addEventListener("click", function(event){
  getPageOneData();
  if(simulation.numberOfCells > 0){
  event.preventDefault();
  slidePage.style.marginLeft = "-25%";
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current += 1;

  updateCells();
  if(cellManagment != numberOfCells){
    newCells = numberOfCells - cellManagment;
    if(numberOfCells > cellManagment){
      //add some cells
      console.log("number of cells to be added " + newCells);
      newCell(numberOfCells - cellManagment);
      cellManagment = numberOfCells;
    }else if(numberOfCells < cellManagment){
      //remove some cells
      removeCells(cellManagment - numberOfCells);
      console.log("number of cells to be deleted " + newCells);
      cellManagment = numberOfCells;
    }
  }
}else{
  alert("Please enter valid input");
}
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

  var confirmation = prepareData();
  console.log(confirmation);
});

function prepareData(){
  getPageOneData();
  getPageTwoData();
  getPageThreeData();

  var outData = new Object();
  outData.sim = simulation;
  outData.cells = cells;
  outData.policies = policies;
  return outData;
}

// function printToPage(){
//   var simPrint = JSON.stringify(simulation);
//   var cellPrint = JSON.stringify(cells);
//   var policiesPrint = JSON.stringify(policies);
//   $("#simulationDisplay").replaceWith(simPrint);
//   $("#cellDisplay").replaceWith(cellPrint);
//   $("#policyDisplay").replaceWith(policiesPrint);
// }

submitBtn.addEventListener("click", function(){
  var out = prepareData();

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/init");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(out));

  location.href = "/instructor";
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

function updateCells(){
  numberOfCells = $(".CellNumber").val();
}

function newCell(number){
  for(var i = 0; i < number; i++){
     $("#seirdPage > div:first-child").clone(true).insertAfter("#seirdPage > div:last-child");
   }

   var titles = $(".seirdTitle");
   for(var i = 0; i < titles.length; i ++){
     titles[i].innerHTML = "Cell " + (i+1).toString();
   }
}

function removeCells(num){
  for(var i = 0; i < num; i++){
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
    policies[i].infectionMultiplier = $(".infection-multiplier")[i].value;
    policies[i].incubationMultiplier = $(".incubation-multiplier")[i].value;
    policies[i].recoveryMultiplier = $(".recovery-multiplier")[i].value;
    policies[i].susceptibilityMultiplier = $(".susceptibility-multiplier")[i].value;
    policies[i].complianceMultiplier = $(".compliance-multiplier")[i].value;
    policies[i].deathMultiplier = $(".death-multiplier")[i].value;
  }
}

function virusPreset(infectionR, incubationR, recoveryR, deathR, returnR){
  for(var i = 0; i < numberOfCells; i++){
    $(".infection-rate")[i].value = infectionR;
    $(".incubation-rate")[i].value = incubationR;
    $(".recovery-rate")[i].value = recoveryR;
    $(".death-rate")[i].value = deathR;
    $(".rTS")[i].value = returnR;
  }
}

function australiaPreset(){
  cellArr = [];
  for(var i = 0; i< 8; i++)
  cellArr.push(new Cell());
  cellArr[0].cellName = "SA";
  cellArr[0].population = 1677000;
  cellArr[0].initalI = 1;
  cellArr[0].initalE = 0;
  cellArr[0].initalR = 0;
  cellArr[0].initalD = 0;

  cellArr[1].cellName = "WA";
  cellArr[1].population = 2589000;
  cellArr[1].initalI = 1;
  cellArr[1].initalE = 0;
  cellArr[1].initalR = 0;
  cellArr[1].initalD = 0;

  cellArr[2].cellName = "NSW";
  cellArr[2].population = 7544000;
  cellArr[2].initalI = 1;
  cellArr[2].initalE = 0;
  cellArr[2].initalR = 0;
  cellArr[2].initalD = 0;

  cellArr[3].cellName = "VIC";
  cellArr[3].population = 6359000;
  cellArr[3].initalI = 1;
  cellArr[3].initalE = 0;
  cellArr[3].initalR = 0;
  cellArr[3].initalD = 0;

  cellArr[4].cellName = "QUE";
  cellArr[4].population = 5071000;
  cellArr[4].initalI = 1;
  cellArr[4].initalE = 0;
  cellArr[4].initalR = 0;
  cellArr[4].initalD = 0;

  cellArr[5].cellName = "NT";
  cellArr[5].population = 244761;
  cellArr[5].initalI = 1;
  cellArr[5].initalE = 0;
  cellArr[5].initalR = 0;
  cellArr[5].initalD = 0;

  cellArr[6].cellName = "ACT";
  cellArr[6].population = 426700;
  cellArr[6].initalI = 1;
  cellArr[6].initalE = 0;
  cellArr[6].initalR = 0;
  cellArr[6].initalD = 0;

  cellArr[7].cellName = "TAS";
  cellArr[7].population = 515000;
  cellArr[7].initalI = 1;
  cellArr[7].initalE = 0;
  cellArr[7].initalR = 0;
  cellArr[7].initalD = 0;

  cellPreset(cellArr);
}

function cellPreset(cellArray){
  console.log(cellArray);
  removeCells(numberOfCells-1);
  numberOfCells = cellArray.length;
  cellManagment = numberOfCells;
  $(".CellNumber")[0].value = numberOfCells;
  newCell(numberOfCells-1);

  for(var i = 0; i < cellArray.length; i++){
    $(".cellName")[i].value = cellArray[i].cellName;
    $(".populations")[i].value = cellArray[i].population;
    $(".iI")[i].value = cellArray[i].initalI;
    $(".iE")[i].value = cellArray[i].initalE;
    $(".iR")[i].value = cellArray[i].initalR;
    $(".iD")[i].value = cellArray[i].initalD;
  }
}

var faceMasks = new Policy;
faceMasks.policyName = "Face Masks";
faceMasks.infectionMultipler = "0.80";
faceMasks.incubationMultiplier = "1";
faceMasks.recoveryMultiplier = "1";
faceMasks.susceptibilityMultiplier = "1";
faceMasks.complianceMultiplier = "1";
faceMasks.deathMultiplier = "1";

var socialDistancing = new Policy;
socialDistancing.policyName = "Social Distancing";
socialDistancing.infectionMultipler = "0.60";
socialDistancing.incubationMultiplier = "1";
socialDistancing.recoveryMultiplier = "1";
socialDistancing.susceptibilityMultiplier = "1";
socialDistancing.complianceMultiplier = "1";
socialDistancing.deathMultiplier = "1";

var lockDown = new Policy;
lockDown.policyName = "Lock Down";
lockDown.infectionMultipler = "0.50";
lockDown.incubationMultiplier = "1";
lockDown.recoveryMultiplier = "1";
lockDown.susceptibilityMultiplier = "1";
lockDown.complianceMultiplier = "1";
lockDown.deathMultiplier = "1";



function policyPreset(pol){
  //add policy to the end
    addNewPolicy();
    var positions = $(".policy-name").length -1;
    $(".policy-name")[positions].value = pol.policyName;
    $(".infection-multiplier")[positions].value = pol.infectionMultipler;
    $(".incubation-multiplier")[positions].value = pol.incubationMultiplier;
    $(".recovery-multiplier")[positions].value = pol.recoveryMultiplier;
    $(".susceptibility-multiplier")[positions].value = pol.susceptibilityMultiplier;
    $(".compliance-multiplier")[positions].value = pol.complianceMultiplier;
    $(".death-multiplier")[positions].value = pol.deathMultiplier;
}
