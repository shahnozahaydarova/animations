// TypeScript
var typing = new Typed(".text", {
    strings: ["", "creators.", "editors."],
    typeSpeed: 100,
    backSpeed: 40,
    loop: true
  });
  
  // GSAP
  gsap.registerPlugin(ScrollTrigger);
  const introsplitTypes = document.querySelectorAll(".left-part h1");
  introsplitTypes.forEach((char, i) => {
    const i_text = new SplitType(char);
    gsap.to(i_text.chars, {
      y: 0,
      stagger: 0.08, // text splitting transition
      duration: 0.3 // full text duration
    });
  });
  