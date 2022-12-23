"use strict";
console.clear();
gsap.registerPlugin(MotionPathPlugin);
const App = () => {
    const [opened, setOpened] = React.useState(0);
    const [inPlace, setInPlace] = React.useState(0);
    const [disabled, setDisabled] = React.useState(false);
    const images = [
        { title: 'Mini canine', url: 'https://images.unsplash.com/photo-1585427795543-33cf23ea2853?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
        { title: 'Wheely tent', url: 'https://images.unsplash.com/photo-1583797227225-4233106c5a2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
        { title: 'Red food things', url: 'https://images.unsplash.com/photo-1561626450-730502dba332?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
        { title: 'Sand boat', url: 'https://images.unsplash.com/photo-1585221454166-ce690e60465f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
        { title: 'Screen thing', url: 'https://images.unsplash.com/photo-1507160874687-6fe86a78b22e?ixlib?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
        { title: 'Horse tornado', url: 'https://images.unsplash.com/photo-1583551536442-0fc55ac443f6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ' },
    ];
    const onClick = (index) => { if (!disabled)
        setOpened(index); };
    const onInPlace = (index) => setInPlace(index);
    const next = () => {
        let nextIndex = opened + 1;
        if (nextIndex >= images.length)
            nextIndex = 0;
        onClick(nextIndex);
    };
    React.useEffect(() => setDisabled(true), [opened]);
    React.useEffect(() => setDisabled(false), [inPlace]);
    // React.useEffect(() => {
    // 	if(CodePen && CodePen.isThumbnail)
    // 	{
    // 		setTimeout(() => next(), 100)
    // 	}
    // }, [])
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container shadow" },
            images.map((image, i) => React.createElement("div", { key: image.url, className: "image", style: { zIndex: inPlace === i ? i : images.length + 1 } },
                React.createElement(Image, { total: images.length, id: i, url: image.url, title: image.title, open: opened === i, inPlace: inPlace === i, onInPlace: onInPlace }))),
            React.createElement("div", { className: "tabs" },
                React.createElement(Tabs, { className: "tabs", images: images, onSelect: onClick }))),
        React.createElement("button", { className: "button next shadow", onClick: next },
            React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24" },
                " ",
                React.createElement("path", { d: "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" }),
                " "))));
};
const Image = ({ url, title, open, inPlace, id, onInPlace, total }) => {
    const [firstLoad, loaded] = React.useState(true);
    const clip = React.useRef(null);
    const border = React.useRef(null);
    const gap = 10;
    const circle = 7;
    const defaults = { transformOrigin: 'center center' };
    const duration = 0.4;
    const width = 400;
    const height = 400;
    const scale = 700;
    let bigSize = (circle * scale);
    let overlap = 0;
    const getPosSmall = () => ({ x: (width / 2) - ((total * ((circle * 2) + gap) - gap) / 2) + (id * ((circle * 2) + gap)), y: height - 30, scale: 1 });
    const getPosSmallAbove = () => ({ x: (width / 2) - ((total * ((circle * 2) + gap) - gap) / 2) + (id * ((circle * 2) + gap)), y: height / 2, scale: 1 });
    const getPosSmallBelow = () => ({ x: width * 0.5, y: height - 30, scale: 1 });
    const getPosCenter = () => ({ x: width / 2, y: height / 2, scale: 7 });
    const getPosEnd = () => ({ x: width / 2 - bigSize + overlap, y: height / 2, scale: scale });
    const getPosStart = () => ({ x: width / 2 + bigSize - overlap, y: height / 2, scale: scale });
    const onStateChange = () => {
        loaded(false);
        if (border.current) {
            gsap.set(border.current, Object.assign(Object.assign({}, defaults), getPosSmall()));
            console.log(border.current);
        }
        if (clip.current) {
            let flipDuration = firstLoad ? 0 : duration;
            let upDuration = firstLoad ? 0 : 0.2;
            let bounceDuration = firstLoad ? 0.01 : 1;
            let delay = firstLoad ? 0 : flipDuration + upDuration;
            if (open) {
                // gsap.fromTo(
                // 	`.letters_${id}`, 
                // 	{rotation: 'random(-180, 180)', x: `random(${width * 0.7}, ${width * 0.9})`, y: `random(${height * 0.4}, ${height * 0.6})`, opacity: 1}, 
                // 	{ease: 'power3.Out', delay: `random(${upDuration + 0.2}, ${upDuration + 0.6})`, duration: flipDuration * 1.5, opacity: 1, rotation: 0, motionPath:[{x: width * 0.1, y: height * 0.5}, {x: 40, y: 60}]}
                // );
                gsap.timeline()
                    .set(clip.current, Object.assign(Object.assign({}, defaults), getPosSmall()))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosCenter()), { duration: upDuration, ease: 'power3.inOut' }))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosEnd()), { duration: flipDuration, ease: 'power4.in', onComplete: () => onInPlace(id) }));
            }
            else {
                gsap.timeline();
                //.fromTo(`.letters_${id}`, {x: 40, y: 60, rotation: 0}, {delay: 0.7, duration: duration * 2, x: `random(${width * 0.24}, ${width - 100})`, y: `random(${20}, ${height/2})`, opacity: 0.75, rotation: 'random(-90, 90)', ease: 'Power3.Out'})
                // .to(`.letters_${id}`, {duration: 0.3, ease: 'power2.in', opacity: 0, x: width / 2, y: height / 2})
                gsap.timeline({ overwrite: true })
                    .set(clip.current, Object.assign(Object.assign({}, defaults), getPosStart()))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosCenter()), { delay: delay, duration: flipDuration, ease: 'power4.out' }))
                    .to(clip.current, Object.assign(Object.assign({}, defaults), { motionPath: [getPosSmallAbove(), getPosSmall()], duration: bounceDuration, ease: 'bounce.out' }));
            }
        }
    };
    React.useEffect(onStateChange, [open, clip]);
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "xMidYMid slice" },
        React.createElement("defs", null,
            React.createElement("clipPath", { id: id + "_circleClip" },
                React.createElement("circle", { class: "clip", cx: "0", cy: "0", r: circle, ref: clip })),
            React.createElement("clipPath", { id: id + "_squareClip" },
                React.createElement("rect", { class: "clip", width: width, height: height }))),
        React.createElement("g", { clipPath: `url(#${id + (inPlace ? '_squareClip' : '_circleClip')})` },
            React.createElement("image", { width: width, height: height, xlinkHref: url }))));
};
const Tabs = ({ images, onSelect }) => {
    const gap = 10;
    const circle = 7;
    const defaults = { transformOrigin: 'center center' };
    const width = 400;
    const height = 400;
    const getPosX = (i) => (width / 2) - ((images.length * ((circle * 2) + gap) - gap) / 2) + (i * ((circle * 2) + gap));
    const getPosY = (i) => height - 30;
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "xMidYMid slice" }, (!images ? [] : images).map((image, i) => React.createElement("circle", { onClick: () => onSelect(i), className: "border", cx: getPosX(i), cy: getPosY(i), r: circle + 2 }))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
