var text = document.querySelector("h1");
var subtitle = document.querySelector("p");

text.addEventListener("input", function() {
  this.setAttribute("data-text", this.innerText);
});


	const minAxisValue = -45;
	const maxAxisValue = 45;

	const minAxisValue2 = -1000;
	const maxAxisValue2 = 1000;

	const minAxisValue3 = 1000;
	const maxAxisValue3 = -1000;

	const minEventValue = 0;
	const maxEventValue = 1000;
	
        text.style.setProperty("--axis", 0);
        text.style.setProperty("--axis2", 0);
        text.style.setProperty("--axis3", 0);


document.addEventListener('mousemove', function(e) {
  setPosition(e);
});

document.addEventListener('touchmove', function(e) {
  setPosition(e);
});

function setPosition(e) {	
	fluidAxisVariation(minAxisValue, maxAxisValue, minEventValue, maxEventValue, e.pageX, "--axis", text);
	fluidAxisVariation(minAxisValue2, maxAxisValue2, minEventValue, maxEventValue, e.pageY, "--axis2", text);
	fluidAxisVariation(minAxisValue3, maxAxisValue3, minEventValue, maxEventValue, e.pageX, "--axis3", text);

}


// Fluid Axis Variation
function fluidAxisVariation(minimumAxisValue, maximumAxisValue, minimumEventValue, maximumEventValue, eventValue, axisCustomPropertyName, element) {

	const minAxisValue = minimumAxisValue;
	const maxAxisValue = maximumAxisValue;
    const minEventValue = minimumEventValue;
	const maxEventValue = maximumEventValue;
	const currentEventValue = eventValue;

	const eventPercent = (currentEventValue - minEventValue) / (maxEventValue - minEventValue);
	const fontAxisScale = eventPercent * (minAxisValue - maxAxisValue) + maxAxisValue;

	const newAxisValue = currentEventValue > maxEventValue
	   ? minAxisValue
       : currentEventValue < minEventValue
   			? maxAxisValue
   			: fontAxisScale;
	

    element.style.setProperty(axisCustomPropertyName, newAxisValue);

}
