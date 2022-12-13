const bluenoise = "https://assets.codepen.io/163598/st_rgb_noise2.png";
const textureList = [bluenoise];

// WEBGL BOOTSTRAP TWGL.js
const gl = document.getElementById("canvas").getContext("webgl2");
const programInfo = twgl.createProgramInfo(gl, [
"vertexShader",
"fragmentShader"]);


const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0] };


const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

// TEXTURE LOADING
let texts;
const getImage = url => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", e => resolve(img));
    img.addEventListener("error", () => {
      reject(new Error(`Failed to load image's URL: ${url}`));
    });
    img.src = url;
  });
};
const loadTexture = imageList => {
  console.log("loading images");
  let promises = imageList.map(item => getImage(item));

  Promise.all(promises).then(images => {
    const txtImages = images.map(item => {
      return { src: item, mag: gl.NEAREST };
    });
    texts = twgl.createTextures(gl, {
      iChannel0: txtImages[0] });


    let uniforms = {
      iChannel0: texts.iChannel0 };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
  });
};
//

// RENDER LOOP
const render = time => {
  twgl.resizeCanvasToDisplaySize(gl.canvas, 1.0);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  let uniforms;

  uniforms = {
    u_time: time * 0.001,
    u_resolution: [gl.canvas.width, gl.canvas.height] };


  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
};
//

// DOM READY
window.addEventListener("DOMContentLoaded", event => {
  loadTexture(textureList);
  requestAnimationFrame(render);
});