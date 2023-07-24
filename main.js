const paws = [];
let prevPawLeft = false;
const mouse = { prev: { x: 0, y: 0 }, dist: 0 };

function setup() {
  createCanvas(500, 500).parent("cursor-card");
}

function draw() {
  clear();
  noStroke();

  paws.forEach(paw => {
    paw.update();
    paw.display();
  });
}

function pawDraw() {
  if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
    const dx = Math.abs(mouseX - pmouseX);
    const dy = Math.abs(mouseY - pmouseY);
    if (mouse.dist > 25) {
      prevPawLeft = !prevPawLeft;
      const angle = Math.atan2(
      mouseY - (mouse.prev.y || pmouseY),
      mouseX - (mouse.prev.x || pmouseX));

      paws.push(new Paw(mouseX, mouseY, angle * 180 / Math.PI, prevPawLeft));
      mouse.dist = 0;
      mouse.prev = { x: mouseX, y: mouseY };
    } else {
      mouse.dist += dx + dy;
    }
  } else {
    mouse.prev = { x: 0, y: 0 };
  }
}

function touchMoved() {
  pawDraw();
}
function mouseMoved() {
  pawDraw();
}

class Paw {
  constructor(x, y, angle, left) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.size = 7;
    this.left = left;
    this.angle = angle + 90;
  }

  update() {
    this.alpha -= (paws.length - paws.indexOf(this)) * 0.1;

    if (this.alpha <= 0) {
      paws.splice(paws.indexOf(this), 1);
    }
  }

  display() {
    push();
    fill(250, 148, 149, this.alpha);
    const offset = this.left ? this.size : -this.size;
    translate(this.x - this.size / 2, this.y - this.size / 2);
    rotate(this.angle);
    translate(offset * 1.5, 0);
    paw(this.size);
    angleMode(DEGREES);
    pop();
  }}


const paw = size => {
  const center = size / 2;
  ellipse(size / 2, center, size * 0.9, size * 0.7);
  ellipse(0, 0, size * 0.5, size * 0.5);
  ellipse(center, -size * 0.2, size * 0.5, size * 0.5);
  ellipse(size, 0, size * 0.5, size * 0.5);
};