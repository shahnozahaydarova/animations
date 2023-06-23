// images source : https://www.svgrepo.com/collection/doodle-library-hand-drawn-vectors/

const thumbImage = document.querySelector(".image");
const inputSlider = document.querySelector("input");
const sliderValue = inputSlider.value;

thumbImage.onload = thumbImage.classList.add("baby");

inputSlider.addEventListener("input", updateImage);

function updateImage(e) {
    let img = "";
    thumbImage.className = "";

    console.log(e.target.value);

    switch (e.target.value) {
        case "16.66":
            img = "child";
            break;
        case "33.32":
            img="woman";
            break;
        case "49.98":
            img="date";
            break;
        case "66.64":
            img="family";
            break;
        case "83.3":
            img="elderly";
            break;
        case "99.96":
            img="angel";
            break;
        case "0":
            img = "baby";
            break;
    }

    thumbImage.classList.add(img);
}