

var polygons = document.querySelectorAll("#hexs polygon");
var restartPolygon = document.getElementById("restartPolygon");
var restartText = document.getElementById("restartText");
var redDot = document.getElementById("redDot");
var startText = document.getElementById("startText");
var center = 85;
var polygonCenter = polygons[center];
polygonCenter.classList.add("center");
var polygonsRows = [];
var j = -1;
var desetica = 1;
for (var i = 1; i < 10; i++) {
    window['polygons' + i] = [];
    polygonsRows.push(window['polygons' + i])
}
for (var i = 0; i < polygons.length; i++) {
    j++;
    if (j < 19) {
        window['polygons' + desetica].push(polygons[i]);
        if (j === 18) {
            j = -1;
            desetica++;
        }
    }
}

function changeCentar() {
    startText.setAttribute("x", polygonCenter.getBBox().x);
    startText.setAttribute("y", polygonCenter.getBBox().y)
    startText.setAttribute("textLength", polygonCenter.getBBox().width - 10) 
}
changeCentar(); 
window.onresize = function (event) {
    changeCentar();
}

polygonCenter.addEventListener("click", function () {
    tl.play("start");
    this.removeEventListener("click", arguments.callee);
}, false);

//GSAP Timeline
var tl = new TimelineMax({ delay: 0.5, paused: true });

//do nothing
tl.to(redDot, 0.5, { y: -1 });
tl.add("start");
tl.set(redDot, { visibility: "hidden" });
tl.set(polygonCenter, { opacity: 1 });
tl.to(polygons[center - 19], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center - 20], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center - 1], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center + 18], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center + 19], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center + 1], 0.1, { opacity: 0.2, delay: 0.1 });
tl.to(polygons[center], 0.1, { opacity: 0, delay: 0.1 })
tl.to(startText, 0.5, { scale: 2.2, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, "-=0.6");
tl.to(polygons, 1, { rotation: 30, x: 20, y: -10 });
tl.add("HeyYOU");
tl.call(function () { startText.innerHTML = "Hey YOU!" });
tl.set(startText, { opacity: 0, attr: { textLength: 160 }, scale: 1, x: -50, fontSize: "2.5vw" });
tl.staggerTo(polygons, 0.7, { scaleX: 1.2, scaleY: 0.8, ease: Power1.easeOut, stagger: { amount: 0.5, from: "center" } }, "HeyYOU");
tl.to(startText, 0.7, { opacity: 1, }, "HeyYOU");
tl.set(startText, { x: "+=47px", scale: 1.3 });
tl.call(function () { startText.innerHTML = "you" });
tl.to(startText, 1, { attr: { textLength: 60 }, ease: Elastic.easeOut.config(1, 0.3) });
tl.staggerTo(polygons, 1, { scaleX: 1, scaleY: 1, ease: Power1.easeOut, stagger: { amount: 0.3, from: "center" } });
tl.call(function () { startText.innerHTML = "are" });
tl.to(startText, 0.5, { scale: 1.8, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, "-=0.5");
tl.staggerTo(polygons, 0.7, { scaleX: 0.1, scaleY: 2, ease: Power1.easeOut, stagger: { amount: 0.5, from: "center" } });
tl.call(function () { startText.innerHTML = "awesome" });
tl.to(startText, 0.5, { attr: { textLength: 160 }, scale: 1, x: -60, ease: Elastic.easeOut.config(1, 0.3) })
tl.staggerTo(polygons, 0.7, { scaleX: 1, scaleY: 1, ease: Power1.easeOut, stagger: { amount: 0.5, from: "center" } });
tl.staggerTo(polygons, 1, { opacity: 0, ease: Elastic.easeInOut.config(1, 0.3), stagger: { amount: 0.5, from: "center" } });
tl.to(startText, 0.2, { opacity: 0 }, "-=1.2");
tl.set(polygons, { y: 500, opacity: 1 });
tl.staggerTo(polygonsRows, 1, { y: 0, ease: Power3.easeOut, stagger: { amount: 1 } });
tl.staggerTo(polygons, 1, { rotation: 0, x: 0, y: 0, ease: Back.easeOut.config(1.7), stagger: { amount: 1 } });
tl.staggerTo(polygons, 1.5, { rotation: 0, ease: Elastic.easeInOut.config(1, 0.3), cycle: { x: [0, 50] }, stagger: { amount: 0.5 } });
tl.staggerTo(polygons, 1.5, { x: 0, ease: Elastic.easeInOut.config(1, 0.3), cycle: { x: [50, 0], scale: [0, 1.2] }, stagger: { amount: 0.5 } });
tl.staggerTo(polygons, 1, { scale: 1, x: 0, ease: Elastic.easeInOut.config(1, 0.3), stagger: { amount: 0.5 } });
tl.staggerTo(polygons, 2, { scale: 0.5, rotation: 90, ease: Elastic.easeInOut.config(1, 0.3), cycle: { y: [16, -16, 8, -8] }, stagger: { amount: 0.5 } });
tl.staggerTo(polygons, 1.5, { scale: 1, rotation: -120, y: 70, x: 10, stagger: { amount: 0.5, from: "end" } });
tl.staggerTo(polygons, 0.2, { fill: "url(#transparentGradient)", ease: Elastic.easeInOut.config(1, 0.3), stagger: { amount: 0.2, from: center } }, "-=0.5");
tl.staggerTo(polygons, 2, { rotation: -60, yoyo: true, repeat: 1, ease: Sine.easeInOut, cycle: { y: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, stagger: { amount: 0.5 } });
tl.to(polygonCenter, 1, { scale: 0, rotation: 360, transformOrigin: "50% 50%" });
tl.staggerTo("polygon:not(.center)", 1, { scale: 1, x: 0, y: 0, rotation: 0, ease: Elastic.easeInOut.config(1, 0.3) });
tl.to(".bg", 1, { opacity: 0 }, 31);  
tl.call(function () { document.getElementById("wrapper").style.animationPlayState = 'running' }, this, 30);
tl.call(restartShow, this, 32);
tl.set(redDot, { visibility: "visible" });
tl.to(redDot, 0.4, { opacity: 0, yoyo: true, repeat: -1 });
tl.set(restartPolygon, { cursor: "pointer" });


function restartShow() {
    var x = Math.floor(restartPolygon.getBBox().width / 2 + restartPolygon.getBBox().x);
    var y = Math.floor(restartPolygon.getBBox().height / 2 + restartPolygon.getBBox().y);

    redDot.setAttribute("cx", x + "px");
    redDot.setAttribute("cy", y + 20 + "px");

    restartText.setAttribute("x", x + "px");
    restartText.setAttribute("y", y + "px");

    tl.to(restartPolygon, 1.7, { opacity: 0.5 }, "-=1");
    tl.to(restartText, 1.7, { opacity: 1 }, "-=1");

    restartPolygon.addEventListener("click", function () {
        startText.innerHTML = "Start";
        tl.restart();
        this.removeEventListener("click", arguments.callee);
    }, false);

}

