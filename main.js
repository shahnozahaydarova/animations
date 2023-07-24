var filter = document.querySelector("#displacementFilter")
var filterValues = {
  baseFrequency : 0.01,
  scale : 50,
}

gsap.set(filterValues, {scale: filterValues.scale, numOctaves: filterValues.numOctaves, baseFrequency: filterValues.baseFrequency})
gsap.to(filterValues, 4, {scale: 0, baseFrequency: 0.0075, repeat: -1, yoyo: true, ease: "expo.inOut", onUpdate: function(){
  filter.querySelector("feDisplacementMap").setAttribute("scale", filterValues.scale)
  filter.querySelector("feTurbulence").setAttribute("baseFrequency", filterValues.baseFrequency)
}})

var light = document.querySelector("#lightMe1")
var lightValues = {
  k1 : 1,
  k2 : 1,
  k3 : 1,
  k4 : 1,
  x : 150,
  y : 150,
  z : 5,
}

gsap.set(lightValues, {k1 : 1, k2 : 0, k3 : 0, k4 : 0, x : () => window.innerWidth / 2, y : () => window.innerHeight / 2, z : 5})
gsap.to(lightValues, 4, {k1 : 1, k2 : 0, k3 : 0, k4 : 0, x : () => window.innerWidth / 2, y : () => window.innerHeight / 2, z : 100, repeat: -1, yoyo: true, ease: "expo.inOut", onUpdate: function(){
  light.querySelector("feComposite").setAttribute("k1", lightValues.k1)
  light.querySelector("feComposite").setAttribute("k2", lightValues.k2)
  light.querySelector("feComposite").setAttribute("k3", lightValues.k3)
  light.querySelector("feComposite").setAttribute("k4", lightValues.k4)
  light.querySelector("fePointLight").setAttribute("x", lightValues.x)
  light.querySelector("fePointLight").setAttribute("y", lightValues.y)
  light.querySelector("fePointLight").setAttribute("z", lightValues.z)
}})