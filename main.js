/*********
 * made by Matthias Hurrle (@atzedent)
 */

/** @type {HTMLCanvasElement} */
const canvas = window.canvas
const gl = canvas.getContext("webgl2")
const dpr = Math.max(1, window.devicePixelRatio)
/** @type {Map<string,PointerEvent>} */
const touches = new Map()

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec2 position;

void main(void) {
    gl_Position = vec4(position, 0., 1.);
}
`
const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform int pointerCount;
uniform vec2 touch;

#define T (12.+mod(time,180.))
#define S smoothstep
#define P pointerCount
#define mouse (touch/resolution)
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
#define hue(a) (.24+.4*cos(10.3*(a)+vec3(0,83,21)))

float rnd(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float ftor(vec3 p, vec3 s, float r) {
  vec2 e = vec2(
    abs(length(p.xz)-s.x-s.z),
    abs(p.y)-s.y
  );

  return length(max(e,.0))+
  min(.0, max(e.x, e.y))-r;
}

float map(vec3 p) {
  const float dst = 6.2;
  vec3 s =
  vec3(1, 1,.2)+
  (-sin(2.8*(T+sin(.2*T)*.5+.5)+p.y*2.)*.2);
  s = abs(s);
  p.xz *= 1.+cos(atan(p.x, p.z)*8.)*.2;

  return ftor(p, s, .075)*.5;
}

vec3 norm(vec3 p) {
  vec2 e = vec2(1e-3, 0);
  float d = map(p);
  vec3 n = d-vec3(
    map(p-e.xyy),
    map(p-e.yxy),
    map(p-e.yyx)
  );

  return normalize(n);
}

float tween(float a) {
  return a*a*a*a*a;
}

void cam(inout vec3 p) {
  if (P > 0) {
    p.yz *= rot(-mouse.y*acos(-1.)+acos(.0));
    p.xz *= rot(acos(-1.)-mouse.x*acos(-1.) * 2.);
  } else {
    p.yz *= rot(tween(cos(T*.2))*.4);
    p.xz *= rot(tween(sin(T*.2))*.3);
    p.xy *= rot(tween(cos(T*.2))*.2);
  }
}

void main(void) {
  vec2 uv = (
    gl_FragCoord.xy-.5*resolution.xy
  )/min(resolution.x, resolution.y);

  vec3 col = vec3(0),
  lcol = vec3(1,.5,.3),
  ro = vec3(0, 0, -6),
  rd = normalize(vec3(uv, 1));

  cam(ro);
  cam(rd);

  vec3 p = ro,

  lp = vec3(1, -.5, -4.5);

  lp.yz *= rot(exp(-cos(T)*.1));

  const float steps = 400., maxd = 12.;
  float dd = .0,
  ii = .0,
  at = .0,
  side = 1.;

  for (float i = .0; i < steps; i++, ii = i) {
    float d = map(p)*side;
    if (d < 1e-3) {
      vec3 n = norm(p)*side,
      l = normalize(lp-p);

      if (dot(l, n) < .0) l = -l;

      float
      diff = clamp(dot(l, n),.0, 1.)*.5+.5,
      fres = max(.0, dot(-rd, n));

      vec3 r = reflect(rd, n),
      h = normalize(l-r),
      mat = vec3(0);
      mat += lcol*at+hue(at*10.)*.05;;
      mat += diff * fres * (
        2.8 * pow(max(.0, dot(h, n)), 64.) +
        .5 * pow(max(.0, dot(r, n)), 32.)
      );
      mat += 5e-2*fres*vec3(0, 2, 1);
      mat -= 5e-2*diff*vec3(1, 2, 1);

      col = mix(col, mat*2.,fres);

      side = -side;

      vec3 rdo = refract(rd, n, 1.+side*.45);

      if (dot(rdo, rdo) == .0) {
        rdo = reflect(rd, n);
      }

      rd = rdo;
      d = 5e-2;
    }
    if (dd > maxd) {
      dd = maxd;
      break;
    }
    p += rd*d;
    dd += d;
    at += exp(.125*rnd(p.xz)-dot(p-lp, p-lp)*.45);
  }

  col += lcol*at;
  col += S(.0, 1.,ii/600.);
 
  fragColor = vec4(col, 1);
}
`
let time
let buffer
let program
let touch
let resolution
let pointerCount
let vertices = []
let touching = false

function resize() {
    const { innerWidth: width, innerHeight: height } = window

    canvas.width = width * dpr
    canvas.height = height * dpr

    gl.viewport(0, 0, width * dpr, height * dpr)
}

function compile(shader, source) {
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
    }
}

function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    program = gl.createProgram()

    compile(vs, vertexSource)
    compile(fs, fragmentSource)

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
    }

    vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]

    buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    time = gl.getUniformLocation(program, "time")
    touch = gl.getUniformLocation(program, "touch")
    pointerCount = gl.getUniformLocation(program, "pointerCount")
    resolution = gl.getUniformLocation(program, "resolution")
}

function draw(now) {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.uniform1f(time, now * 0.001)
    gl.uniform2f(touch, ...getTouches())
    gl.uniform1i(pointerCount, touches.size)
    gl.uniform2f(resolution, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5)
}

function getTouches() {
    if (!touches.size) {
        return [0, 0]
    }

    for (let [id, t] of touches) {
        const result = [dpr * t.clientX, dpr * (innerHeight - t.clientY)]

        return result
    }
}

function loop(now) {
    draw(now)
    requestAnimationFrame(loop)
}

function init() {
    setup()
    resize()
    loop(0)
}

document.body.onload = init
window.onresize = resize
canvas.onpointerdown = e => {
    touching = true
    touches.set(e.pointerId, e)
}
canvas.onpointermove = e => {
    if (!touching) return
    touches.set(e.pointerId, e)
}
canvas.onpointerup = e => {
    touching = false
    touches.clear()
}
canvas.onpointerout = e => {
    touching = false
    touches.clear()
}
