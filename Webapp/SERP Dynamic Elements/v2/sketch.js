p5.disableFriendlyErrors = true; // disables FES
sections = [];
seirdSample = [500,100,20,200,350];
seirdSamples = [240,10,20,30,40,30,34,23,10,90,150];
seirdSampless = [240232,120,20];
eSample = [200,50,20,10,0];
highlightedSection = new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample);

function setup(){
  let render = createCanvas(400,800);
  render.parent("cells-stack");
  background(255);
  sections.push(new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample));
  sections.push(new section("SA", seirdSamples, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSampless, eSample, seirdSampless, seirdSampless,eSample));
  sections.push(new section("SA", seirdSample, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSample, eSample, seirdSampless, seirdSampless,eSample));
  sections.push(new section("SA", seirdSample, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample));
  sections.push(new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample));
  sections.push(new section("SA", seirdSamples, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSampless, eSample, seirdSampless, seirdSampless,eSample));
  sections.push(new section("SA", seirdSample, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSample, eSample, seirdSampless, seirdSampless,eSample));
  sections.push(new section("SA", seirdSample, eSample, seirdSampless, seirdSamples,eSample));
  sections.push(new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample));
  uiSetup();
}

function draw(){
  console.log(frameRate());
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
