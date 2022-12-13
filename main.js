// --------------
// Hover animaton
// --------------

const mouthSpeed = 0.3;
const easeType = Power2.easeOut;
const mouthOpen = gsap.timeline({ paused: true });
mouthOpen.to('.mouth-back', {duration: mouthSpeed, ease: easeType, y: -70}, 0);
mouthOpen.to('.tongue', {duration: mouthSpeed * 1.5, ease: easeType, y: -70}, 0);
mouthOpen.to('.teeth', {duration: mouthSpeed, ease: easeType, y: -70, scaleY: 1.2}, 0);
mouthOpen.to('.body', {duration: mouthSpeed, ease: easeType, scaleY: 1.06, transformOrigin: 'center bottom'}, 0);
mouthOpen.to('.freckles', {duration: mouthSpeed, ease: easeType, y: -10}, 0);
mouthOpen.to('.ears', {duration: mouthSpeed, ease: easeType, y: 6}, 0);
mouthOpen.to('.eye-right', {duration: mouthSpeed, ease: easeType, x: -2}, 0);
mouthOpen.to('.eye-left', {duration: mouthSpeed, ease: easeType, x: 2}, 0);
mouthOpen.to('.eyes', {duration: mouthSpeed, ease: easeType, y: 2}, 0);
mouthOpen.to('.nostrils', {duration: mouthSpeed, ease: easeType, y: -6}, 0);

// ------------
// Mouse events
// ------------

const button = document.querySelector('button');

button.addEventListener('mouseenter', enterButton);
button.addEventListener('mouseleave', leaveButton);

function enterButton() { mouthOpen.play(); }
function leaveButton() { mouthOpen.reverse(); }

// ----------
// Ear wiggle
// ----------

const earWiggle = gsap.timeline({ paused: true, repeat: 2 });
earWiggle.set('.ear-right', { transformOrigin: "center center" });
earWiggle.to('.ear-right', { duration: 0.1, rotation: 45 });
earWiggle.to('.ear-right', { duration: 0.1, rotation: 0 });

window.setInterval(earWigglePlay, 2500);

function earWigglePlay() { earWiggle.play(0); }

// ------------
// Eye tracking
// ------------

const eyeRightPupil = document.querySelector('.eye-right-pupil');
const eyeLeftPupil = document.querySelector('.eye-left-pupil');
const eyeLeftInner = document.querySelector('.eye-left-inner');
const innerEyeWidth = eyeLeftInner.getBoundingClientRect().width;
const innerEyeHeight = eyeLeftInner.getBoundingClientRect().height;
const pupilWidth = eyeLeftPupil.getBoundingClientRect().width;
const pupilHeight = eyeLeftPupil.getBoundingClientRect().height;
const xMovement = (innerEyeWidth - pupilWidth)/2;
const yMovement = (innerEyeHeight - pupilHeight)/2;

window.addEventListener('mousemove', updateEyePosition);

function updateEyePosition(event) {
  const posX = ((event.clientX / document.body.clientWidth) * 2 - 1) * xMovement;
  const posY = ((event.clientY / document.body.clientHeight) * 2 - 1) * yMovement;
  
  eyeLeftPupil.style.transform = `translate(${posX}px, ${posY}px)`;
  eyeRightPupil.style.transform = `translate(${posX}px, ${posY}px)`;
}

// Last minute link to the tutorial
button.addEventListener('click', () => window.open('https://codepen.io/MarioD/post/interactive-hippo-button-tutorial'));