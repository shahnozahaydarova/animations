var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

w = ctx.canvas.width = 600;
h = ctx.canvas.height = 600;

var grid_res = 10;
var grid_x, grid_y, mdown1, mdown2, mx, my;
let lines = [];

class Charge{
  constructor(x,y,v){
    this.x = x;
    this.y = y;
    this.v = v;
    this.r = 20;
  }

  draw(){
    if(this.v>0){ 
      ctx.fillStyle = "red";
    }else if (this.v<0){
      ctx.fillStyle = "blue";
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

class Line{
  constructor(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
  }

  draw(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    var xf = Math.floor(this.x/(grid_res));
    var yf = Math.floor(this.y/(grid_res));

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + grid_x[xf][yf], this.y + grid_y[xf][yf]);
    ctx.closePath();
    ctx.stroke();
  }
}

function render(){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,w,h);

  drawGrid();

  lines.forEach((line, i) => {
    line.draw();
  });

  c1.draw();
  c2.draw();

  requestAnimationFrame(render);
}

function drawGrid(){
  ctx.strokeStyle = "#333"; 
  for(var i=0; i<w;i+=grid_res){
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);

    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
  }
  ctx.stroke();
}

function setup(){
  grid_x = new Array(w/grid_res);
  grid_y = new Array(w/grid_res);

  for(var i = 0; i < w/grid_res; i++) {
    grid_x[i] = new Array(h/grid_res);
    grid_y[i] = new Array(h/grid_res);
  }

  for(var i=0; i<2000; i++){
    var line = new Line();
    lines.push(line);
  }

  c1 = new Charge(150, 150, 1);
  c2 = new Charge(450, 450, -1);

  vectorGrid();
}

function vectorGrid(){
  var x1 = 0;
  for(var  i=0; i<w/grid_res; i++){
    for(var  j=0; j<h/grid_res; j++){
      x = grid_res/2 + i*grid_res
      y = grid_res/2 + j*grid_res

      dx = x-c1.x;
      dy = y-c1.y;
      d1 = Math.sqrt(dx*dx+dy*dy);
      E1 = c1.v/(d1*d1);
      E1x = dx*E1/d1;
      E1y = dy*E1/d1;

      dxn = x-c2.x;
      dyn = y-c2.y;
      d2 = Math.sqrt(dxn*dxn+dyn*dyn);
      E2 = c2.v/(d2*d2);
      E2x = dxn*E2/d2;
      E2y = dyn*E2/d2;

      EEx = E1x+E2x;
      EEy = E1y+E2y;
      EE = Math.sqrt(EEx*EEx + EEy*EEy);
      deltax = 15*EEx/EE;
      deltay = 15*EEy/EE;
      grid_x[i][j] = deltax
      grid_y[i][j] = deltay
    }
  }
}

setup();
render();

document.querySelector("#canvas").addEventListener("mousemove", (e) => {
  mx = e.pageX - canvas.offsetLeft;
  my = e.pageY - canvas.offsetTop;

  if(mdown1){
    c1.x = mx;
    c1.y = my;
    vectorGrid();
  }else if(mdown2){
    c2.x = mx;
    c2.y = my;
    vectorGrid();
  }
});

document.querySelector("#canvas").addEventListener("mousedown", (e) => {
  mx = e.pageX - canvas.offsetLeft;
  my = e.pageY - canvas.offsetTop;

  var i1 = dist2(mx, my, c1.x, c1.y, c1.r);
  var i2 = dist2(mx, my, c2.x, c2.y, c2.r);

  if(i1){
    mdown1 = true;
  }else if(i2){
    mdown2 = true;
  }
});

document.querySelector("#canvas").addEventListener("mouseup", function(){
  mdown1 = false;
  mdown2 = false;
});

function dist2(x, y, cx, cy, radius) {
  var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}

function typeEffect(element, speed) {
	var text = element.innerHTML;
	element.innerHTML = "";
	
	var i = 0;
	var timer = setInterval(function() {
    if (i < text.length) {
      element.append(text.charAt(i));
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

var speed = 75;
var title = document.querySelector('.title');
var lead = document.querySelector('.lead');
var info = document.querySelector('.info');
var link = document.querySelector('.link');
var delay = title.innerHTML.length * speed + speed;

typeEffect(title, speed);

setTimeout(function(){
  lead.style.display = "block";
  typeEffect(lead, 25);
}, delay);

setTimeout(function(){
  info.style.display = "block";
  typeEffect(info, 25);
}, delay);

// setTimeout(function(){
//   link.style.display = "block";
//   typeEffect(link, 25);
// }, delay);
