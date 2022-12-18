function makeBeverage(drink) {
	var beverages = ["Coke", "cappuccino", "lemonade"],
	descriptions = ["A glass filled with Coca-Cola splashing with a dropped ice-cube", "A coffee cup filled with cappuccino, with a leaf pattern in the foam", "A glass of lemonade with cut limes and a straw"],
	welcome = document.getElementById("welcomebeverage"),
	welcomeMsg = welcome.querySelector("h1"),
	welcomeImg = welcome.querySelector("img");
	welcomeMsg.innerHTML = "Hey - you’re terrific. You deserve a "+beverages[drink]+".";
	welcomeImg.src = beverages[drink].toLowerCase()+".jpg";
  // needed because CodePen URLs are case-sensitive; /Coke.jpg will not work
	welcomeImg.alt = descriptions[drink];
}

var currentTime = new Date(),
timePeriod = Math.round(currentTime.getHours()/12);
makeBeverage(timePeriod);
setInterval( function() { makeBeverage(timePeriod); }, 1000*60*60 );s