let select = s => document.querySelector(s),
		toArray = s => gsap.utils.toArray(s),
		mainSVG = select('#mainSVG'),
    allLines = toArray('#logoWrapper .logo')
		
function setCharColor (char, col) {
	gsap.set(char, {
		color: col
	})
}

allLines.forEach((c, i) => {
  let myST = new SplitText(c, {type: 'words,chars'});
  gsap.set(c, {
    color: i < allLines.length/2 ? '#0054B1' : '#F7D000'
  });
  let tl = gsap.timeline();
  let duration = 1.12;
  tl.to(myST.chars, {
    duration: duration,
    '--wght': 120,
    '--wdth': 10,
    y: '+=30',
    opacity: 0.6,
    stagger: {
      amount: duration * 1.75,
      repeat: -1,
      yoyo: true
    },
    ease: 'sine.inOut'
  }).seek(1000)
})



	
	
