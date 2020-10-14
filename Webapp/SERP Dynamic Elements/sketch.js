p5.disableFriendlyErrors = true; // disables FES
sections = [];
seirdSample = [500,100,20,200,350];
seirdSamples = [240,10,20,30,40,30,34,23,10,90,150];
seirdSampless = [240232,120,20];
eSample = [200,50,20,10,0];
highlightedSection = new section("NSW", seirdSample, eSample, seirdSamples, seirdSampless,eSample);

function setup(){
createCanvas(1200,800);
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

function mouseWheel(event){
  var mouseValue = event.delta/2;
  var mouseDown;
  if(mouseValue > 0){
    mouseDown = true;
  }else{
    mouseDown = false;
  }

  if(mouseDown){
    if(sections[0].y + mouseValue > 82){
      let difference = 82 - sections[0].y;
      for(var i = 0; i < sections.length; i++){
        sections[i].y += difference;
      }
    }else{
      for(var i = 0; i < sections.length; i++){
        sections[i].y += mouseValue;
      }
    }
  }else if(mouseDown == false){
    if(sections[sections.length-1].y + mouseValue < 586){
      let difference = 586 - sections[sections.length-1].y;
      for(var i = 0; i < sections.length; i++){
        sections[i].y += difference;
      }
    }else{
      for(var i = 0; i < sections.length; i++){
        sections[i].y += mouseValue;
      }
    }
  }
  redrawSections();
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
  line(180, 0, 180, height);
  noFill();
  rect(0,0,width,height);
  text("OVERALL", 20,150);
  text("Susceptible: ", 20,200);
  text("Infected: ", 20, 230);
  text("Exposed: " , 20, 260);
  text("Recovered: " , 20, 290);
  text("Dead: " , 20, 320);
  stepNext = createButton('Step Next');
  stepNext.position(250, 750);
  stepX = createButton('Step x');
  stepX.position(350, 750);
  stepLast = createButton('Step Last');
  stepLast.position(428, 750);
  auto = createButton('Auto');
  auto.position(525, 750);
  options = createButton('Options');
  options.position(590, 750);

  sections[0].y = 82;
  sections[0].drawSelf();
  for(var i = 1; i < sections.length; i++){
      sections[i].y = sections[i-1].y+168;
      sections[i].drawSelf();
  }
  highlightedSection.x = 250; highlightedSection.y=82; highlightedSection.width = 580; highlightedSection.height=300;
  //highlightedSection.drawSelf();
}
