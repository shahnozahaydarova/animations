// If you want to play with the options, the best way is to enable Dat GUI by setting the following boolean to true
let showDatGUI = false;

let options = {
  drag: 0.90,
  gravity: 0,
  lifespan: 100,
  maxSpeed: 100,
  maxParticles: 500,
  particleColors: [
  '0, 0, 0'],

  particlesPerPress: 400,
  jitter: 0,
  randomness: 1,
  size: 15,
  sizeRange: 10,
  shrinkSpeed: 0.2 };


// ---------------
// Particle System 
// ---------------
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(opts) {
    for (var i = 0; i < opts.numToAdd; i++) {
      this.particles.push(new Particle(opts));
    }
    while (this.particles.length > options.maxParticles) {
      this.removeParticle();
    }
  }

  removeParticle() {
    this.particles.shift();
  }

  update() {
    for (var i = 0; i < this.particles.length; i++) {
      if (this.particles[i].lifespan > 0) {
        this.particles[i].update();
      }
    }
  }

  draw() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }}


// ---------------
// Particle
// ---------------
class Particle {
  constructor(opts) {
    // How many frames particle will live
    this.lifespan = options.lifespan;

    // Color
    this.color = options.particleColors[Math.floor(Math.random() * options.particleColors.length)];

    // Size
    this.size = options.size;
    this.size += Math.random() * options.sizeRange - options.sizeRange / 2;

    // Position and velocity
    this.x = opts.x;
    this.y = opts.y;

    let velXMin = -opts.leftSpread / (this.lifespan / 10);
    let velXMax = opts.rightSpread / (this.lifespan / 10);
    let velYMin = -opts.topSpread / (this.lifespan / 10);
    let velYMax = opts.bottomSpread / (this.lifespan / 10);

    let velXRange = velXMax - velXMin;
    let velYRange = velYMax - velYMin;

    let originLeftPercent = opts.leftSpread / (opts.leftSpread + opts.rightSpread);
    let originTopPercent = opts.topSpread / (opts.topSpread + opts.bottomSpread);

    this.velX = Math.random() * velXRange - velXRange * originLeftPercent;
    this.velY = Math.random() * velYRange - velYRange * originTopPercent;

    // Values for perlin noise
    this.xOff = Math.random() * 6400;
    this.yOff = Math.random() * 6400;

    // Opacity is reduced as lifespan gets close to 0
    this.opacity = 1;

    // Added to velY every frame
    this.gravity = options.gravity;

    // Multiply with velocity every frame
    this.drag = options.drag;
  }

  update() {
    // Add gravity force to the y velocity 
    this.velY += this.gravity;

    // Add randomness with perlin noise
    let randomX = noise.simplex2(this.xOff, 0);
    let randomY = noise.simplex2(this.yOff, 0);
    this.velX += randomX / (10 / options.randomness);
    this.velY += randomY / (10 / options.randomness);
    this.xOff += options.jitter;
    this.yOff += options.jitter;

    // // Apply drag
    this.velX *= this.drag;
    this.velY *= this.drag;

    // And the velocity to the position
    this.x += this.velX;
    this.y += this.velY;

    // Apply fade
    this.opacity = this.lifespan / 100;

    // Apply shrink
    this.size -= options.shrinkSpeed;
    this.size = Math.max(0, this.size);

    // Update lifespan
    this.lifespan -= 1;

    if (this.size <= 0.1 || this.opacity <= 0.01) {
      this.lifespan = 0;
    }
  }

  draw() {
    // set the fill style to have the right alpha
    context.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';

    // draw a circle of the required size
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();

    // and fill it
    context.fill();
  }}


// ---------------
// Loop
// ---------------
function loop() {
  // Clear the canvas
  context.clearRect(0, 0, screenWidth, screenHeight);

  // Update and draw paricles
  ps.update();
  ps.draw();

  // RAF
  requestAnimationFrame(loop);
}

function explode(el, x, y) {
  let dialog = document.querySelector('.dialog');
  let rect = dialog.getBoundingClientRect();

  dialog.classList.remove('is-in');
  ps.addParticle({
    numToAdd: options.particlesPerPress,
    x: x,
    y: y,
    leftSpread: x - rect.left,
    rightSpread: rect.right - x,
    topSpread: y - rect.top,
    bottomSpread: rect.bottom - y });

}


// Globals
let ps;
let context;

let mouseX;
let mouseY;
let isPointerPressed = false;

// Get screen size variables
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let halfWidth = window.innerWidth / 2;
let halfHeight = window.innerHeight / 2;

function updateCanvasAndScreenVars() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  halfWidth = window.innerWidth / 2;
  halfHeight = window.innerHeight / 2;
  canvas.width = screenWidth;
  canvas.height = screenHeight;
}

// Initialize
console.clear();

// Create Canvas element
let canvas = document.createElement('canvas');
context = canvas.getContext('2d');

$('.shaker').append(canvas);

updateCanvasAndScreenVars();

$(window).on('resize', updateCanvasAndScreenVars);

$('button').on('click', function (e) {
  let shaker = document.querySelector('.shaker');
  shaker.classList.add('is-shaking');
  let dialog = document.querySelector('.dialog');

  explode(dialog, e.pageX, e.pageY);

  setTimeout(function () {
    $(dialog).css('z-index', 1);
  }, 200);

  setTimeout(function () {
    shaker.classList.remove('is-shaking');
    $(dialog).css('z-index', 10);
    showDialog();
  }, 1000);

});

function showDialog() {
  let dialogWidth = Math.random() * (screenWidth * 0.8);
  dialogWidth = Math.max(dialogWidth, 180);
  dialogWidth = Math.min(dialogWidth, 800);
  let dialogHeight = Math.random() * (screenHeight * 0.8);
  dialogHeight = Math.max(dialogHeight, 160);
  dialogHeight = Math.min(dialogHeight, 800);
  let top = Math.random() * (screenHeight - dialogHeight);
  let left = Math.random() * (screenWidth - dialogWidth);
  $('.dialog').
  css({
    width: dialogWidth,
    height: dialogHeight,
    top: top,
    left: left }).

  addClass('is-in');
}

// Perlin Noise
noise.seed(Math.floor(Math.random() * 64000));

// Create Particle System
ps = new ParticleSystem();


// Dat GUI for options
if (showDatGUI) {
  var gui = new dat.GUI();
  gui.add(options, 'lifespan', 0, 1000);
  gui.add(options, 'maxSpeed', 0, 100);
  gui.add(options, 'drag', 0.6, 1);
  gui.add(options, 'gravity', 0, 2.5);
  gui.add(options, 'particlesPerPress', 0, 100);
  gui.add(options, 'maxParticles', 0, 200);
  gui.add(options, 'jitter', 0, 1);
  gui.add(options, 'randomness', 0, 10);
  gui.add(options, 'size', 0, 100);
  gui.add(options, 'sizeRange', 0, 100);
  gui.add(options, 'shrinkSpeed', 0, 2);
}

showDialog();
loop();