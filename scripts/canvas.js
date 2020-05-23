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
    var coordinates=[];
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    length = Math.cos(45 * Math.PI / 180) * diameter;
    (function draw() {
        reset_canvas()
        scale_input();
        draw_rectangle(width, height);
        length = get_length(radius);
        new_width = width/2-length;
        new_height = height/2-length;
        if ((width>diameter)&&(height>diameter)) {
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

          const FB = 120/152;
          var between = height-2*length;
          circNum = Math.ceil((height/diameter)/FB);
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

            for (let i=1; i<circNum; i++) {
                y = 250 - (new_height) + circStep*i;
                x = 250 - (new_width);
                draw_circle(x, y, radius);
                x = 250 + (new_width);
                draw_circle(x, y, radius);
              }
          between = width-2*length;
          circNum = Math.ceil((width/diameter)/FB);
          circStep = between/(circNum)
          dif = ((diameter/scalar)*FB)/(circStep/scalar);
          i = 0;
          j = 0;
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
              for (let i=1; i<circNum; i++) {
              x = 250 - (new_width) + circStep*i;
              y = 250 - (new_height);
              draw_circle(x, y, radius);
              y = 250 + (new_height);
              draw_circle(x, y, radius);
              }
            }
            else if ((width<=diameter)&&(height<=diameter)) {
              x = 250;
              y = 250;
              draw_circle(x, y, radius);
            }
            else if ((width>diameter)&&(height<=diameter)) {
              x = 250 - (new_width);
              y = 250;
              draw_circle(x, y, radius);
              x = 250 + (new_width);
              y = 250;
              draw_circle(x, y, radius);

              const FB = 120/152;
              var between = width-2*length;
              circNum = Math.ceil((width/diameter)/FB);
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

                  for (let i=1; i<circNum; i++) {
                      x = 250 - (new_width) + circStep*i;
                      y = 250;
                      draw_circle(x, y, radius);
                    }
                  }
        else if ((width<=diameter)&&(height>diameter)) {
          x = 250;
          y = 250 - (new_height);
          draw_circle(x, y, radius);
          x = 250;
          y = 250 + (new_height);
          draw_circle(x, y, radius);

          const FB = 120/152;
          var between = height-2*length;
          circNum = Math.ceil((height/diameter)/FB);
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

        for (let i=1; i<circNum; i++) {
            y = 250 - (new_height) + circStep*i;
            x = 250;
            draw_circle(x, y, radius);
          }
        }
    })();

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

    function draw_rectangle(width, height, border=1, dash=false) {
        var xUpperLeft = 250 - (width/2);
        var yUpperLeft = 250 - (height/2);
        ctx.beginPath();
        ctx.lineWidth = border;
        if (dash) {
            ctx.setLineDash([5,5]);
        }
        ctx.strokeStyle = "black";
        ctx.rect(xUpperLeft, yUpperLeft, width, height);
        ctx.stroke();
        ctx.setLineDash([])
    }
    function draw_circle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    function get_length(diameter) {
        length = Math.cos(45 * Math.PI / 180) * diameter;
        return length;
    }

  }
}));