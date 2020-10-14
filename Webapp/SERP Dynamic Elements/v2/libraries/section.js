class section{
  constructor(label,s,e,i,r,d,width){
    this.s = s;
    this.e = e;
    this.i = i;
    this.r = r;
    this.d = d;
    this.height = 91;
    this.width = width;
    this.x=0;
    this.y=0;
    this.label = label;
  }

  drawGraph(){
    //S graph
    this.drawTypeOfGraph(this.s,"S");
    this.drawTypeOfGraph(this.e,"E");
    this.drawTypeOfGraph(this.i,"I");
    this.drawTypeOfGraph(this.r,"R");
    this.drawTypeOfGraph(this.d,"D");
  }

  drawEllipses(array,type){
    noStroke();
    if(type == "S"){
      fill(121,189,121);
    }else if(type == "E"){
      fill(255,184,0);
    }else if(type == "I"){
      fill(255,104,104);
    }else if(type == "R"){
      fill(91,91,255);
    }else if(type == "D"){
      fill(0,0,0);
    }
    //console.log(findLargestElement(randomY));
      // draw ellipses
    for(let i =0; i < array.length; i++){
      let x = i * ((this.width-12) / (array.length-1));
      let y = this.height-array[i];
      //console.log("WIDTH: " + this.width);
      ellipse(x, y + this.y-2, 7);
    }
  }

  drawLines(array,type){
    if(type == "S"){
      stroke(121,189,121);
    }else if(type == "E"){
      stroke(255,184,0);
    }else if(type == "I"){
      stroke(255,104,104);
    }else if(type == "R"){
      stroke(91,91,255);
    }else if(type == "D"){
      stroke(0,0,0);
    }
   // draw lines
    let px = array[0].x;
    let py = array[0].y;
    for(let i =0; i < array.length; i++){
      let x = i * ((this.width-12) / (array.length-1));
      let y = this.height-array[i];
      line(px, py + this.y-2, x, y+ this.y-2);

    	//store the last position
      px = x;
      py = y;
    }
  }

  drawSelf(){
    // this.width = $("#cells-stack-table").width() - ($("#cells-stack-table").width() * 0.2);
    stroke(0);
    noFill();
    rect(this.x,this.y,this.width,this.height);
    text(this.label, this.x, this.height + this.y + 25);
    this.drawGraph();
  }

  drawTypeOfGraph(seirdArray,type){
    let numPts_S = seirdArray.length;
    let scaleY = this.height * 0.9;
    //console.log("scaleY: " + scaleY);
    let largestElement = findLargestElement(seirdArray);
    var changingScale = scaleY - largestElement;
    //console.log("changinScale " + changingScale);
    var scale = 1;
    if(changingScale > 0){ //less than height
      scale = scaleY - largestElement;
      scale = scaleY/largestElement;
    }else if(changingScale < 0){
      scale = largestElement - scaleY;
      scale = largestElement/scaleY;
    }
    //console.log("Scale " + scale);
    for(var i = 0; i < seirdArray.length;i++){
      seirdArray[i] /= scale;
    }

    this.drawLines(seirdArray,type);
    this.drawEllipses(seirdArray,type);
  }
}
