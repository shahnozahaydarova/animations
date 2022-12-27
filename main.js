"use strict";
console.clear();
// These are the colors used for the orange juice particles. 
// I did have a few variations of yellow-orange but it looked 
// strange, so one color for now
const colors = [0xF9B52C];
// The liquid simulation and particle rendering are actually seperate 
// things independant of each other. Pixi.js knows nothing of LiquidFun
// and vise versa.
// This Stage class is where I do all my Pixi.js (canvas) stuff.
class Stage {
    // constructor is a function that gets called when you create a new
    // instance of this class. E.G...
    //
    // let stage = new Stage(element); 
    //
    // We pass in the HTMLElement, that way would could have 2 or more 
    // of these on the page if we wanted.
    constructor(canvas) {
        // Create a new Pixi.js application, and add the canvas to our HTMLElement container
        this.containers = [];
        this.particles = [];
        this.textures = [];
        this.onResize = function () {
            // We center everything when the window resizes
            this.app.renderer.resize(this.element.offsetWidth, this.element.offsetHeight);
            this.stage.position.x = window.innerWidth / 2;
            this.stage.position.y = window.innerHeight / 2;
        };
        this.newParticle = function (color) {
            // this function makes 1 particle, adds it to the
            // ParticleContainer and returns it.
            // This function is called from outside the class.
            // First off lets grab a random color, we only have
            // one so i will always equal 0 for now.
            let i = Math.floor(Math.random() * this.textures.length);
            let texture = this.textures[i];
            let container = this.containers[i];
            // make a new particle sprite from the texture and 
            // add it to the correct ParticleContainer
            let sprite = new PIXI.Sprite(texture);
            sprite.index = i;
            this.particles.push(sprite);
            this.add(sprite, i);
            // return the particle so the main app can update
            // it's position later.
            return sprite;
        };
        this.add = function (element, i) {
            this.containers[i].addChild(element);
        };
        this.remove = function (element, i) {
            this.containers[i].removeChild(element);
        };
        this.element = canvas;
        this.app = new PIXI.Application(this.element.offsetWidth, this.element.offsetHeight, { antialias: false, backgroundColor: 0xD3CFE5 });
        this.element.appendChild(this.app.view);
        // The stage container is where we put everything you see.
        // It's usefull to have a root container, that way we can 
        // move, rotate, etc everything in one go.
        this.stage = new PIXI.Container();
        this.app.stage.addChild(this.stage);
        // We're also going to have another container to hold all 
        // the particles and glass assets. Then juiceContainer gets
        // added to the stage container.
        this.juiceContainer = new PIXI.Container();
        this.stage.addChild(this.juiceContainer);
        // The glass is made up of 2 images. The 'glass' image sits
        // behind the particles and 'shine' image sits above. That 
        // helps make the juice look as if its inside the glass.
        let glassTexture = PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/557388/glass.png');
        let glass = new PIXI.Sprite(glassTexture);
        glass.scale.set(0.5, 0.49);
        glass.position.x = -106;
        glass.position.y = -100;
        let shineTexture = PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/557388/shine.png');
        let shine = new PIXI.Sprite(shineTexture);
        shine.scale.set(0.5, 0.49);
        shine.position.x = -78;
        shine.position.y = -100;
        // We need to add the glass image first, then the 
        // particleContainers and finally the shine added 
        // last (so its on top)
        this.juiceContainer.addChild(glass);
        for (let i = 0; i < colors.length; i++) {
            // To keep things fast we're going to use 
            // ParticleContainers. These are similar to normal
            // containers but with some restrictions to help
            // keep performance up. One of the restrictions is
            // you can only have one particle type in each container.
            // This is why we're creating a new container for each
            // color. At the moment we only have one color so there
            // will only be one ParticleContainer.
            let container = new PIXI.particles.ParticleContainer(10000);
            this.containers.push(container);
            this.juiceContainer.addChild(container);
            // We also need to draw the particle texture as well. 
            // This will be used later when we create the new 
            // particle sprites.
            let graphic = new PIXI.Graphics();
            graphic.lineStyle(0);
            graphic.beginFill(colors[i], 0.8);
            graphic.drawCircle(0, 0, 3);
            graphic.endFill();
            let texture = this.app.renderer.generateTexture(graphic);
            this.textures.push(texture);
        }
        this.juiceContainer.addChild(shine);
        this.onResize();
    }
}
// This Sim class is where most of the LiquidFun (Box2D) stuff is done.
class Sim {
    constructor(world) {
        // I originally had the Sim class create it's own 
        // world but a bug (i think) meant that LiquidFun
        // got confused with world vs this.world.
        // having the world created outside the class and
        // passed in the constructor seemed to fix the issue
        this.width = 0;
        this.height = 0;
        // these are setting for the simulation
        this.timeStep = 1.0 / 60.0;
        this.velocityIterations = 8;
        this.positionIterations = 3;
        this.cooldown = 200;
        this.cooling = false;
        // these consts define how things are positioned
        // outside the sim. METER is used to scale up
        // the simulations positions to standard pixels.
        // So for example when the Sim says a particle is
        // at 0.33 the output for Pixi.js will be 33px
        this.METER = 100;
        this.OFFSET_X = 0;
        this.OFFSET_Y = 0;
        this.PADDING = 50;
        this.onResize = function () {
            let h = window.innerHeight;
            this.width = 200;
            this.height = 300;
            this.height -= this.PADDING;
        };
        this.onMotion = function (x, y) {
            if (x && y) {
                let gravity = new b2Vec2((-y) / 5, (x) / 4);
                this.world.SetGravity(gravity);
            }
        };
        this.step = function () {
            this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);
            this.time += 1 / 60;
        };
        this.addParticles = function () {
            if (!this.cooling) {
                this.cooling = true;
                this.particle.position.Set((25 + (Math.random() * (this.width - 50))) / this.METER, (-this.height + (Math.random() * 100)) / this.METER);
                this.particle.radius = 0.25;
                let particleGroupDef = new b2ParticleGroupDef();
                particleGroupDef.shape = this.particle;
                this.particleSystem.CreateParticleGroup(particleGroupDef);
                setTimeout(() => { this.cooling = false; }, this.cooldown);
            }
        };
        this.world = world;
        let liquidContainerDef = new b2BodyDef();
        let liquidContainer = this.world.CreateBody(liquidContainerDef);
        this.onResize();
        let floor = this.createWallShape(this.width / this.METER / 2, 0.05, new b2Vec2(this.width / this.METER / 2, this.height / this.METER + 0.05));
        let leftWall = this.createWallShape(0.05, this.height / this.METER / 2, new b2Vec2(-0.05, this.height / this.METER / 2));
        let rightWall = this.createWallShape(0.05, this.height / this.METER / 2, new b2Vec2(this.width / this.METER + 0.05, this.height / this.METER / 2));
        liquidContainer.CreateFixtureFromDef(floor);
        liquidContainer.CreateFixtureFromDef(leftWall);
        liquidContainer.CreateFixtureFromDef(rightWall);
        let particleSystemDef = new b2ParticleSystemDef();
        particleSystemDef.radius = 0.03;
        particleSystemDef.dampingStrength = 0.2;
        this.particleSystem = this.world.CreateParticleSystem(particleSystemDef);
        this.particle = new b2CircleShape();
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", e => {
                this.onMotion(e.beta, e.gamma);
            }, true);
        }
        else if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', e => {
                this.onMotion(e.acceleration.x * 2, e.acceleration.y * 2);
            }, true);
        }
    }
    createWallShape(width, height, angle) {
        let wallShape = new b2PolygonShape();
        wallShape.SetAsBoxXYCenterAngle(width, height, angle, 0);
        let fixtureDef = new b2FixtureDef();
        fixtureDef.shape = wallShape;
        fixtureDef.density = 5;
        return fixtureDef;
    }
    getParticles() {
        return this.world.particleSystems[0].GetPositionBuffer();
    }
}
let stage = new Stage(document.getElementById('canvas'));
let gravity = new b2Vec2(0, 10);
let world = new b2World(gravity);
let sim = new Sim(world);
window.addEventListener('resize', e => {
    sim.onResize();
    stage.onResize();
});
function tick() {
    sim.step();
    var particles = sim.getParticles();
    for (var i = 0; i < particles.length / 2; i++) {
        let p = !stage.particles[i] ? stage.newParticle() : stage.particles[i];
        if (p.position.y > window.innerHeight / 2 && !p.removed) {
            stage.remove(p, p.index);
            p.removed = true;
        }
        else {
            var x = (sim.width / 2) - particles[i * 2] * sim.METER + sim.OFFSET_X;
            var y = (sim.height - 100) - (sim.height - particles[(i * 2) + 1] * sim.METER + sim.OFFSET_Y);
            p.position.set(x, y);
        }
    }
    requestAnimationFrame(tick);
}
window.addEventListener('click', () => { sim.addParticles(); });
window.addEventListener('touchstart', () => { sim.addParticles(); });
sim.addParticles();
if (location.pathname.match(/fullcpgrid/i)) {
    document.getElementById('info').style.visibility = "hidden";
    setInterval(() => { sim.addParticles(); }, 500);
}
tick();
