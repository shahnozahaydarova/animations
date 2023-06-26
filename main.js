/*
 * Copyright BarbWire-1 aka Barbara Kälin, 2023
 * MIT License
 */
// The colors get all calculated in CSS! Proof of concept

// HELPER
const rgb2Hex = (rgb) => {
	const [r, g, b] = rgb.match(/\d+/g).map(Number);
	const hex = `0x${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
	const hexString = `${hex.replace("0x", "#")}`.toUpperCase();
	//return {hex, hexString};
	return hexString;
};

// GET ELEMENTS
const $ = (el, scope = document) => scope.getElementById(el); // just lazy
const $$ = (els, scope = document) => scope.getElementsByClassName(els);

const colorData = []; // array to store rgb and hex
const inputContainer = $$("inputs-container")[0];
const colorBlocks = [...$$("base-color")];

// slider-elements
const baseHue = $("baseHue"),
	saturation = $("saturation"),
	lightness = $("lightness"),
	rotation = $("rotation");

// thanks to Kieran Baker for this nice improvement
// never had used Proxies til now
// idea for data-binding by Chris Ferdinandi
// https://gomakethings.com  GREAT SITE!!! ❤️💪

// PROXY TO LISTEN TO AND ALIGN CHANGES ON THE INPUTS
// Using data-prop to align multiple targets
const data = new Proxy(
	{},
	{
		set(target, property, value, receiver) {
			const dataAttributes = document.querySelectorAll(
				`[data-prop="${property}"]`
			);

			for (const attr of dataAttributes) {
				attr.value = value;
			}
			updateColors();
			return true; //Reflect.set(target, property, value, receiver);
		}
	}
);
// Get the value of elements with corresponding data-attribute
inputContainer.addEventListener("input", (event) => {
	data[event.target.dataset.prop] = event.target.value;
});

// update dependants on input changes
const updateColors = () => {
	const setCSSVariable = (prop, value) =>
		document.documentElement.style.setProperty(prop, value);

	// change the values of the css-variables to values from input
	setCSSVariable("--base-hue", baseHue.value);
	setCSSVariable("--saturation", saturation.value + "%");
	setCSSVariable("--lightness", lightness.value + "%");
	setCSSVariable("--rotation", rotation.value);

	colorBlocks.forEach((block, index) => {
		const computedStyle = window.getComputedStyle(block);
		const computedColor = computedStyle.getPropertyValue("background-color");
		const colorCode = rgb2Hex(computedColor);

		// show hex-code
		block.innerHTML = colorCode;
		// change appearance of colorCode
		const cond = lightness.value < 65;
		block.style.color = cond ? "#fff" : "#464646";
		block.style.textShadow = cond ? "var(--shadow)" : "none";
		// write rgb and hex to array
		colorData[index] = {
			rgb: computedColor,
			hex: colorCode
		};
	});
};

//Copy the hex-code to clipboard on click
$("colors").addEventListener("click", (e) => {
	let code = e.target.innerText;
	navigator.clipboard.writeText(e.target.innerText);
	if ((e.target.innerText = code)) e.target.innerText = `copied\nto clipboard`;

	setTimeout(function () {
		e.target.innerText = code;
	}, 250);
});

// SAVE THE PALETTE TO HTML FILE
const downloadPalette = () => {
	// Create HTML content for the file
	let fileContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Palette Sample</title>
        <style>
		@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Poppins&display=swap);
		body {
			font-family: Montserrat;
		}
		* {
			margin: 0;
			padding: 0;
			border: none;
			outline: 0;
			box-sizing: border-box;
			text-align: center;
			}
			h1 {
			margin: 10vh;
			}
		#container {
			margin:auto;
			display: flex;
			flex-direction: row;
			width: fit-content;
			
			}
          .color-block {
            width: 100px;
            height: 160px;
            display: flex;
			justify-content: center;
            margin-right: 10px;
          }
		  .code {
		  	background: #fff;
			border-radius: 3px;
			border: 1px solid #0000002d;
		  	height: fit-content;
			width: 90%;
			margin: 5px auto;
			margin-top: 130%;
		  	

		  }
        </style>
      </head>
      <body>
	  
        <h1>Palette Sample</h1>
		<div id="container">
  `;

	// Iterate over the color data and create color blocks with color codes
	colorData.forEach(({ rgb, hex }) => {
		fileContent += `
      <div class="color-block" style="background-color:${rgb}">
		<div class="code">${hex}</div>
		</div>
     
    `;
	});

	fileContent += `
	</div>
      </body>
    </html>
  `;

	// Create a new Blob object with the HTML content as data
	const blob = new Blob([fileContent], { type: "text/html" });

	// Create a temporary link element
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = "my_color_palette.html";
	link.click();
};

$("saveButton").addEventListener("click", downloadPalette);

// Init
updateColors();
