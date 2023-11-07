/*!
Halloween Party!
@wakana-k
https://codepen.io/wakana-k/pen/KKJdbRv
*/
"use strict";

!(function () {
  function t() {
    !(function () {
      var t, v;
      (e = window.innerWidth),
        (n = window.innerHeight),
        (s = e / 2),
        (c = n / 2),
        (o = l.create()),
        (i = o.world),
        (a = u.create({
          element: document.body,
          engine: o,
          options: {
            width: e,
            height: n,
            wireframes: !1,
            background: "transparent",
            pixelRatio: window.devicePixelRatio
          }
        })),
        (d = m.create()),
        m.run(d, o),
        (o.gravity.scale = 0),
        (o.gravity.x = 0),
        (o.gravity.y = 0);
      t = w.circle(s, c, 0, {
        render: {
          fillStyle: "rgb(240,240,240)",
          strokeStyle: "rgb(240,240,240)",
          lineWidth: 0
        },
        isStatic: !0,
        plugin: {
          attractors: [
            function (t, e) {
              return {
                x: 1e-6 * (t.position.x - e.position.x),
                y: 1e-6 * (t.position.y - e.position.y)
              };
            }
          ]
        }
      });
      M.add(i, t);
      const S = [svg_spider, svg_bat, svg_ghost, svg_jack];
      let b = 60 / 512,
        k = b;
      1 == r && (k = 3.2 * b);
      p.choose(S);
      S.forEach(function (t) {
        let r = g.stack(0, 0, 1, 2, 0, 0, function (r, i) {
          return (
            (r = p.random(0, e)),
            (i = p.random(0, n)),
            w.circle(
              r,
              i,
              30,
              {
                friction: 0.1,
                frictionAir: p.random(0.02, 0.5),
                mass: p.random(0.005, 0.03),
                angle: Math.round(360 * Math.random()),
                render: {
                  sprite: {
                    texture: t,
                    xScale: k,
                    yScale: k
                  }
                }
              },
              !0
            )
          );
        });
        M.add(i, r);
      });
      let R = g.stack(0, 0, 3, 1, 0, 0, function (t, r) {
        return (
          (t = p.random(0, e)),
          (r = p.random(0, n)),
          w.circle(
            t,
            r,
            20,
            {
              friction: 0.1,
              frictionAir: p.random(0.08, 0.8),
              mass: p.random(0.01, 0.2),
              angle: Math.round(360 * Math.random()),
              render: {
                sprite: {
                  texture: svg_pumpkin,
                  xScale: 0.065,
                  yScale: 0.065
                }
              }
            },
            !0
          )
        );
      });
      M.add(i, R), (k = b = 30 / 512), 1 == r && (k = 3.2 * b);
      let _ = g.stack(0, 0, 20, 1, 0, 0, function (t, r) {
        y.push(y.shift());
        let i = y[0],
          o = svg_candy.replace("red", i);
        (t = p.random(0, e)), (r = p.random(0, n));
        let a = w.circle(
          t,
          r,
          15,
          {
            friction: 0.1,
            frictionAir: p.random(0.08, 0.8),
            mass: p.random(0.01, 0.2),
            angle: Math.round(360 * Math.random()),
            render: {
              sprite: {
                texture: o,
                xScale: k,
                yScale: k
              }
            }
          },
          !0
        );
        return a;
      });
      M.add(i, _);
      v = h.create(a.canvas);
      f.on(o, "afterUpdate", function () {
        v.position.x &&
          x.translate(t, {
            x: 0.12 * (v.position.x - t.position.x),
            y: 0.12 * (v.position.y - t.position.y)
          });
      }),
        u.run(a);
    })();
  }
  let e,
    n,
    r = window.devicePixelRatio;
  Matter.use("matter-attractors");
  Matter.World;
  let i,
    o,
    a,
    d,
    s,
    c,
    l = Matter.Engine,
    u = Matter.Render,
    m = Matter.Runner,
    g = Matter.Composites,
    p = Matter.Common,
    h = (Matter.MouseConstraint, Matter.Mouse),
    M = Matter.Composite,
    w = (Matter.Vertices, Matter.Bodies),
    x = Matter.Body,
    f = Matter.Events,
    y =
      (Matter.Query,
      Matter.Svg,
      ["darkorange", "limegreen", "cornflowerblue", "magenta", "crimson"]);
  (window.onload = () => {
    t();
  }),
    (window.onresize = () => {
      (e = window.innerWidth),
        (n = window.innerHeight),
        (a.bounds.max.x = e),
        (a.bounds.max.y = n),
        (a.options.width = e),
        (a.options.height = n),
        (a.canvas.width = e),
        (a.canvas.height = n),
        Matter.Render.setPixelRatio(a, window.devicePixelRatio);
    });
})();
