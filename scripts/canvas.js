const INPUT_ROWS = document.querySelector(".input-rows");
INPUT_ROWS.addEventListener("click", (function (e) {
  if (e.target && e.target.classList.contains("button")) {
    for (var i = 0; i < (INPUT_ROWS.childElementCount); i++) {
      if (INPUT_ROWS.children[i].contains(e.target)) {
        break;
      }
    }
    curINPUT = INPUT_ROWS.children[i];
    holesNum = 0;
    holesDistHor = 0;
    holesDistVert = 0;
    error = false;
    var width = curINPUT.getElementsByTagName("input")["width"].value;
    var height = curINPUT.getElementsByTagName("input")["height"].value;
    var diameter = curINPUT.getElementsByTagName("select")["diameter"].value;
    var depth = curINPUT.getElementsByTagName("input")["depth"].value;
    var radius = diameter/2;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    reset_canvas();
    if ((width <= 0) || (height <= 0) || (depth <= 0)) {
      window.alert("Введите корректные гарабиты проема");
      var sides = [];
      if (width <= 0) 
        sides.push("width");
      if (height <= 0)
        sides.push("height");
      if (depth <= 0)
        sides.push("depth");
      sides.forEach((side) => {curINPUT.getElementsByTagName("input")[side].classList.add("highlight");});
      setTimeout(function() {
        sides.forEach((side) => {curINPUT.getElementsByTagName("input")[side].classList.remove("highlight")});
      }, 4000);
      error = true;
    }
    var enhancement = curINPUT.getElementsByTagName("select")["job-type"].value == "enhancement";
    if ((enhancement) && (!error)) {
      topEnhancement = get_input(curINPUT.getElementsByTagName("input")["enhancement-top"].value);
      botEnhancement = get_input(curINPUT.getElementsByTagName("input")["enhancement-bot"].value);
      leftEnhancement = get_input(curINPUT.getElementsByTagName("input")["enhancement-left"].value);
      rightEnhancement = get_input(curINPUT.getElementsByTagName("input")["enhancement-right"].value);
      scale_enhancement_input();
      length = get_length(radius);
      var limit = 30*scalar - radius + length;
      if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
        window.alert("Введите значение для расширения проема хотя бы в одном из направлений");
        var enhancementSides = ["enhancement-top", "enhancement-bot", "enhancement-left", "enhancement-right"];
        enhancementSides.forEach((inputId) => {curINPUT.getElementsByTagName("input")[inputId].classList.add("highlight");});
        setTimeout(function() {
          enhancementSides.forEach((inputId) => {curINPUT.getElementsByTagName("input")[inputId].classList.remove("highlight")});
        }, 3000);
        error = true;
      }
      else {
        if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          // completed
          rectMoveX = 250;
          rectMoveY = 250 + topEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          drawTopEnhancement(rectMoveX, rectMoveY);
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          //completed
          rectMoveX = 250;
          rectMoveY = 250 - botEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          drawBotEnhancement(rectMoveX, rectMoveY);
        }
        else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          //completed
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250;
          fill_rectangle("rgb(223,222,227)");
          drawLeftEnhancement(rectMoveX, rectMoveY);
        }
        else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          //completed
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250;
          fill_rectangle("rgb(223,222,227)");
          drawRightEnhancement(rectMoveX, rectMoveY);
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          //completed
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250 + topEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement - limit) && (diameter < leftEnhancement - limit)) {
            fill_enhancement_rectangle("top-left-enhancement");
            var path = new Path(rectMoveX + width/2 - length, rectMoveY - height/2 - length,
              [0, -width - leftEnhancement + 2*length, 0, leftEnhancement - 2*length],
              [-topEnhancement + 2*length, 0, topEnhancement + height - 2*length, 0]);
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement - limit) && (diameter < leftEnhancement - limit) && (diameter < topEnhancement+height)) {
            fill_enhancement_rectangle("top-left-enhancement");
            var path = new Path(rectMoveX + width/2 - length, rectMoveY - height/2 -topEnhancement + length,
              [-width - leftEnhancement + 2*length, 0, leftEnhancement - 2*length],
              [0, topEnhancement + height - 2*length, 0]);
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement - limit) && (diameter >= leftEnhancement - limit) && (diameter < leftEnhancement+width)) {
            fill_enhancement_rectangle("top-left-enhancement");
            var path = new Path(rectMoveX + width/2 - length, rectMoveY - height/2 - length,
              [0, -width - leftEnhancement + 2*length, 0],
              [-topEnhancement + 2*length, 0, topEnhancement + height - 2*length]);
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement - limit) && (diameter >= leftEnhancement - limit) && (diameter < topEnhancement+height) && (diameter < leftEnhancement+width)) {
            fill_enhancement_rectangle("top-left-enhancement");
            var path = new Path(rectMoveX + width/2 - length, rectMoveY - height/2 -topEnhancement + length,
              [-width - leftEnhancement + 2*length, 0],
              [0, topEnhancement + height - 2*length]);
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("top-left-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          //completed
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250 + topEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement - limit) && (diameter < rightEnhancement - limit)) {
            var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
              [0, width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
              [-topEnhancement + 2*length, 0, topEnhancement + height - 2*length, 0]);
            fill_enhancement_rectangle("top-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement - limit) && (diameter < rightEnhancement - limit) && (diameter < topEnhancement + height)) {
            var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
              [width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
              [0, topEnhancement + height - 2*length, 0]);
            fill_enhancement_rectangle("top-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement - limit) && (diameter >= rightEnhancement - limit) && (diameter < rightEnhancement+width)) {
            var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
              [0, width + rightEnhancement - 2*length, 0],
              [-topEnhancement + 2*length, 0, topEnhancement + height - 2*length]);
            fill_enhancement_rectangle("top-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement - limit) && (diameter >= rightEnhancement - limit) && (diameter < topEnhancement+height) && (diameter < rightEnhancement+width)) {
            var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
              [width + rightEnhancement - 2*length, 0],
              [0, topEnhancement + height - 2*length]);
            fill_enhancement_rectangle("top-right-enhancement");
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("top-right-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          // completed
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250 - botEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < botEnhancement - limit) && (diameter < rightEnhancement - limit)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
              [0, width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
              [botEnhancement - 2*length, 0, -botEnhancement - height + 2*length, 0]);
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement - limit) && (diameter < rightEnhancement - limit) && (diameter < botEnhancement+height)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
              [width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
              [0, -botEnhancement - height + 2*length, 0]);
            circlesByPath(path);
          }
          else if ((diameter < botEnhancement - limit) && (diameter >= rightEnhancement - limit) && (diameter < rightEnhancement+width)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
              [0, width + rightEnhancement - 2*length, 0],
              [botEnhancement - 2*length, 0, -botEnhancement - height + 2*length]);
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement - limit) && (diameter >= rightEnhancement - limit) && (diameter < botEnhancement+height) && (diameter < rightEnhancement+width)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
              [width + rightEnhancement - 2*length, 0],
              [0, -botEnhancement - height + 2*length]);
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("bot-right-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          //completed
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250 - botEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < botEnhancement - limit) && (diameter < leftEnhancement - limit)) {
            var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
            [-leftEnhancement + 2 * length, 0, leftEnhancement + width - 2 * length, 0],
            [0, height + botEnhancement - 2 * length, 0, -botEnhancement + 2 * length]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement - limit) && (diameter < leftEnhancement - limit) && (diameter < botEnhancement+height)) {
            var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
              [-leftEnhancement + 2 * length, 0, leftEnhancement + width - 2 * length],
              [0, height + botEnhancement - 2*length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else if ((diameter < botEnhancement - limit) && (diameter >= leftEnhancement - limit) && (diameter < leftEnhancement+width)) {
            var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
              [0, leftEnhancement + width - 2*length, 0],
              [height + botEnhancement - 2 * length, 0, -botEnhancement + 2 * length]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else if ((diameter >= botEnhancement - limit) && (diameter >= leftEnhancement - limit) && (diameter < botEnhancement+height) && (diameter < leftEnhancement+width)) {
            var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
              [0, leftEnhancement + width - 2*length],
              [height + botEnhancement - 2*length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("bot-left-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
          //completed
          rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
          rectMoveY = 250 - botEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if (diameter < botEnhancement+height) {
            if ((diameter < leftEnhancement - limit) && (diameter < rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
                [-leftEnhancement + 2 * length, 0, leftEnhancement + width + rightEnhancement - 2 * length, 0, -rightEnhancement + 2* length],
                [0, height + botEnhancement - 2 * length, 0, -botEnhancement - height + 2 * length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter >= leftEnhancement - limit) && (diameter < rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
                [0, leftEnhancement + width + rightEnhancement - 2*length, 0, -rightEnhancement + 2 * length],
                [height + botEnhancement - 2*length, 0, -botEnhancement - height + 2*length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter >= leftEnhancement - limit) && (diameter >= rightEnhancement - limit) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width))) {
              var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
                [0, leftEnhancement + width + rightEnhancement - 2*length, 0],
                [height + botEnhancement - 2*length, 0, -botEnhancement - height + 2*length]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter < leftEnhancement - limit) && (diameter >= rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
                [-leftEnhancement + 2 * length, 0, leftEnhancement + width + rightEnhancement - 2 * length, 0],
                [0, height + botEnhancement - 2 * length, 0, -botEnhancement - height + 2 * length]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
            }
            else 
              errorAlert();
            draw_polyline("bot-left-right-enhancement");
          }
          else
            errorAlert();
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
          //completed
          rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
          rectMoveY = 250 + topEnhancement/2;
          if (diameter < height+topEnhancement) {
            fill_rectangle("rgb(223,222,227)");
            if ((diameter < leftEnhancement - limit) && (diameter < rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - length, rectMoveY + height/2 - length,
              [-leftEnhancement + 2*length, 0, leftEnhancement + width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
              [0, -height - topEnhancement + 2*length, 0, topEnhancement + height - 2*length, 0]);
              fill_enhancement_rectangle("top-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter >= leftEnhancement - limit) && (diameter >= rightEnhancement - limit) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width)) && (diameter < topEnhancement+height)) {
              var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY + height/2 - length,
                [0, leftEnhancement + width + rightEnhancement - 2*length, 0],
                [-height - topEnhancement + 2*length, 0, topEnhancement + height - 2*length]);
              fill_enhancement_rectangle("top-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter < leftEnhancement - limit) && (diameter >= rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - length, rectMoveY + height/2 - length,
                [-leftEnhancement + 2*length, 0, leftEnhancement + width + rightEnhancement - 2*length, 0],
                [0, -height - topEnhancement + 2*length, 0, topEnhancement + height - 2*length]);
              fill_enhancement_rectangle("top-left-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter >= leftEnhancement - limit) && (diameter < rightEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY + height/2 - length,
                [0, leftEnhancement + width + rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
                [-height - topEnhancement + 2*length, 0, topEnhancement + height - 2*length, 0]);
              fill_enhancement_rectangle("top-left-right-enhancement");
              circlesByPath(path);
            }
            else 
              errorAlert();
          }
          else 
            errorAlert();
          draw_polyline("top-left-right-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          // completed
          rectMoveY = (500 - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
          rectMoveX = 250 - rightEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if (diameter < width + rightEnhancement) {
            if ((diameter < topEnhancement - limit) && (diameter < botEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
              [0, width + rightEnhancement - 2*length, 0, -rightEnhancement - width + 2*length, 0],
              [-topEnhancement + 2*length, 0, topEnhancement + height + botEnhancement - 2*length, 0, -botEnhancement + 2*length]);
              fill_enhancement_rectangle("top-bot-right-enhancement");
              circlesByPath(path);
            }
            else if ((diameter >= topEnhancement - limit) && (diameter < botEnhancement - limit)) {
              var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
                [width + rightEnhancement - 2*length, 0, -rightEnhancement - width + 2*length, 0],
                [0, topEnhancement + height + botEnhancement - 2*length, 0, -botEnhancement + 2*length]);
                fill_enhancement_rectangle("top-bot-right-enhancement");
                circlesByPath(path);
            }
            else if ((diameter >= topEnhancement - limit) && (diameter >= botEnhancement - limit) && ((diameter < botEnhancement+height) || (diameter < topEnhancement+height))) {
              var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
                [width + rightEnhancement - 2*length, 0, -rightEnhancement - width + 2*length],
                [0, topEnhancement + height + botEnhancement - 2*length, 0]);
                fill_enhancement_rectangle("top-bot-right-enhancement");
                circlesByPath(path);
            }
            else if ((diameter < topEnhancement) && (diameter >= botEnhancement)) {
              var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
                [0, width + rightEnhancement - 2*length, 0, -rightEnhancement - width + 2*length],
                [-topEnhancement + 2*length, 0, topEnhancement + height + botEnhancement - 2*length, 0]);
                fill_enhancement_rectangle("top-bot-right-enhancement");
                circlesByPath(path);
            }
            else 
              errorAlert();
            draw_polyline("top-bot-right-enhancement");
          }
          else 
            errorAlert();
        }
        else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          // completed
          rectMoveY = (500 - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
          rectMoveX = 250 + leftEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if (diameter < width + leftEnhancement) {
            if ((diameter < topEnhancement - limit) && (diameter < botEnhancement - limit)) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 + length,
              [0, -width - leftEnhancement + 2*length, 0, leftEnhancement + width - 2*length, 0],
              [botEnhancement - 2*length, 0, -botEnhancement - height - topEnhancement + 2*length, 0, topEnhancement - 2*length]);
              fill_enhancement_rectangle("top-bot-left-enhancement");
              circlesByPath(path);
            }
            else if ((diameter < topEnhancement - limit) && (diameter >= botEnhancement - limit)) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 + botEnhancement - length,
                [-width - leftEnhancement + 2*length, 0, leftEnhancement + width - 2*length, 0],
                [0, -botEnhancement - height - topEnhancement + 2*length, 0, topEnhancement - 2*length]);
                fill_enhancement_rectangle("top-bot-left-enhancement");
                circlesByPath(path);
            }
            else if ((diameter >= topEnhancement - limit) && (diameter >= botEnhancement - limit) && ((diameter < botEnhancement+height) || (diameter < topEnhancement+height))) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 + botEnhancement - length,
                [-width - leftEnhancement + 2*length, 0, leftEnhancement + width - 2*length],
                [0, -botEnhancement - height - topEnhancement + 2*length, 0]);
                fill_enhancement_rectangle("top-bot-left-enhancement");
                circlesByPath(path);
            }
            else if ((diameter >= topEnhancement) && (diameter < botEnhancement)) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 + length,
                [0, -width - leftEnhancement + 2*length, 0, leftEnhancement + width - 2*length],
                [botEnhancement - 2*length, 0, -botEnhancement - height - topEnhancement + 2*length, 0]);
                fill_enhancement_rectangle("top-bot-left-enhancement");
                circlesByPath(path);
              }
            else 
              errorAlert();
            draw_polyline("top-bot-left-enhancement");
          }
          else 
            errorAlert();
        }
        else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement > 0) && ((leftEnhancement + width > diameter) || (rightEnhancement + width > diameter)) && ((topEnhancement + height > diameter) || (botEnhancement + height > diameter))) {
          rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
          rectMoveY = (500 - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
          var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY + height/2 + botEnhancement - length,
            [-rightEnhancement - width - leftEnhancement + 2*length, 0, leftEnhancement + width + rightEnhancement - 2*length, 0],
            [0, -botEnhancement - height - topEnhancement + 2*length, 0, topEnhancement + height + botEnhancement - 2*length]);
          fill_enhancement_rectangle("top-bot-left-right-enhancement");
          fill_rectangle("rgb(223,222,227)");
          circlesByPath(path);
          holesNum--;
          draw_polyline("top-bot-left-right-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
          rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
          rectMoveY = 250;
          fill_rectangle("rgb(223,222,227)");
          drawLeftEnhancement(rectMoveX, rectMoveY);
          drawRightEnhancement(rectMoveX, rectMoveY);
        }
        else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          rectMoveX = 250;
          rectMoveY = (500 - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
          fill_rectangle("rgb(223,222,227)");
          drawTopEnhancement(rectMoveX, rectMoveY);
          drawBotEnhancement(rectMoveX, rectMoveY);
        }
        else
          errorAlert();
      }
      draw_rectangle(width, height, "standart");
    }
    else if (!error) {
      rectMoveX = 250;
      rectMoveY = 250;
      var saw = curINPUT.getElementsByTagName("i")["disk"].classList.contains("fas");
      var wire = curINPUT.getElementsByTagName("select")["job-type"].value == "wire-saw";
      scale_input();
      fill_rectangle("rgb(243,255,253)");
      length = get_length(radius);
      new_width = width/2-length;
      new_height = height/2-length;
      if (saw) {
        if ((width/scalar < 1000) && (height/scalar <1000)) {
          window.alert("Использование стенорезной машины целесообразно если ширина и (или) высота проема больше 1 метра. Проем размером " + curINPUT.getElementsByTagName("input")["width"].value + " x " + curINPUT.getElementsByTagName("input")["height"].value + " выполняется методом алмазного бурения. Скорректируйте исходные данные для выбора стенорезной машины");
          switchCircle (curINPUT.querySelector(".disk .far"));
          switchCircle (curINPUT.querySelector(".bit .far"));
        }
        else {
          if (depth <= 350) {
            fillAllCorners();
            drawAllCorners();
          }
          else if ((depth > 350) && (depth < 400)) {
            fillAllCorners();
            let heightCircNum = get_circNum(height).circNum;
            let heightCircStep = get_circNum(height).circStep;
            holesDistVert = heightCircStep/scalar;
            holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
            let widthCircNum = get_circNum(width).circNum;
            let widthCircStep = get_circNum(width).circStep;
            holesDistHor = widthCircStep/scalar;
            holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
            drawCircles (2, heightCircStep, 2, widthCircStep, 1, "standart");
            drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-1, "standart");
            drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-1, "standart");
            drawAllCorners();
          }
          else if ((depth >= 400) && (depth <= 530)) {
            fillAllCorners();
            let heightCircNum = get_circNum(height).circNum;
            let heightCircStep = get_circNum(height).circStep;
            holesDistVert = heightCircStep/scalar;
            holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
            let widthCircNum = get_circNum(width).circNum;
            let widthCircStep = get_circNum(width).circStep;
            holesDistHor = widthCircStep/scalar;
            holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
            drawCircles (3, heightCircStep, 3, widthCircStep, 1, "standart");
            drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-2, "standart");
            drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-2, "standart");
            drawAllCorners();
          }
          else if (depth > 530) {
            window.alert("Максимальная толщина конструкции при использовании стенорезной машины составляет 530 мм. При большей толщине рекомендуем воспользоваться канатной резкой.");
            $(inputId).addClass("higlight");
            setTimeout(function() {
              enhancementSides.forEach((inputId) => {$(inputId).removeClass("higlight")});
            }, 4000);
            error = true;
          }
        }
      }
      else if (wire) {
        console.log(wire);
      }
      else {
        if ((width>diameter)&&(height>diameter)) {
          fillAllCorners();
          let heightCircNum = get_circNum(height, length, length).circNum;
          let heightCircStep = get_circNum(height, length, length).circStep;
          holesDistVert = heightCircStep/scalar;
          holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
          let widthCircNum = get_circNum(width, length, length).circNum;
          let widthCircStep = get_circNum(width, length, length).circStep;
          holesDistHor = widthCircStep/scalar;
          holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
          drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "standart");
          drawAllCorners();
        }
        else if ((width<=diameter)&&(height<=diameter)) {
          fill_circle(rectMoveX, rectMoveY, radius);
          draw_circle(rectMoveX, rectMoveY, radius);
        }
        else if ((width>diameter)&&(height<=diameter)) {
          x = rectMoveX - (new_width);
          fill_circle(x, rectMoveY, radius);
          x = rectMoveX + (new_width);
          fill_circle(x, rectMoveY, radius);
          let widthCircNum = get_circNum(width).circNum;
          let widthCircStep = get_circNum(width).circStep;
          holesDistHor = widthCircStep/scalar;
          holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
          for (let i=1; i<widthCircNum; i++) {
            x = rectMoveX - (new_width) + widthCircStep*i;
            fill_circle(x, rectMoveY, radius);
          }
          for (let i=1; i<widthCircNum; i++) {
            x = rectMoveX - (new_width) + widthCircStep*i;
            draw_circle(x, rectMoveY, radius);
          }
          x = rectMoveX - (new_width);
          draw_circle(x, rectMoveY, radius);
          x = rectMoveX + (new_width);
          draw_circle(x, rectMoveY, radius);
        }
        else if ((width<=diameter)&&(height>diameter)) {
          x = rectMoveX;
          y = rectMoveY - (new_height);
          fill_circle(x, y, radius);
          x = rectMoveX;
          y = rectMoveY + (new_height);
          fill_circle(x, y, radius);
          var heightCircNum = get_circNum(height).circNum;
          var heightCircStep = get_circNum(height).circStep;
          holesDistVert = heightCircStep/scalar;
          holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
          for (let i=1; i<heightCircNum; i++) {
            y = 250 - (new_height) + heightCircStep*i;
            fill_circle(rectMoveX, y, radius);
          }
          for (let i=1; i<heightCircNum; i++) {
            y = rectMoveY - (new_height) + heightCircStep*i;
            draw_circle(rectMoveX, y, radius);
          }
          y = rectMoveY - (new_height);
          draw_circle(rectMoveX, y, radius);
          y = rectMoveY + (new_height);
          draw_circle(rectMoveX, y, radius);
        }
      }
      draw_rectangle(width, height, "standart");
    }
    if (!error)
      c.style.background="#BFBDC7";
    else
      c.style.background="#f3fffd";
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
    function fill_rectangle(color) {
      var xUpperLeft = rectMoveX - (width/2);
      var yUpperLeft = rectMoveY - (height/2);
      ctx.fillStyle = color;
      ctx.fillRect(xUpperLeft, yUpperLeft, width, height);
    }
    function fill_enhancement_rectangle(mode) {
      if (!error) {
        ctx.fillStyle = "rgb(243,255,253)";
        if (mode == "top-enhancement") {
          var xUpperLeft = rectMoveX - (width/2);
          var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
          ctx.fillRect(xUpperLeft, yUpperLeft, width, topEnhancement);
        }
        else if (mode == "bot-enhancement") {
          var xUpperLeft = rectMoveX - (width/2);
          var yUpperLeft = rectMoveY + (height/2);
          ctx.fillRect(xUpperLeft, yUpperLeft, width, botEnhancement);
        }
        else if (mode == "left-enhancement") {
          var xUpperLeft = rectMoveX - (width/2) - leftEnhancement;
          var yUpperLeft = rectMoveY - (height/2);
          ctx.fillRect(xUpperLeft, yUpperLeft, leftEnhancement, height);
        }
        else if (mode == "right-enhancement") {
          var xUpperLeft = rectMoveX + (width/2);
          var yUpperLeft = rectMoveY - (height/2);
          ctx.fillRect(xUpperLeft, yUpperLeft, rightEnhancement, height);
        }
        else if (mode == "top-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.fill();
        }
        else if (mode == "top-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.fill();
        }
        else if (mode == "bot-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.fill();
        }
        else if (mode == "bot-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.fill();
        }
        else if (mode == "bot-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.fill();
        }
        else if (mode == "top-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.fill();
        }
        else if (mode == "top-bot-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.fill();
        }
        else if (mode == "top-bot-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.fill();
        }
        else if (mode == "top-bot-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.fill();
        }
      }
    }
    function draw_rectangle(widthSize, heightSize, mode, border=1, dash=false) {
      if (!error) {
        if (mode == "standart") {
          var xUpperLeft = rectMoveX - (width/2);
          var yUpperLeft = rectMoveY - (height/2);
        }
        else if (mode == "top-enhancement") {
          var xUpperLeft = rectMoveX - (width/2);
          var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
        }
        else if (mode == "bot-enhancement") {
          var xUpperLeft = rectMoveX - (width/2);
          var yUpperLeft = rectMoveY + (height/2);
        }
        else if (mode == "left-enhancement") {
          var xUpperLeft = rectMoveX - (width/2) - leftEnhancement;
          var yUpperLeft = rectMoveY - (height/2);
        }
        else if (mode == "right-enhancement") {
          var xUpperLeft = rectMoveX + (width/2);
          var yUpperLeft = rectMoveY - (height/2);
        }
        ctx.strokeStyle = "rgb(16,56,125)";
        ctx.lineWidth = 3;
        ctx.rect(xUpperLeft, yUpperLeft, widthSize, heightSize);
        ctx.stroke();
      }
    }
    function draw_polyline (mode){
      if (!error) {
        if (mode == "top-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "top-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "bot-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "bot-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "bot-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "top-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "top-bot-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "top-bot-left-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX + width/2, rectMoveY - height/2);
          ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        else if (mode == "top-bot-left-right-enhancement") {
          ctx.beginPath();
          ctx.moveTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
          ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
          ctx.strokeStyle = "rgb(16,56,125)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
    function fill_circle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(243,255,253)";
      ctx.fill();
    }
    function draw_circle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(16,56,125)";
      ctx.stroke();
      holesNum++;
    }
    function get_length(diameter) {
      length = Math.cos(45 * Math.PI / 180) * diameter;
      return length;
    }
    function get_circNum(sideLength, firstLength, secondLength) {
      const FB = 120/152;
      var between = sideLength-firstLength-secondLength;
      if (between > 0) {
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
            circStepMinRes = Math.abs((circStepMin/scalar) - ((diameter/scalar)*FB));
            circStepRes = Math.abs((circStep/scalar) - ((diameter/scalar)*FB));
            circStepMaxRes = Math.abs((circStepMax/scalar) - ((diameter/scalar)*FB));
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
            if (circStep > diameter*0.98) {
              ++circNum;
              circStep = between/circNum;
            }
            break;
          }
        } while ((dif < 0.95) || (dif > 1.05));
      }
      else {
        circStep = 0;
        circNum = 0;
      }
      return {
        circStep: circStep,
        circNum: circNum,
    };
    }
    function fillCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) {
      var k = i;
      for (i; i<heightCircNum; i++) {
        if (mode == "standart") {
          y = rectMoveY - (new_height) + heightCircStep*i;
          x = rectMoveX - (new_width);
          fill_circle(x, y, radius);
          x = rectMoveX + (new_width);
          fill_circle(x, y, radius);
        }
        if ((mode == "free") && (vert === "true")) {
          (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
          fill_circle(xStart, y, radius);
          if (xLength > 0) {
            (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
            fill_circle(xStart+xLength, y, radius);
          }
        }
      }
      i = k;
      for (i; i<widthCircNum; i++) {
        if (mode == "standart") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - (new_height);
          fill_circle(x, y, radius);
          y = rectMoveY + (new_height);
          fill_circle(x, y, radius);
        }
        if ((mode == "free") && (hor === "true")) {
          (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
          fill_circle(x, yStart, radius);
          if (yLength > 0) {
            (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
            fill_circle(x, yStart+yLength, radius);
          }
        }
      }
    }
    function drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) {
      var k = i;
      for (i; i<heightCircNum; i++) {
        if (mode == "standart") {
          y = rectMoveY - (new_height) + heightCircStep*i;
          x = rectMoveX - (new_width);
          draw_circle(x, y, radius);
          x = rectMoveX + (new_width);
          draw_circle(x, y, radius);
        }
         if ((mode == "free") && (vert === "true")) {
          (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
          draw_circle(xStart, y, radius);
          if (xLength > 0) {
            (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
            draw_circle(xStart+xLength, y, radius);
          }
        }
      }
      i = k;
      for (i; i<widthCircNum; i++) {
        if (mode == "standart") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - (new_height);
          draw_circle(x, y, radius);
          y = rectMoveY + (new_height);
          draw_circle(x, y, radius);
        }
        if ((mode == "free") && (hor === "true")) {
          (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
          draw_circle(x, yStart, radius);
          if (yLength > 0) {
            (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
            draw_circle(x, yStart+yLength, radius);
          }
        }
      }
    }
    function fillAllCorners() {
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
    }
    function drawAllCorners() {
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
    function Path(xStart, yStart, x, y, skipX, skipY) {
      this.xStart = xStart;
      this.yStart = yStart;
      this.x = x;
      this.y = y;
    }
    function HolesDist() {
      this.holesDistVertLeftToRight = [];
      this.holesDistHorTopToBot = [];
    }
    function circlesByPath(path) {
      var xCoord = path.xStart;
      var yCoord = path.yStart;
      fill_circle(xCoord, yCoord, radius);
      if (!((path.x.length == "1") && (path.y.length == "1") && (path.x[0] == "0") && (path.y[0] == "0"))) {
        for (let i = 0; (i < path.x.length); i++) {
          xCoord += path.x[i];
          yCoord += path.y[i];
          fill_circle(xCoord, yCoord, radius);
        }
        var holesDist = new HolesDist();
        xCoord = path.xStart;
        yCoord = path.yStart;
        var v = 0;
        var h = 0;
        for (let i = 0; (i < path.x.length); i++) {
          var xDirection = "false";
          var yDirection = "false";
          var hor = "false";
          var vert = "false";
          heightCircNum = get_circNum(Math.abs(path.y[i]), 0, 0).circNum;
          heightCircStep = get_circNum(Math.abs(path.y[i]), 0, 0).circStep;
          if ((yCoord + path.y[i]) > yCoord) {
            vert = "true";
          }
          else if ((yCoord + path.y[i]) < yCoord) {
            vert = "true";
            yDirection = "true";
          }
          widthCircNum = get_circNum(Math.abs(path.x[i]), 0, 0).circNum;
          widthCircStep = get_circNum(Math.abs(path.x[i]), 0, 0).circStep;
          if ((xCoord + path.x[i]) > xCoord) {
            hor = "true";
          }
          else if ((xCoord + path.x[i]) < xCoord) {
            hor = "true";
            xDirection = "true";
          }
          fillCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
          xCoord += path.x[i];
          yCoord += path.y[i];
        }
        xCoord = path.xStart;
        yCoord = path.yStart;
        for (let i = 0; (i < path.x.length); i++) {
          var xDirection = "false";
          var yDirection = "false";
          var hor = "false";
          var vert = "false";
          heightCircNum = get_circNum(Math.abs(path.y[i]), 0, 0).circNum;
          heightCircStep = get_circNum(Math.abs(path.y[i]), 0, 0).circStep;
          if ((yCoord + path.y[i]) > yCoord) {
            getHolesVert();
          }
          else if ((yCoord + path.y[i]) < yCoord) {
            getHolesVert();
            yDirection = "true";
          }
          widthCircNum = get_circNum(Math.abs(path.x[i]), 0, 0).circNum;
          widthCircStep = get_circNum(Math.abs(path.x[i]), 0, 0).circStep;
          if ((xCoord + path.x[i]) > xCoord) {
            getHolesHor();
          }
          else if ((xCoord + path.x[i]) < xCoord) {
            getHolesHor();
            xDirection = "true";
          }
          drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
          xCoord += path.x[i];
          yCoord += path.y[i];
        }
        xCoord = path.xStart;
        yCoord = path.yStart;
        for (let i = 0; (i < path.x.length); i++) {
          xCoord += path.x[i];
          yCoord += path.y[i];
          draw_circle(xCoord, yCoord, radius);
        }
      }
      xCoord = path.xStart;
      yCoord = path.yStart;
      draw_circle(xCoord, yCoord, radius);
      console.log("holesNum: " + holesNum)
      function getHolesHor() {
        hor = "true";
        holesDist.holesDistHorTopToBot[h] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
        h++;
      }
      function getHolesVert() {
        vert = "true";
        holesDist.holesDistVertLeftToRight[v] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
        v++;
      }

    }
    function scale_enhancement_input(scale=0.8) {
      shortest = Math.min(c.width, c.height);
      if ((leftEnhancement > 0)&&(rightEnhancement > 0))
        maxWidth = parseFloat(width) + leftEnhancement + rightEnhancement;
      else if ((leftEnhancement <= 0) || (rightEnhancement <= 0))
        maxWidth = parseFloat(width) + leftEnhancement + rightEnhancement;
      if ((topEnhancement > 0)&&(botEnhancement > 0))
        maxHeight = parseFloat(height) + topEnhancement + botEnhancement;
      else if ((topEnhancement <= 0) || (botEnhancement <= 0))
        maxHeight = parseFloat(height) + topEnhancement + botEnhancement;
      longest_side = Math.max(maxWidth, maxHeight, diameter)
      max_length = shortest*scale;
      scalar = max_length/longest_side;
      width = width*scalar;
      height = height*scalar;
      diameter = diameter*scalar;
      radius = radius*scalar;
      topEnhancement = topEnhancement*scalar;
      botEnhancement = botEnhancement*scalar;
      leftEnhancement = leftEnhancement*scalar;
      rightEnhancement = rightEnhancement*scalar;
    }
    function errorAlert () {
        window.alert("Выбранный диаметр не применим для заданного вида работ. Рекомендуем выбрать диаметр не более длины, на которую будет расширен проем");
        curINPUT.getElementsByTagName("select")["diameter"].classList.add("highlight");
        setTimeout(function() {
          curINPUT.getElementsByTagName("select")["diameter"].classList.remove("highlight");
        }, 3000);
        error = true;
        fill_rectangle("rgb(243,255,253)");
        var enhancementSides = ["enhancement-top", "enhancement-bot", "enhancement-left", "enhancement-right"];
        var sides = [];
        enhancementSides.forEach((inputId) => {
          if (curINPUT.getElementsByTagName("input")[inputId].value > 0)
            sides.push(curINPUT.getElementsByTagName("input")[inputId].value);
        });
        var minSide = sides[0];
        for (let i=1; i<sides.length; i++) {
          if (sides[i]*1<minSide)
            minSide = sides[i];
        } 
        var diameters = curINPUT.querySelector("select");
        var dif = minSide;
        var diameterSelected = "";
        for (let i=0; (i<diameters.childElementCount); i++) {
          let difValue = Math.abs(diameters.children[i].value-minSide);
          if (difValue < dif) {
            dif = difValue;
            diameterSelected = i;
          }
        }
        curINPUT.getElementsByTagName("select")["diameter"].options.selectedIndex = diameterSelected;
      }
    function get_input(a) {
      a = a ? parseFloat(a) : 0;
      return a;
    }
    function drawTopEnhancement(rectMoveX, rectMoveY) {
      if ((diameter < topEnhancement - limit) && (diameter < width - limit)) {
        fill_enhancement_rectangle("top-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
          [0, width - 2*length, 0],
          [-topEnhancement + 2*length, 0, topEnhancement - 2*length]);
        circlesByPath(path);
      }
      else if ((diameter >= topEnhancement - limit) && (diameter < width - limit)) {
        fill_enhancement_rectangle("top-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
          [width - 2*length],
          [0]);
        circlesByPath(path);
      }
      else if ((diameter < topEnhancement - limit) && (diameter >= width - limit)) {
        fill_enhancement_rectangle("top-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
          [0],
          [topEnhancement - 2*length]);
        circlesByPath(path);
      }
      else if ((diameter >= topEnhancement - limit) && (diameter >= width - limit)) {
        fill_enhancement_rectangle("top-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
          [0],
          [0]);
        circlesByPath(path);
      }
      else 
        errorAlert();
      draw_rectangle(width, topEnhancement, "top-enhancement");
    }
    function drawBotEnhancement(rectMoveX, rectMoveY) {
      if ((diameter < botEnhancement - limit) && (diameter < width - limit)) {
        fill_enhancement_rectangle("bot-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
          [0, width - 2*length, 0],
          [botEnhancement - 2*length, 0, -botEnhancement + 2*length]);
        circlesByPath(path);
      }
      else if ((diameter >= botEnhancement - limit) && (diameter < width - limit)) {
        fill_enhancement_rectangle("bot-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
          [width - 2*length],
          [0]);
        circlesByPath(path);
      }
      else if ((diameter < botEnhancement - limit) && (diameter >= width - limit)) {
        fill_enhancement_rectangle("bot-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
          [0],
          [botEnhancement - 2*length]);
        circlesByPath(path);
      }
      else if ((diameter >= botEnhancement - limit) && (diameter >= width - limit)) {
        fill_enhancement_rectangle("bot-enhancement");
        var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
          [0],
          [0]);
        circlesByPath(path);
      }
      else 
        errorAlert();
      draw_rectangle(width, botEnhancement, "bot-enhancement");
    }
    function drawLeftEnhancement(rectMoveX, rectMoveY) {
      if ((diameter < leftEnhancement - limit) && (diameter < height - limit)) {
        fill_enhancement_rectangle("left-enhancement");
        var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
          [-leftEnhancement + 2*length, 0, leftEnhancement - 2*length],
          [0, height - 2*length, 0]);
        circlesByPath(path);
      }
      else if ((diameter >= leftEnhancement - limit) && (diameter < height - limit)) {
        fill_enhancement_rectangle("left-enhancement");
        var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
          [0],
          [height - 2*length]);
        circlesByPath(path);
      }
      else if ((diameter < leftEnhancement - limit) && (diameter >= height - limit)) {
        fill_enhancement_rectangle("left-enhancement");
        var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
          [-leftEnhancement + 2*length],
          [0]);
        circlesByPath(path);
      }
      else if ((diameter >= leftEnhancement - limit) && (diameter >= height - limit)) {
        fill_enhancement_rectangle("left-enhancement");
        var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
          [0],
          [0]);
        circlesByPath(path);
      }
      else 
        errorAlert();
      draw_rectangle(leftEnhancement, height, "left-enhancement");
    }
    function drawRightEnhancement(rectMoveX, rectMoveY) {
      if ((diameter < rightEnhancement - limit) && (diameter < height - limit)) {
        fill_enhancement_rectangle("right-enhancement");
        var path = new Path(rectMoveX + width/2 + length, rectMoveY - height/2 + length,
          [rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
          [0, height - 2*length, 0]);
        circlesByPath(path);
      }
      else if ((diameter >= rightEnhancement - limit) && (diameter < height - limit)) {
        fill_enhancement_rectangle("right-enhancement");
        var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length,
          [0],
          [height - 2*length]);
        circlesByPath(path);
      }
      else if ((diameter < rightEnhancement - limit) && (diameter >= height - limit)) {
        fill_enhancement_rectangle("right-enhancement");
        var path = new Path(rectMoveX + width/2 + length, rectMoveY - height/2 + length,
          [rightEnhancement - 2*length],
          [0]);
        circlesByPath(path);
      }
      else if ((diameter >= rightEnhancement - limit) && (diameter >= height - limit)) {
        fill_enhancement_rectangle("right-enhancement");
        var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length,
          [0],
          [0]);
        circlesByPath(path);
      }
      else 
        errorAlert();
      draw_rectangle(rightEnhancement, height, "right-enhancement");
    }
    /* CanvasInfo */
    // var canvasInfo = document.querySelector(".canvasInfo");
    // canvasInfo
  }
}), false);
// function Embrasure(width, height, depth, diameter, selectBitOrSaw, quantity, material, job, waste, wasteWeightLimit, concreteWeight, elevation, water, holesNum, holesDistHor, holesDistVert, cutNum, cutLengthHor, cutLengthVert, cutLengthTotal, coringPrice, coringMoney, cuttingPrice, cuttingMoney) {
//   this.width = width;
//   this.height = height;
//   this.depth = depth;
//   this.diameter = diameter;
//   this.selectBitOrSaw = selectBitOrSaw;
//   this.quantity = quantity;
//   this.material = material;
//   this.job = job;
//   this.waste = waste;
//   this.wasteWeightLimit = wasteWeightLimit;
//   this.concreteWeight = concreteWeight;
//   this.elevation = elevation;
//   this.water = water;
//   this.holesNum = holesNum;
//   this.holesDistHor = holesDistHor;
//   this.holesDistVert = holesDistVert;
//   this.cutNum = cutNum;
//   this.cutLengthHor = function() {
//     if (this.width < 1000)
//       return 0;
//     else return this.width*2;
//   };
//   this.cutLengthVert = function() {
//     if (this.height < 1000)
//       return 0;
//     else return this.height*2;
//   };
//   this.cutLengthTotal = function() {
//     return (this.cutLengthHor+this.cutLengthVert);
//   };
//   this.coringPrice = coringPrice;
//   this.coringMoney = function() {
//     var money = (this.holesNum*this.depth*this.coringPrice/100);
//     if (elevation)
//       money = 1.1*money;
//     if (water)
//       money = 1.2*money;
//     return money;
//   };
//   this.cuttingPrice = cuttingPrice;
//   this.cuttingMoney = function() {
//     return (this.cutLengthTotal*this.depth*this.cuttingPrice/1000);
//   };
//   this.wasteWeight = wasteWeight;
//   this.wastePrice = wastePrice;
//   this.wasteMoney = function() {
//     return (this.wasteWeight*wastePrice);
//   };
// }