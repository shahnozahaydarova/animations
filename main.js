var colors = [
    "#3079e2",
    "#afa899",
    "#ccd8eb",
    "#aff4c6",
    "#3079e2",
    "#afa899",
    "#ccd8eb",
    "#3079e2",
    "#afa899",
    "#ccd8eb"
  ];
  
  function draw() {
    $("#wrap").addClass("loading");
    setTimeout(function() {
      for (var i = 0; i < 10; i++) {
        $(".cell").removeClass("class" + i);
      }
      $("#wrap .cell").each(function() {
        $(this).addClass(
          "class" + (Math.floor(Math.random() * (11 - 1 + 1)) + 1)
        );
      });
      $(".cell").each(function() {
        $(this)
          .get(0)
          .style.setProperty(
            "--color1",
            colors[Math.floor(Math.random() * colors.length)]
          );
  
        $(this)
          .get(0)
          .style.setProperty(
            "--color2",
            colors[Math.floor(Math.random() * colors.length)]
          );
  
        $(this)
          .get(0)
          .style.setProperty(
            "--angle",
            Math.floor(Math.random() * 6) * 90 + "deg"
          );
      });
    }, 0);
    setTimeout(function() {
      $("#wrap").removeClass("loading");
    }, 500);
  }
  
  $(".numberinput").submit(function(event) {
    event.preventDefault();
    var text = $(".number").val();
    var totalChars = text.length;
    var text_as_array = text.split("");
    var Number1 = text_as_array[0];
    var Number2 = text_as_array[1];
    var Number3 = text_as_array[2];
    if (totalChars == 3) {
      $(".firstnumber").addClass("number" + Number1);
      $(".secondnumber").addClass("number" + Number2);
      $(".thirdnumber").addClass("number" + Number3);
    }
    if (totalChars == 2) {
      $(".firstnumber").addClass("number" + Number1);
      $(".secondnumber").addClass("number" + Number2);
      $(".thirdnumber").addClass("drawout");
      $("body").addClass("two");
    }
    if (totalChars == 1) {
      $(".secondnumber").addClass("number" + Number1);
      $(".firstnumber", ".thirdnumber").addClass("drawout");
    }
    $("body").addClass("active");
    draw();
  });
  
  $(".reset").click(function() {
    for (var i = 0; i < 10; i++) {
      $(".number").removeClass("number" + i);
    }
    $("body").removeClass("active");
    $("body").removeClass("two");
    $(".number").removeClass("drawout");
    $(".number")
      .val("")
      .focus();
  });
  
  $(document).ready(function() {
    $(".number").focus();
  });
  
  
  