const simplex = new SimplexNoise(Math.random());
const angleBetween = (vec1, vec2) => Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x);
const distanceBetween = (vec1, vec2) => Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y);

const TAU = Math.PI * 2;

class Stage {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.setSize(width, height);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

    this.center = {
      x: this.width * 0.5,
      y: this.height * 0.5,
    };

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  getRandomPosition() {
    return { x: this.width * Math.random(), y: this.height * Math.random() };
  }
}

class Element {
  constructor(position, radius) {
    this.positionCurrent = { x: position.x,y: position.y };
    this.positionDefault = { x: position.x, y: position.y };

    this.radius = radius;
    this.maxReach = 50;
  }

  update(focusPoint, distanceMax, reachForce) {
    const distance = distanceBetween(this.positionDefault, focusPoint);

    this.reachTo(distance, focusPoint, reachForce);
    this.scale(distance, distanceMax);
  }

  scale(distance, distanceMax) {
    this.radius = Math.max(0.5, (1 - (distance / distanceMax)) * 10);
  }

  reachTo(distance, focusPoint, reachForce) {
    const { positionDefault: pd } = this;

    const angle = angleBetween(pd, focusPoint);
    const distanceNorm = Math.min(distance / reachForce, 1);

    const length = 50 * distanceNorm;

    this.positionCurrent.x = pd.x + (Math.cos(angle) * length);
    this.positionCurrent.y = pd.y + (Math.sin(angle) * length);
  }

  drawStok(ctx, center) {
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    ctx.moveTo(this.positionCurrent.x, this.positionCurrent.y);
    ctx.lineTo(center.x, center.y)
    ctx.stroke();
    ctx.closePath();
  }

  drawElement(ctx, center) {
    ctx.save();
    ctx.translate(this.positionCurrent.x, this.positionCurrent.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, TAU, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

class Scene {
  constructor(stage) {
    this.phase = 0;

    this.stage = stage;

    this.padding = 100;
    this.numOrbits = 10;
    this.radius = (stage.width - (this.padding * 2)) * 0.5;

    this.elements = [];
    this.rafId = null;

    this.automated = true;

    this.setFocusPoint(stage.center);
  }

  reset() {
    this.stage.clear();

    this.generate();
  }

  generate() {
    this.elements = [];

    const { numOrbits, stage: { center } } = this;
    const radiusStep = this.radius / numOrbits;

    for (let i = 0; i < numOrbits; i++) {
      const orbitRadius = radiusStep * (i + 1);
      const numCircles = Math.ceil(orbitRadius / 5);
      const angleStep = TAU / numCircles;

      for (let q = 0; q < numCircles; q++) {
        const x = center.x + (Math.cos(angleStep * q) * orbitRadius);
        const y = center.y + (Math.sin(angleStep * q) * orbitRadius);
        const radius = 5;

        this.elements.push(new Element({ x, y }, radius ));
      }
    }
  }

  setFocusPoint(point) {
    this.focusPoint = { x: point.x, y: point.y };
  }

  run() {
    this.stage.clear();

    const { context, center } = this.stage;

    if (this.automated) {
      const radius = (this.radius * 2) + ((this.radius * 0.5) * simplex.noise3D(this.phase, this.phase, this.phase));
      const angle = TAU * simplex.noise3D(this.phase, this.phase, this.phase);

      this.focusPoint = {
        x: center.x + (Math.cos(angle) * radius),
        y: center.y + (Math.sin(angle) * radius),
      };
    }

    this.elements.forEach((e) => {
      e.update(this.focusPoint, this.radius * 2, this.stage.width * 0.01);
      e.drawStok(context, center);
    });

    this.elements.forEach((e) => {
      e.drawElement(context, center);
    });

    this.phase += 0.001;
    this.rafId = requestAnimationFrame(() => this.run());
  }
}

const stage = new Stage(document.querySelector('.js-canvas'), 700, 700);
const scene = new Scene(stage);


const onPointerMove = (e) => {
  const target = (e.touches && e.touches.length) ? e.touches[0] : e;

  scene.setFocusPoint({
    x: target.clientX - e.target.offsetLeft,
    y: target.clientY - e.target.offsetTop,
  });
};

const onPointerOver = () => {
  scene.automated = false;
};

const onPointerLeave = () => {
  scene.automated = true;
};

stage.canvas.addEventListener('mousemove', onPointerMove);
stage.canvas.addEventListener('touchmove', onPointerMove);

stage.canvas.addEventListener('mouseenter', onPointerOver);
stage.canvas.addEventListener('touchstart', onPointerOver);

stage.canvas.addEventListener('mouseleave', onPointerLeave);
stage.canvas.addEventListener('touchend', onPointerLeave);

scene.generate();
scene.run();
