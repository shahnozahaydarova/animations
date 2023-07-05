console.clear()

class Word {
  constructor (element) {
    this.element = element;
    this.init()
  }
  
  init() {
    this.letters = [];
    this.layers = 1;
    
    this.wordString = this.element.innerText
    this.element.innerHTML = '';
    this.element.setAttribute('aria-label', this.wordString)
    
    const letterStrings = this.wordString.split('');
    const style = getComputedStyle(this.element);
    this.layers = Number(style.getPropertyValue('--layers'));
    
    this.letters = letterStrings.map((letter, i) => new Letter(letter, this.layers, this.element, i, letterStrings.length))
    
    const animation = this.element.dataset.animation;
    if(animation && animations[animation]) animations[animation](this)
  }
  
  reset() {
    this.init()
  }
  
  onResize() {
    this.element.style.setProperty("--width", this.element.clientWidth);
    this.element.style.setProperty("--height", this.element.clientHeight);
    this.letters.forEach(letter => letter.resize())
  }
}

class Letter {
  constructor(letterString, count, container, index, total) {
    this.container = container
    this.character = letterString;
    this.mainElement = null;
    this.position = { x: 0, y: 0 };
    this.elements = [];
    this.index = index;
    
    this.createLayers(count)
  }
  
  createLayers(count) {
    for(let i = 0; i < count; i++) {

      const layer = i;

      const span = document.createElement('span')
      span.setAttribute('aria-hidden', true)
      span.classList.add('letter')
      span.classList.add(i == 0 ? 'front' : 'under')
      if(i) span.setAttribute('contenteditable', false)
      if(i == count - 1) span.classList.add('back')
      span.innerHTML = this.character === ' ' ? '&nbsp;' : this.character;
      span.dataset['depth'] = layer;
      span.dataset['index'] = this.index;
      span.style.setProperty("--layer", count - layer);
      span.style.setProperty("--centerOffset", (layer - (count - 1) * 0.5 ) / ((count - 1) * 0.5) );
     
      this.elements.push(span)

      if(i === 0) {
        this.mainElement = span;
      }

      this.container.appendChild(span)
    }
  }
  
  resize() {
    const x = this.mainElement.offsetLeft
      
    this.elements.forEach(span => {
      span.style.setProperty("--xPos", x);
    })
  }
}

// Animations

const animations = {
  simple: (word) => {
    gsap.fromTo(word.element, {rotateY: -40}, {rotateY: 40, ease: 'power2.inOut', yoyo: true, repeat: -1, duration: 5})
  },
  intro: (word) => {
    const tl = gsap.timeline()
    
    word.letters.forEach((letter, i) => {
      letter.elements.forEach((layer, j) => {
        tl.fromTo(layer, {'--depth': 1}, {'--depth': 150, ease: 'back', duration: 0.5}, 0.1 * i)
      })
    })
    
    gsap.to('.down-arrow', {yPercent: 100, yoyo: true, repeat: -1, duration: 0.7})
    
    const introSection = document.querySelector('.intro');
    let mouseOver = false;
    let position = {x: 0.5,  y: 0.5};
    introSection.addEventListener('mouseover', () => {mouseOver = true})
    introSection.addEventListener('mouseout', () => {mouseOver = false})
    introSection.addEventListener('mousemove', (e) => {
      if(mouseOver) {
        const y = e.clientY / window.innerHeight
        position.x = e.clientX / window.innerWidth;
        position.y = e.clientY / window.innerHeight;
      }
    })
    
    const tick = () => {
      if(mouseOver) {
        let x = position.y * 2 - 1;
        gsap.set(introSection, {'--mouseX': x - x * 2, '--mouseY': position.x * 2 - 1})
      }
      window.requestAnimationFrame(tick)
    }
    tick();
  },
  hulk: (word) => {
    
    let smashes = 0;
    
    const cracks = document.querySelector('.cracks')
    const smokeContainer = document.querySelector('.smokeContainer')
    const smokeParticles = []
    
    const size = {
      width: 1831,
      height: 939
    }
    
    const resetSmash = () => {
      smashes = 0;
      cracks.classList.remove('smash-1', 'smash-2', 'smash-3')
    }
    
    ScrollTrigger.create({
      trigger: '.hulk',
      start: 'top bottom',
      end: 'bottom top',
      onToggle: self => {
        if(self.isActive) resetSmash();
      }
    });
    
    for(let i = 0; i < 20; i++) {
      const particle = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      particle.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#smoke');
      smokeContainer.appendChild(particle)
      smokeParticles.push(particle);
      
      gsap.set(particle, {scale: 1, xPercent: 0, yPercent: 0, x: size.width * 0.15 + Math.random() * (size.width * 0.6), y: size.height * 0.5 - 25, opacity: 0})
    }
    
    const smokeAnimate = () => {
      
      smokeParticles.forEach((particle) => {
        
        gsap.set(particle, {scale: 1, xPercent: 0, yPercent: 0, x: size.width * 0.15 + Math.random() * (size.width * 0.6), y: size.height * 0.5 - 25, opacity: 0})
        gsap.to(particle, {scale: 1.5, rotate: 'random(-50, 50)' , xPercent: 'random(-100, 100)', yPercent:  'random(-50, 50)', keyframes: [{opacity: 1}, {opacity: 0}], duration: 2, ease: 'power4.out'})
      })
    }
    
    const shake = () => {
      gsap.to(word.element.parentNode, {keyframes: [{x: -75}, {x: 0}], ease: 'elastic', duration: 0.5})
    }
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: word.element,
        start: "top center",
        end: "top 25%",
        toggleActions: "restart none none reverse"
      },
      onComplete: () => {
        smashes++;
        if(smashes < 4){
          cracks.classList.add('smash-' + smashes);
        }
        smokeAnimate()
        shake()
      }
    })
    word.letters.forEach((letter, i) => {
      tl.from(letter.elements.slice(0, -1), {
          z: '+=400', 
          ease: 'back.in',
          duration: 0.2,
          
      }, 0)
    })
  },
  slide: (word) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        
        trigger: word.element,
        start: "bottom 90%",
        end: "top 10%",
        toggleActions: "restart reverse restart reverse"
      },
      defaults : {
        ease: 'power4.out',
        duration: 1
      }
    });
    let count = 0;
    const colors = ['#EE6352', '#59CD90', '#3FA7D6', '#FAC05E']
    const tops = ['#F9CDC8', '#D0F0DF', '#CDE8F3', '#FCE8C5']
    word.letters.forEach((letter, i) => {
      letter.elements.forEach((layer, j) => {
        let isBottom = false;
        let color = colors[count % colors.length];
        if(j == 0) color = tops[count % colors.length]
        if(j == letter.elements.length - 1) {
          color = '#444';
          isBottom = true;
        }
        const delay = 0.05 * i;
        
        tl.to(layer, {       
          delay,
          color: color,
          duration: i == 0 ? 1 : 0.05
        }, 0)
        
        tl.to(layer, {
          '--depth': 50, 
          '--z': isBottom ? 40 : 60,         
          delay
        }, 0)
      })
      if(letter.character !== ' ') count++;
    })
  },
  spin: (word) => {
    gsap.to(word.element, {rotateY: 360, duration: 6, ease: 'none', repeat: -1})
    gsap.to(word.element, {rotateX: 360, duration: 7, ease: 'none', repeat: -1})
    gsap.to(word.element, {rotateZ: 360, duration: 8, ease: 'none', repeat: -1})
  },
  curve: (word) => {
    gsap.fromTo(word.element, {rotateY: 40, rotateZ: 20, rotateX: 20, xPercent: 25}, {rotateY: -40, rotateZ: -20, rotateX: 0, xPercent: -25, ease: 'power3.inOut', scrollTrigger: {
      trigger: word.element.parentNode,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.3
    }})
  },
  donuts: (word) => {
    const rotateZ = [0, 0, -15, -20, 0, 0]
    const y = [0, 100, 10, 60, 0, 60]
    const x = [0, 0, -15, 10, 0, 0]
    
    const tl = gsap.timeline({scrollTrigger: {
            trigger: word.element,
            start: "top 80%",
            toggleActions: "restart none none reverse"
        }});
    
    tl.from(word.element, {rotateX: 60,  duration: 1.5, ease: 'back.inOut'})
    
    word.letters.forEach((letter, i) => {
       
      const rotateRand = Math.random() * 400 - 300
      const durationRand = Math.random() * 0.2
      
      tl.fromTo(letter.elements, { 
          '--x': 0, 
          '--y': -600,
          '--z': 0,
          
          '--rotateZ': -50 + -25 * (i+1),
      },{
        '--x': x[i],
        '--y': y[i],
        '--z': 0,
         '--rotateZ': rotateZ[i] ,
          delay: i * 0.05,
          ease: 'back.inOut',
          duration: 1.5 ,
          
      }, 0)
      
      
    })
  },
  boing: (word) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        
        trigger: word.element,
        start: "50% 60%",
        toggleActions: "play reverse play reverse"
      },
      defaults : {
        ease: 'elastic',
        duration: 1.5
      }
    });
    
    tl.to('.sunburst', {opacity: 0.7, ease: 'power4.out'}, 0)
    
    let count = 0;
    const shades = [['#91A6FF', '#ADBCFF'],['#FF88DC', '#FFADE7'],['#6AB489', '#77BB93'],['#FF7073', '#FF8587'],['#C36BDB', '#CA7CDF'], ['#FAA275', '#FBAF89'] ]
    const tops =  ['#4769FF', '#FF47C8', '#4B956A', '#FF3336', '#AF3ACF', '#F76C26']
    const rotations = [
      {x: -3, y: -4},
      {x: 2, y: -2.5},
      {x: -1, y: -1},
      {x: 2, y: 2},
      {x: -4, y: 2.5},
      {x: 1, y: 2},
      {x: -2, y: 5},
    ]
    word.letters.forEach((letter, i) => {
      letter.elements.forEach((layer, j) => {
        let colors = shades[i % shades.length]
        let color = colors[j % colors.length];
        if(j == 0) color = tops[count % tops.length]
        const delay = 0.05 * i;
        
        tl.to(layer, {       
          delay,
          color: color,
          duration: i == 0 ? 1 : 0.05
        }, 0)
        
        let power = ((letter.elements.length - 1) - j)
        let direction = i - word.letters.length
        
        tl.to(layer, {
          '--depth': 150, 
          '--x': -2 * power,
          '--rotateY': rotations[i % rotations.length].y * power,
          '--rotateX': rotations[i % rotations.length].x * power,
          '--z': 40,         
          delay
        }, 0)
        
      })
      if(letter.character !== ' ') count++;
    })
  },
  oreo: (word) => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: word.element.parentNode,
        start: "top 60%",
        end: "top top",
        scrub: 0.3,
        toggleActions: "play reverse play reverse"
      },
      defaults : {
        ease: 'linear',
        duration: 1
      }
    });
    
    tl.fromTo(word.element, { 
      rotateX: 90, 
      rotateY: 90,
    }, {
      rotateX: 50, 
      rotateY: 0, 
      duration: 15, 
      ease: 'power2.inOut'
    }, 0)
    
    word.letters.forEach((letter, i) => {
      letter.elements.forEach((layer, j) => {
        tl.fromTo(layer, {       
         '--x': -100 * i + 30 * i
        }, {
         '--x': 0,
          duration: 1 * i,
        }, 6)
        
        tl.fromTo(layer, {
          '--y': -40 ,
          '--z': 60,
          '--rotateY': -70,
        },{  
          '--z': 0,
          '--y': 0,
          '--rotateY': 0,
          duration: 1.5,
          ease: 'bounce'
        }, 6 + 1 * i + 0.05)
 
      })
    })
  }
}

// Create words

const words = [...document.querySelectorAll('.word')].map(element => new Word(element))

// Resize

const onResize = () => {
  words.forEach(word => word.onResize())
}
setTimeout(() => onResize(), 1000)

// Adjust perspective on scroll

const sections = [...document.querySelectorAll('[data-animate-perspective]')];

sections.forEach(section => {
 gsap.fromTo(section, { perspectiveOrigin: "50% -50%" },
  {
    ease: "none",
    perspectiveOrigin: "50% 150%",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    },
  });
})

onResize()
window.addEventListener('resize', () => onResize())

// a little help with safari
if (navigator.vendor.startsWith('Apple')) document.documentElement.classList.add('safari');
