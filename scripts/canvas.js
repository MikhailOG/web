const INPUT_ROWS = document.querySelector(".input-rows");
INPUT_ROWS.addEventListener("click", (function (e) {
  if (e.target && e.target.classList.contains("button")) {
    for (var i = 0; i < (INPUT_ROWS.childElementCount); i++) {
      if (INPUT_ROWS.children[i].contains(e.target)) {
        break;
      }
    }
    var width = INPUT_ROWS.children[i].getElementsByTagName("input")["width"].value;
    var height = INPUT_ROWS.children[i].getElementsByTagName("input")["height"].value;
    var diameter = INPUT_ROWS.children[i].getElementsByTagName("select")["diameter"].value;
    var radius = diameter/2;
    // var coordinates=[];
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    length = Math.cos(45 * Math.PI / 180) * diameter;
    reset_canvas()
    scale_input();
    fill_rectangle(width, height);
    length = get_length(radius);
    new_width = width/2-length;
    new_height = height/2-length;
    if ((width>diameter)&&(height>diameter)) {
      x = 250 - (new_width);
      y = 250 - (new_height);
      fill_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250 - (new_height);
      fill_circle(x, y, radius);
      x = 250 - (new_width);
      y = 250 + (new_height);
      fill_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250 + (new_height);
      fill_circle(x, y, radius);
      var heightCircNum = get_circNum(height).circNum;
      var heightCircStep = get_circNum(height).circStep;
      var widthCircNum = get_circNum(width).circNum;
      var widthCircStep = get_circNum(width).circStep;
      for (let i=1; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250 - (new_width);
        fill_circle(x, y, radius);
        x = 250 + (new_width);
        fill_circle(x, y, radius);
      }
      for (let i=1; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250 - (new_height);
        fill_circle(x, y, radius);
        y = 250 + (new_height);
        fill_circle(x, y, radius);
      }
      for (let i=1; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250 - (new_width);
        draw_circle(x, y, radius);
        x = 250 + (new_width);
        draw_circle(x, y, radius);
      }
      for (let i=1; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250 - (new_height);
        draw_circle(x, y, radius);
        y = 250 + (new_height);
        draw_circle(x, y, radius);
      }
      x = 250 - (new_width);
      y = 250 - (new_height);
      draw_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250 - (new_height);
      draw_circle(x, y, radius);
      x = 250 - (new_width);
      y = 250 + (new_height);
      draw_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250 + (new_height);
      draw_circle(x, y, radius);
    }
    else if ((width<=diameter)&&(height<=diameter)) {
      x = 250;
      y = 250;
      fill_circle(x, y, radius);
      draw_circle(x, y, radius);
    }
    else if ((width>diameter)&&(height<=diameter)) {
      x = 250 - (new_width);
      y = 250;
      fill_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250;
      fill_circle(x, y, radius);
      var widthCircNum = get_circNum(width).circNum;
      var widthCircStep = get_circNum(width).circStep;
      for (let i=1; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250;
        fill_circle(x, y, radius);
      }
      for (let i=1; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250;
        draw_circle(x, y, radius);
      }
      x = 250 - (new_width);
      y = 250;
      draw_circle(x, y, radius);
      x = 250 + (new_width);
      y = 250;
      draw_circle(x, y, radius);
    }
    else if ((width<=diameter)&&(height>diameter)) {
      x = 250;
      y = 250 - (new_height);
      fill_circle(x, y, radius);
      x = 250;
      y = 250 + (new_height);
      fill_circle(x, y, radius);
      var heightCircNum = get_circNum(height).circNum;
      var heightCircStep = get_circNum(height).circStep;
      for (let i=1; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250;
        fill_circle(x, y, radius);
      }
      for (let i=1; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250;
        draw_circle(x, y, radius);
      }
      x = 250;
      y = 250 - (new_height);
      draw_circle(x, y, radius);
      x = 250;
      y = 250 + (new_height);
      draw_circle(x, y, radius);
    }
    draw_rectangle(width, height);
    c.style.background="#BFBDC7";
    function scale_input(scale=0.8) {
      shortest = Math.min(c.width, c.height);
      longest_side = Math.max(width, height, diameter)
      max_length = shortest*scale;
      scalar = max_length/longest_side;
      width = width*scalar;
      height = height*scalar;
      diameter = diameter*scalar;
      radius = radius*scalar;
    }
    function reset_canvas() {
      ctx.clearRect(0, 0, c.width, c.height);
    }
    function fill_rectangle() {
      var xUpperLeft = 250 - (width/2);
      var yUpperLeft = 250 - (height/2)
      ctx.fillStyle = "rgb(243,255,253)";
      ctx.fillRect(xUpperLeft, yUpperLeft, width, height);
    }
    function draw_rectangle(width, height, border=1, dash=false) {
      var xUpperLeft = 250 - (width/2);
      var yUpperLeft = 250 - (height/2);
      ctx.beginPath();
      if (dash) {
        ctx.setLineDash([5,5]);
      }
      ctx.strokeStyle = "rgb(16,56,125)";
      ctx.lineWidth = 3;
      ctx.rect(xUpperLeft, yUpperLeft, width, height);
      ctx.stroke();
      ctx.setLineDash([])
    }
    function fill_circle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    function draw_circle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(16,56,125)";
      ctx.stroke();
    }
    function get_length(diameter) {
      length = Math.cos(45 * Math.PI / 180) * diameter;
      return length;
    }
    function get_circNum(sideLength) {
      const FB = 120/152;
      var between = sideLength-2*length;
      circNum = Math.ceil((sideLength/diameter)/FB);
      circStep = between/circNum;
      var dif = ((diameter/scalar)*FB)/(circStep/scalar);
      var i = 0;
      var j = 0;
      do {
        if (dif < 0.95) {
          ++circNum;
          circStep = between/circNum;
          ++i;
        }
        else if (dif > 1.05) {
          --circNum;
          circStep = between/circNum;
          ++j;
        }
        dif = ((diameter/scalar)*FB) / (circStep/scalar);
        circStep = between/circNum;
        if ((i>=1)&&(j>=1)) {
          var circStepMin = between/(circNum+1);
          var circStepMax = between/(circNum-1);
          circStepMinRes = Math.abs((circStepMin/scalar)- ((diameter/scalar)*FB));
          circStepRes = Math.abs((circStep/scalar)- ((diameter/scalar)*FB));
          circStepMaxRes = Math.abs((circStepMax/scalar)- ((diameter/scalar)*FB));
          minRes = Math.min(circStepMinRes, circStepRes, circStepMaxRes);
          switch (minRes) {
            case circStepRes:
              break;
            case circStepMinRes:
              ++circNum;
              circStep = between/circNum;
              break;
            case circStepMaxRes:
              --circNum;
              circStep = between/circNum;
              break;
          }
          break;
        }
      } while ((dif < 0.95) || (dif > 1.05));
      return {
        circStep: circStep,
        circNum: circNum,
    };
    }
  }
}));