/* To apply this animation to your website, paste the following into your HTML code:
<iframe src="https://codepen.io/tommyho/full/oNQpZmV" width=500 height=500></iframe>
*/

/*
  Sources:
    https://www.youtube.com/watch?v=aEptSB3fbqM
    https://codepen.io/gvissing
  Revised by: tommyho510@gmail.com   
*/

/* --- System Parameters (Recommended)--- */
/* Also try
  2, 3, 4, 0.1, 20 -> Sparks
  2, 6, 5, 0.1, 8 -> Spray 
  1, 10, 20, 0.02, 300 -> Spider web
*/
let bNum   = 2;     // Number of bubbles created on movement (2)
let bSize  = 8;     // Bubble size (8)
let bSpeed = 3;     // Bubble speed (3)
let bDep   = 0.01;  // Bubble depletion speed (0.01)
let bDist  = 40;    // Mucus length (40)

/* --- Main Program: DO NOT EDIT BELOW --- */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spots = [];
let hue = 0;

const mouse = {
	x: undefined,
	y: undefined
}

canvas.addEventListener("mousemove", function(event){
	mouse.x = event.x;
	mouse.y = event.y;
	
	for (let i = 0; i < bNum; i++) {
		spots.push(new Particle());
	}
})

window.addEventListener("resize", function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init();
})

class Particle {
	constructor() {
		this.x = mouse.x;
		this.y = mouse.y;
		this.size = Math.random() * bSize + 0.1;
		this.speedX = Math.random() * bSpeed - bSpeed/2;
		this.speedY = Math.random() * bSpeed - bSpeed/2;
		this.color = "hsl(" + hue + ", 100%, 50%)";
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.size > bDep) this.size -= bDep;
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

function handleParticle() {
	for (let i = 0; i < spots.length; i++) {
		spots[i].update();
		spots[i].draw();
		for (let j = i; j < spots.length; j++) {
			const dx = spots[i].x - spots[j].x;
			const dy = spots[i].y - spots[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < bDist) {
				ctx.beginPath();
				ctx.strokeStyle = spots[i].color;
				ctx.lineWidth = spots[i].size / 3;
				ctx.moveTo(spots[i].x, spots[i].y);
        ctx.lineTo(spots[j].x, spots[j].y);
				//ctx.bezierCurveTo(spots[j].x, spots[j].y, spots[j].x, spots[i].y, spots[j].x, spots[j].y);
				ctx.stroke();
			}
		}
		if (spots[i].size <= bDep) {
			spots.splice(i, 1); 
			i--;
		}
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	handleParticle();
	hue++;
	requestAnimationFrame(animate);
}

animate()