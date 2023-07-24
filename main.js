let myST = new SplitText('#msg', {type: 'words,chars'})

let tl = gsap.timeline({
  repeat: -1
});
let duration = 0.65;
let stagger = 0.15;
tl.to(myST.chars, {
	duration: duration,
	'--wght': 900,
	stagger: {
		each: stagger,		
		repeat: -1,
    repeatDelay: 2.6,
		yoyo: true
	},
	ease: 'sine.inOut'
})
.to(myST.chars, {
	duration: duration,
	'--ESHP': 3,
  color: '#F2F7F2',
	stagger: {
		each: stagger,		
		repeat: -1,
    repeatDelay: 2.6,
		yoyo: true
	},
	ease: 'sine.inOut'
}, 0)
.to(myST.chars, {
	duration: duration,
	'--wght': 20,
	stagger: {
		each: stagger,
    repeatDelay: 2.6,
		repeat: -1,    
		yoyo: true
	},
	ease: 'sine.inOut'
}, 1.3)
.to(myST.chars, {
	duration: duration,
	'--ESHP': 2,
	stagger: {
		each: stagger,		
    repeatDelay: 2.6,
		repeat: -1,    
		yoyo: true
	},
	ease: 'sine.inOut'
}, 1.3)
