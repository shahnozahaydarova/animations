let tl = gsap.timeline();
tl.fromTo(
	".layer",
	{
		rotateX: -100,
		ease: "sine.inOut"
	},
	{
		duration: 10,
		rotateY: 60,
		ease: "sine.inOut",
		repeat: -1,
		yoyo: true
	}
);
