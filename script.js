$(document).ready(function () {
  // Generate random color on button click
  $(".generate-btn").click(function () {
    var randomColor = "";
    var characters = "0123456789abcdef";

    // Run for loop to generate color randomly
    for (i = 0; i < 6; i++) {
      randomColor = randomColor + characters[Math.floor(Math.random() * 16)];
    }

    // Add hex color code to input field
    $("#inputField").val("#" + randomColor);
    // Change the text color of input field
    $("#inputField").css("color", "#" + randomColor);
    // Change the border-color of input field
    $("#inputField").css("border-color", "#" + randomColor);
    // Change the div and copy button background color
    $(".color-preview, .copy-btn").css("background-color", "#" + randomColor);
  });

  // Create two functions to add and remove the animation class on alert-msg
  function add() {
    $(".alert-msg").addClass("slide-effect");
  }
  function remove() {
    $(".alert-msg").removeClass("slide-effect");
  }

  // Copy Color code on button click
  $(".copy-btn").click(function () {
    $("#inputField").select();
    document.execCommand("copy");

    // Call the functions
    add();
    setTimeout(remove, 2000);
    // Set the span text equal to input field value
    $(".code").text($("#inputField").val());
  });
});