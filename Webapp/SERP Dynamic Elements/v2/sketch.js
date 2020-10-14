p5.disableFriendlyErrors = true; // disables FES
sections = [];
seirdSample = [500,100,20,200,350];
seirdSamples = [240,10,20,30,40,30,34,23,10,90,150];
seirdSampless = [240232,120,20];
eSample = [200,50,20,10,0];
highlightedSection = new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample);

function setup(){
  // Setup canvas for cell stack
  parentWidth = $("#cells-stack-table").width();
  let render = createCanvas(parentWidth, 2000);
  let cellWidth = parentWidth - (parentWidth * 0.20);
  render.parent("cells-stack");
  background(255);

  // Update Sections
  sections.push(new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless, eSample, cellWidth));
  sections.push(new section("SA", seirdSamples, eSample, seirdSampless, seirdSamples, eSample, cellWidth));
  sections.push(new section("VIC", seirdSampless, eSample, seirdSampless, seirdSampless, eSample, cellWidth));
  sections.push(new section("WA", seirdSample, eSample, seirdSampless, seirdSamples, eSample, cellWidth));
  sections.push(new section("QLD", seirdSample, eSample, seirdSampless, seirdSampless, eSample, cellWidth));
  


  // getData(cellWidth);



  // resizeCanvas( parentWidth, (sections.length * 91));

  uiSetup();
}

// Update sections from webserver
function getData(cellWidth){
  $.getJSON("/model.json", function(data){
      sections = [];
      $.each(data["cells"], function(i, val){
        sections.push(new section(val["name"], val["susceptibles"], val["exposed"], val["infected"], val["recovered"], val["deaths"], cellWidth));
      });
  });
}

function findLargestElement(array){
    var largestElement = 0;
    for(var i = 0; i < array.length;i++){
      if(array[i] > largestElement){
        largestElement = array[i];
      }
    }
    return largestElement;
}

function redrawSections(){
  fill(255);
  noStroke();
  rect(800,1,350,798);
  for(var i = 0; i <sections.length;i++){
    sections[i].drawSelf();
  }
}

function uiSetup(){
  stroke(0);
  fill(0);
  sections[0].y = 82;
  sections[0].drawSelf();
  for(var i = 1; i < sections.length; i++){
      sections[i].y = sections[i-1].y+168;
      sections[i].drawSelf();
  }
  highlightedSection.x = 0; highlightedSection.y=82; highlightedSection.width = 580; highlightedSection.height=300;
}
