var dimensions = [document.documentElement.clientWidth, document.documentElement.clientHeight];

const dots = document.getElementById('dots');
dots.width = dimensions[0];
dots.height = dimensions[1];
const ctx = dots.getContext('2d');
const d = Math.max(dimensions[0], dimensions[1]);
const r = 50;

const xDist = dimensions[0] / r;
const yDist = xDist;

let mx = 0;
let my = 0;

let s = 1;

const dotsArray = [];

for (let x = 0; x < r * r; x++) {
  dotsArray.push([
  xDist / 2 + xDist * (x % r),
  yDist / 2 + yDist * Math.floor(x / r),
  1]);

}

const render = timer => {

  const t = timer * 0.0025;

  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, 0, dimensions[0], dimensions[1]);

  ctx.fillStyle = 'rgba(255,255,255,1)';

  for (let x = 0; x < r * r; x++) {

    const dist = Math.hypot(mx - dotsArray[x][0], my - dotsArray[x][1]);

    if (dist < 150) {
      dotsArray[x][2] = dotsArray[x][2] + (200 - dist) * 0.6;
    } else {
      dotsArray[x][2] = dotsArray[x][2] - 9;
    }

    if (dotsArray[x][2] > 400) {dotsArray[x][2] = 400;}
    if (dotsArray[x][2] < 1) {dotsArray[x][2] = 1;}

    const l = Math.floor(x / r) + t;
    const m = x % r + t;

    const tx = Math.sin(l) * xDist;
    const ty = Math.cos(m) * yDist;

    if (dotsArray[x][2] > 1) {
      ctx.beginPath();
      ctx.arc(tx + dotsArray[x][0], ty + dotsArray[x][1], 1 + dotsArray[x][2] / 8, 0, 2 * Math.PI);
      ctx.fill();
    }

  }

  requestAnimationFrame(render);
};

window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

render();