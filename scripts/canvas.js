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
          rectMoveX = 250;
          rectMoveY = 250 + topEnhancement/2;
          var heightCircNum = get_circNum(topEnhancement, length, length).circNum;
          var heightCircStep = get_circNum(topEnhancement, length, length).circStep;
          var widthCircNum = get_circNum(width, length, length).circNum;
          var widthCircStep = get_circNum(width, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          fill_enhancement_rectangle("top-enhancement");
          new_width = width/2-length;
          new_height = height/2+length;
          if ((diameter < topEnhancement) && (diameter < width)) {
            x = rectMoveX - (new_width);
            y = rectMoveY - (new_height);
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - (new_height);
            fill_circle(x, y, radius);
            x = rectMoveX - (new_width);
            y = rectMoveY - (height/2) - (topEnhancement-length);
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - (height/2) - (topEnhancement-length);
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "top-enhancement");
            x = rectMoveX - (new_width);
            y = rectMoveY - (new_height);
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - (new_height);
            draw_circle(x, y, radius);
            x = rectMoveX - (new_width);
            y = rectMoveY - (height/2) - (topEnhancement-length);
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - (height/2) - (topEnhancement-length);
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter < width)) {
            x = rectMoveX - (new_width);
            y = rectMoveY - topEnhancement/2 - height/2;
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - topEnhancement/2 - height/2;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "top-enhancement-single");
            x = rectMoveX - (new_width);
            y = rectMoveY - topEnhancement/2 - height/2;
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY - topEnhancement/2 - height/2;
            draw_circle(x, y, radius);
          }
          else if ((diameter < topEnhancement) && (diameter >= width)) {
            x = rectMoveX;
            y = rectMoveY - (new_height);
            fill_circle(x, y, radius);
            x = rectMoveX;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "top-enhancement-limited-width");
            x = rectMoveX;
            y = rectMoveY - (new_height);
            draw_circle(x, y, radius);
            x = rectMoveX;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter >= width)) {
            x = rectMoveX;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            draw_circle(x, y, radius);
          }
          draw_rectangle(width, topEnhancement, "top-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          rectMoveX = 250;
          rectMoveY = 250 - botEnhancement/2;
          var heightCircNum = get_circNum(botEnhancement, length, length).circNum;
          var heightCircStep = get_circNum(botEnhancement, length, length).circStep;
          var widthCircNum = get_circNum(width, length, length).circNum;
          var widthCircStep = get_circNum(width, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          fill_enhancement_rectangle("bot-enhancement");
          new_width = width/2-length;
          new_height = height/2-length;
          if ((diameter < botEnhancement) && (diameter < width)) {
            x = rectMoveX - (new_width);
            y = rectMoveY + (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX - (new_width);
            y = rectMoveY + (height/2) + (botEnhancement-length);
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + (height/2) + (botEnhancement-length);
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "bot-enhancement");
            x = rectMoveX - (new_width);
            y = rectMoveY + (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX - (new_width);
            y = rectMoveY + (height/2) + (botEnhancement-length);
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + (height/2) + (botEnhancement-length);
            draw_circle(x, y, radius);
          }
          else if ((diameter >= botEnhancement) && (diameter < width)) {
            x = rectMoveX - (new_width);
            y = rectMoveY + botEnhancement/2 + height/2;
            fill_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + botEnhancement/2 + height/2;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "bot-enhancement-single");
            x = rectMoveX - (new_width);
            y = rectMoveY + botEnhancement/2 + height/2;
            draw_circle(x, y, radius);
            x = rectMoveX + (new_width);
            y = rectMoveY + botEnhancement/2 + height/2;
            draw_circle(x, y, radius);
          }
          else if ((diameter < botEnhancement) && (diameter >= width)) {
            x = rectMoveX;
            y = rectMoveY + height/2 + length;
            fill_circle(x, y, radius);
            x = rectMoveX;
            y = rectMoveY + + height/2 + botEnhancement - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "bot-enhancement-limited-width");
            x = rectMoveX;
            y = rectMoveY + height/2 + length;
            draw_circle(x, y, radius);
            x = rectMoveX;
            y = rectMoveY + + height/2 + botEnhancement - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= botEnhancement) && (diameter >= width)) {
            x = rectMoveX;
            y = rectMoveY + height/2 + botEnhancement/2;
            fill_circle(x, y, radius);
            draw_circle(x, y, radius);
          }
          draw_rectangle(width, botEnhancement, "bot-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250;
          var heightCircNum = get_circNum(height, length, length).circNum;
          var heightCircStep = get_circNum(height, length, length).circStep;
          var widthCircNum = get_circNum(leftEnhancement, length, length).circNum;
          var widthCircStep = get_circNum(leftEnhancement, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          fill_enhancement_rectangle("left-enhancement");
          new_width = width/2+length;
          new_height = height/2-length;
          if ((diameter < leftEnhancement) && (diameter < height)) {
            x = rectMoveX - new_width;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX - new_width;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "left-enhancement");
            x = rectMoveX - new_width;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX - new_width;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= leftEnhancement) && (diameter < height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "left-enhancement-single");
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter < leftEnhancement) && (diameter >= height)) {
            x = rectMoveX - width/2 - length;
            y = rectMoveY;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "left-enhancement-limited-height");
            x = rectMoveX - width/2 - length;
            y = rectMoveY;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= leftEnhancement) && (diameter >= height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY;
            fill_circle(x, y, radius);
            draw_circle(x, y, radius);
          }
          draw_rectangle(leftEnhancement, height, "left-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250;
          var heightCircNum = get_circNum(height, length, length).circNum;
          var heightCircStep = get_circNum(height, length, length).circStep;
          var widthCircNum = get_circNum(rightEnhancement, length, length).circNum;
          var widthCircStep = get_circNum(rightEnhancement, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          fill_enhancement_rectangle("right-enhancement");
          new_width = width/2+length;
          new_height = height/2-length;
          if ((diameter < rightEnhancement) && (diameter < height)) {
            x = rectMoveX + new_width;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            x = rectMoveX + new_width;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "right-enhancement");
            x = rectMoveX + new_width;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
            x = rectMoveX + new_width;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= rightEnhancement) && (diameter < height)) {
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - (height/2) + length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "right-enhancement-single");
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - (height/2) + length;
            draw_circle(x, y, radius);
          }
          else if ((diameter < rightEnhancement) && (diameter >= height)) {
            x = rectMoveX + width/2 + length;
            y = rectMoveY;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "right-enhancement-limited-height");
            x = rectMoveX + width/2 + length;
            y = rectMoveY;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= rightEnhancement) && (diameter >= height)) {
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY;
            fill_circle(x, y, radius);
            draw_circle(x, y, radius);
          }
          draw_rectangle(rightEnhancement, height, "right-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250 + topEnhancement/2;
          var heightCircNum = get_circNum(topEnhancement+height, length, length).circNum;
          var heightCircStep = get_circNum(topEnhancement+height, length, length).circStep;
          var widthCircNum = get_circNum(width+leftEnhancement, length, length).circNum;
          var widthCircStep = get_circNum(width+leftEnhancement, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement) && (diameter < leftEnhancement)) {
            fill_enhancement_rectangle("top-left-enhancement");
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 - leftEnhancement + length, rectMoveY - (height/2) - topEnhancement + length);
            heightCircNum = get_circNum(topEnhancement, length, length).circNum;
            heightCircStep = get_circNum(topEnhancement, length, length).circStep;
            widthCircNum = get_circNum(leftEnhancement, length, length).circNum;
            widthCircStep = get_circNum(leftEnhancement, length, length).circStep;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 - length, rectMoveY - (height/2) - topEnhancement + length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 - leftEnhancement + length, rectMoveY + (height/2) - length);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter < leftEnhancement)) {
            fill_enhancement_rectangle("top-left-enhancement");
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - length;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            heightCircNum = get_circNum(topEnhancement + height, topEnhancement/2, length).circNum;
            heightCircStep = get_circNum(topEnhancement + height, topEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 - leftEnhancement + length, rectMoveY - (height/2) - topEnhancement/2);
            heightCircNum = get_circNum(topEnhancement, length, length).circNum;
            heightCircStep = get_circNum(topEnhancement, length, length).circStep;
            widthCircNum = get_circNum(leftEnhancement, length, length).circNum;
            widthCircStep = get_circNum(leftEnhancement, length, length).circStep;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 - leftEnhancement + length, rectMoveY + (height/2) - length);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - length;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter < topEnhancement) && (diameter >= leftEnhancement)) {
            fill_enhancement_rectangle("top-left-enhancement");
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            widthCircNum = get_circNum(leftEnhancement + width, length, leftEnhancement/2).circNum;
            widthCircStep = get_circNum(leftEnhancement + width, length, leftEnhancement/2).circStep;
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 - leftEnhancement/2, rectMoveY - (height/2) - topEnhancement + length);
            heightCircNum = get_circNum(topEnhancement, length, length).circNum;
            heightCircStep = get_circNum(topEnhancement, length, length).circStep;
            widthCircNum = get_circNum(leftEnhancement, length, length).circNum;
            widthCircStep = get_circNum(leftEnhancement, length, length).circStep;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 - length, rectMoveY - (height/2) - topEnhancement + length);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter >= leftEnhancement) && (diameter < topEnhancement+height) && (diameter < leftEnhancement+width)) {
            fill_enhancement_rectangle("top-left-enhancement");
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            fill_circle(x, y, radius);
            heightCircNum = get_circNum(topEnhancement+height, topEnhancement/2, length).circNum;
            heightCircStep = get_circNum(topEnhancement+height, topEnhancement/2, length).circStep;
            widthCircNum = get_circNum(width+leftEnhancement, leftEnhancement/2, length).circNum;
            widthCircStep = get_circNum(width+leftEnhancement, leftEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 - leftEnhancement/2, rectMoveY - (height/2) - topEnhancement/2);
            x = rectMoveX + width/2 - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY + (height/2) - length;
            draw_circle(x, y, radius);
          }
          else 
            errorAlert();
          draw_polyline("top-left-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250 + topEnhancement/2;
          var heightCircNum = get_circNum(topEnhancement, length, length).circNum;
          var heightCircStep = get_circNum(topEnhancement, length, length).circStep;
          var widthCircNum = get_circNum(width+rightEnhancement, length, length).circNum;
          var widthCircStep = get_circNum(width+rightEnhancement, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement) && (diameter < rightEnhancement)) {
            fill_enhancement_rectangle("top-right-enhancement");
            x = rectMoveX + width/2 + length;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length);
            heightCircNum = get_circNum(topEnhancement + height, length, length).circNum;
            heightCircStep = get_circNum(topEnhancement + height, length, length).circStep;
            widthCircNum = get_circNum(rightEnhancement, length, length).circNum;
            widthCircStep = get_circNum(rightEnhancement, length, length).circStep;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement - length, rectMoveY - (height/2) - topEnhancement + length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX + width/2 + length, rectMoveY + (height/2) - length);
            x = rectMoveX + width/2 + length;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter < rightEnhancement)) {
            fill_enhancement_rectangle("top-right-enhancement");
            x = rectMoveX + width/2 + length;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement/2);
            heightCircNum = get_circNum(topEnhancement + height, topEnhancement/2, length).circNum;
            heightCircStep = get_circNum(topEnhancement + height, topEnhancement/2, length).circStep;
            collect_first_Nums();
            widthCircNum = get_circNum(rightEnhancement, length, length).circNum;
            widthCircStep = get_circNum(rightEnhancement, length, length).circStep;
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX + width/2 + length, rectMoveY + height/2 - length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 - topEnhancement/2);
            heightCircNum = 0;
            heightCircStep = 0;
            collect_second_Nums();
            x = rectMoveX + width/2 + length;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
          }
          else if ((diameter < topEnhancement) && (diameter >= rightEnhancement)) {
            fill_enhancement_rectangle("top-right-enhancement");
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - length;
            fill_circle(x, y, radius);
            var widthCircNum = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circNum;
            var widthCircStep = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "true", rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length);
            heightCircNum = get_circNum(topEnhancement + height, length, length).circNum;
            heightCircStep = get_circNum(topEnhancement + height, length, length).circStep;
            widthCircNum = 0;
            widthCircStep = 0;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement/2, rectMoveY - height/2 - topEnhancement + length);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= topEnhancement) && (diameter >= rightEnhancement) && (diameter < topEnhancement+height) && (diameter < rightEnhancement+width)) {
            fill_enhancement_rectangle("top-right-enhancement");
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            fill_circle(x, y, radius);
            heightCircNum = get_circNum(topEnhancement+height, topEnhancement/2, length).circNum;
            heightCircStep = get_circNum(topEnhancement+height, topEnhancement/2, length).circStep;
            widthCircNum = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circNum;
            widthCircStep = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement/2);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement/2, rectMoveY - height/2 - topEnhancement/2);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            draw_circle(x, y, radius);
          }
          else 
            errorAlert();
          draw_polyline("top-right-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          rectMoveX = 250 - rightEnhancement/2;
          rectMoveY = 250 - botEnhancement/2;
          var heightCircNum = get_circNum(botEnhancement, length, length).circNum;
          var heightCircStep = get_circNum(botEnhancement, length, length).circStep;
          var widthCircNum = get_circNum(rightEnhancement, length, length).circNum;
          var widthCircStep = get_circNum(rightEnhancement, length, length).circStep;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < botEnhancement) && (diameter < rightEnhancement)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 + botEnhancement - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 + length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + length;
            y = rectMoveY - height/2 + length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX - width/2 + length, rectMoveY + height/2 + length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX + width/2 + length, rectMoveY - height/2 + length);
            heightCircNum = get_circNum(botEnhancement + height, length, length).circNum;
            heightCircStep = get_circNum(botEnhancement + height, length, length).circStep;
            widthCircNum = get_circNum(width+rightEnhancement, length, length).circNum;
            widthCircStep = get_circNum(width+rightEnhancement, length, length).circStep;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 + botEnhancement - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 + length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + length;
            y = rectMoveY - height/2 + length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= botEnhancement) && (diameter < rightEnhancement)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 + botEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            fill_circle(x, y, radius);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX + width/2 + length, rectMoveY - height/2 + length);
            heightCircNum = get_circNum(botEnhancement + height, botEnhancement/2, length).circNum;
            heightCircStep = get_circNum(botEnhancement + height, botEnhancement/2, length).circStep;
            collect_first_Nums();
            widthCircNum = get_circNum(width+rightEnhancement, length, length).circNum;
            widthCircStep = get_circNum(width+rightEnhancement, length, length).circStep;
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement/2);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length);
            heightCircNum = 0;
            heightCircStep = 0;
            collect_second_Nums();
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY + height/2 + botEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement - length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            draw_circle(x, y, radius);
          }
          else if ((diameter < botEnhancement) && (diameter >= rightEnhancement)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + length;
            fill_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 + botEnhancement - length;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 + length;
            fill_circle(x, y, radius);
            var widthCircNum = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circNum;
            var widthCircStep = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX - width/2 + length, rectMoveY + height/2 + length);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length);
            heightCircNum = get_circNum(botEnhancement + height, length, length).circNum;
            heightCircStep = get_circNum(botEnhancement + height, length, length).circStep;
            widthCircNum = 0;
            widthCircStep = 0;
            collect_second_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement/2, rectMoveY - height/2 + length);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + length;
            draw_circle(x, y, radius);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 + botEnhancement - length;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 + length;
            draw_circle(x, y, radius);
          }
          else if ((diameter >= botEnhancement) && (diameter >= rightEnhancement) && (diameter < botEnhancement+height) && (diameter < rightEnhancement+width)) {
            fill_enhancement_rectangle("bot-right-enhancement");
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 + botEnhancement/2;
            fill_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 + length;
            fill_circle(x, y, radius);
            heightCircNum = get_circNum(botEnhancement+height, botEnhancement/2, length).circNum;
            heightCircStep = get_circNum(botEnhancement+height, botEnhancement/2, length).circStep;
            widthCircNum = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circNum;
            widthCircStep = get_circNum(width+rightEnhancement, rightEnhancement/2, length).circStep;
            collect_first_Nums();
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "false", "true", rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement/2);
            drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", "true", "false", rectMoveX + width/2 + rightEnhancement/2, rectMoveY - height/2 + length);
            x = rectMoveX - width/2 + length;
            y = rectMoveY + height/2 + botEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY + height/2 + botEnhancement/2;
            draw_circle(x, y, radius);
            x = rectMoveX + width/2 + rightEnhancement/2;
            y = rectMoveY - height/2 + length;
            draw_circle(x, y, radius);
          }
          else 
            errorAlert();
          draw_polyline("bot-right-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          //complete
          rectMoveX = 250 + leftEnhancement/2;
          rectMoveY = 250 - botEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < botEnhancement) && (diameter < leftEnhancement)) {
            var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
            [-leftEnhancement + 2 * length, 0, leftEnhancement + width - 2 * length, 0],
            [0, height + botEnhancement - 2 * length, 0, -botEnhancement + 2 * length]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter < leftEnhancement)) {
            var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
              [-leftEnhancement + 2 * length, 0, leftEnhancement + width - 2 * length],
              [0, height + botEnhancement/2 - length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else if ((diameter < botEnhancement) && (diameter >= leftEnhancement)) {
            var path = new Path(rectMoveX - width/2 - leftEnhancement/2, rectMoveY - height/2 + length,
              [0, leftEnhancement/2 + width - length, 0],
              [height + botEnhancement - 2 * length, 0, -botEnhancement + 2 * length]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter >= leftEnhancement) && (diameter < botEnhancement+height) && (diameter < leftEnhancement+width)) {
            var path = new Path(rectMoveX - width/2 - leftEnhancement/2, rectMoveY - height/2 + length,
              [0, leftEnhancement/2 + width - length],
              [height + botEnhancement/2 - length, 0]);
              fill_enhancement_rectangle("bot-left-right-enhancement");
              circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("bot-left-enhancement");
        }
        else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
          switch (longest_side) {
            case maxWidth:
              rectMoveX = 50 + leftEnhancement + width/2;
              break;
            case maxHeight:
              rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
            break;
          }
          rectMoveY = 250 - botEnhancement/2;
          collect_first_Nums();
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < botEnhancement) && (diameter < leftEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 - length;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [-leftEnhancement + 2 * length, 0, leftEnhancement + width + rightEnhancement - 2 * length, 0, -rightEnhancement + 2* length],
            [0, height + botEnhancement - 2 * length, 0, -botEnhancement - height + 2 * length, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter < leftEnhancement) && (diameter < rightEnhancement) && (diameter < botEnhancement+height)) {
            x = rectMoveX - width/2 - length;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [-leftEnhancement + 2 * length, 0, leftEnhancement + width + rightEnhancement - 2 * length, 0, -rightEnhancement + 2 * length],
            [0, height + botEnhancement/2 - length, 0, -botEnhancement/2 - height + length, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter >= leftEnhancement) && (diameter < rightEnhancement) && (diameter < botEnhancement+height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [0, leftEnhancement/2 + width + rightEnhancement - length, 0, -rightEnhancement + 2 * length],
            [height + botEnhancement/2 - length, 0, -botEnhancement/2 - height + length, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter >= leftEnhancement) && (diameter >= rightEnhancement) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width)) && (diameter < botEnhancement+height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [0, (leftEnhancement/2 + width + rightEnhancement/2), 0],
            [(height + botEnhancement/2 - length), 0, (-botEnhancement/2 - height + length)],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= botEnhancement) && (diameter < leftEnhancement) && (diameter >= rightEnhancement) && (diameter < botEnhancement+height)) {
            x = rectMoveX - width/2 - length;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [(-leftEnhancement + 2 * length), 0, (leftEnhancement + width + rightEnhancement/2 - length), 0],
            [0, (height + botEnhancement/2 - length), 0, (-botEnhancement/2 - height + length)],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < botEnhancement) && (diameter >= leftEnhancement) && (diameter >= rightEnhancement) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width))) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [0, (leftEnhancement/2 + width + rightEnhancement/2), 0],
            [(height + botEnhancement - 2*length), 0, (-botEnhancement - height + 2 * length)],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < botEnhancement) && (diameter < leftEnhancement) && (diameter >= rightEnhancement)) {
            x = rectMoveX - width/2 - length;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [(-leftEnhancement + 2 * length), 0, (leftEnhancement + width + rightEnhancement/2 - length), 0],
            [0, (height + botEnhancement - 2 * length), 0, (-botEnhancement - height + 2 * length)],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < botEnhancement) && (diameter >= leftEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 + length;
            var path = new Path(x, y,
            [0, leftEnhancement + width + rightEnhancement - 2 * length, 0, -rightEnhancement + 2* length],
            [height + botEnhancement - 2 * length, 0, -botEnhancement - height + 2 * length, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("bot-left-right-enhancement");
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("bot-left-right-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
          //complete
          switch (longest_side) {
            case maxWidth:
              rectMoveX = 50 + leftEnhancement + width/2;
              break;
            case maxHeight:
              rectMoveX = (500 - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
            break;
          }
          rectMoveY = 250 + topEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement) && (diameter < leftEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, leftEnhancement - 2*length, width + 2*length, rightEnhancement - 2*length, 0],
            [topEnhancement + height - 2*length, 0, 0, 0, -height - topEnhancement + 2*length],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter < leftEnhancement) && (diameter < rightEnhancement) && (diameter < topEnhancement+height)) {
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, leftEnhancement - 2*length, width + 2*length, rightEnhancement - 2*length, 0],
            [topEnhancement/2 + height - length, 0, 0, 0, -height - topEnhancement/2 + length],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter >= leftEnhancement) && (diameter < rightEnhancement) && (diameter < topEnhancement+height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, leftEnhancement/2 + width + length, rightEnhancement - 2*length, 0],
            [topEnhancement/2 + height - length, 0, 0, -height - topEnhancement/2 + length],
            [0, 1, 0, 0],
            [0, 0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter >= leftEnhancement) && (diameter >= rightEnhancement) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width)) && (diameter < topEnhancement+height)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, leftEnhancement/2 + width + rightEnhancement/2, 0],
            [topEnhancement/2 + height - length, 0, -height - topEnhancement/2 + length],
            [0, 1, 0],
            [0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter < leftEnhancement) && (diameter >= rightEnhancement)) {
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, leftEnhancement - 2*length, width + length + rightEnhancement/2, 0],
            [topEnhancement + height - 2*length, 0, 0, -height - topEnhancement + 2*length],
            [0, 0, 1, 0],
            [0, 0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter >= leftEnhancement) && (diameter >= rightEnhancement) && ((diameter < leftEnhancement+width) || (diameter < rightEnhancement+width))) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, width + leftEnhancement/2 + rightEnhancement/2, 0],
            [topEnhancement + height - 2*length, 0, -height - topEnhancement + 2*length],
            [0, 1, 0],
            [0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter < leftEnhancement) && (diameter >= rightEnhancement)) {
            x = rectMoveX - width/2 - leftEnhancement + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, width + leftEnhancement + rightEnhancement/2 - length, 0],
            [topEnhancement/2 + height - length, 0, -height - topEnhancement/2 + length],
            [0, 1, 0],
            [0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter >= leftEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 - leftEnhancement/2;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, leftEnhancement/2 + width + length, rightEnhancement - 2*length, 0],
            [topEnhancement + height - 2*length, 0, 0, -height - topEnhancement + 2*length],
            [0, 1, 0, 0],
            [0, 0, 0, 0]);
            fill_enhancement_rectangle("top-left-right-enhancement");
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("top-left-right-enhancement");
        }
        else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          // complete
          switch (longest_side) {
            case maxWidth:
              rectMoveY = 500 - rightEnhancement - width/2;
              break;
            case maxHeight:
              rectMoveY = (500 - topEnhancement - height - botEnhancement)/2 + topEnhancement + width/2;
            break;
          }
          rectMoveX = 250 - rightEnhancement/2;
          fill_rectangle("rgb(223,222,227)");
          if ((diameter < topEnhancement) && (diameter < botEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, 0, 0, width + rightEnhancement - 2*length, 0],
            [topEnhancement - 2*length, height + 2*length, botEnhancement - 2*length, 0, -botEnhancement -height - topEnhancement + 2*length],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter < botEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, 0, width + rightEnhancement - 2*length, 0],
            [height + topEnhancement/2 + length, botEnhancement - 2*length, 0, -botEnhancement -height - topEnhancement/2 + length],
            [0, 0, 0, 0],
            [1, 0, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter >= botEnhancement) && (diameter < rightEnhancement) && (diameter < botEnhancement+height)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, width + rightEnhancement - 2*length, 0],
            [height + topEnhancement/2 + botEnhancement/2, 0, -botEnhancement/2 -height - topEnhancement/2],
            [0, 0, 0],
            [1, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter >= botEnhancement) && (diameter >= rightEnhancement) && ((diameter < botEnhancement+height) || (diameter < topEnhancement+height)) && (diameter < rightEnhancement+width)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, width + rightEnhancement/2 - length, 0],
            [height + topEnhancement/2 + botEnhancement/2, 0, -botEnhancement/2 -height - topEnhancement/2],
            [0, 0, 0],
            [1, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter >= topEnhancement) && (diameter < botEnhancement) && (diameter >= rightEnhancement) && (diameter < rightEnhancement+width)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement/2;
            var path = new Path(x, y,
            [0, 0, width + rightEnhancement/2 - length, 0],
            [height + topEnhancement/2 + length, botEnhancement - 2*length, 0, -botEnhancement -height - topEnhancement/2 + length],
            [0, 0, 0, 0],
            [1, 0, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter >= botEnhancement) && (diameter >= rightEnhancement) && (diameter < rightEnhancement+width)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, 0, width + rightEnhancement/2 - length, 0],
            [topEnhancement - 2*length, height + botEnhancement/2 + length, 0, -botEnhancement/2 -height - topEnhancement + length],
            [0, 0, 0, 0],
            [0, 1, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter < botEnhancement) && (diameter >= rightEnhancement) && (diameter < rightEnhancement+width)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, 0, 0, leftEnhancement + width + rightEnhancement/2 - length, 0],
            [topEnhancement - 2*length, height + 2*length, botEnhancement - 2*length, 0, -botEnhancement - height - topEnhancement + 2*length],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else if ((diameter < topEnhancement) && (diameter >= botEnhancement) && (diameter < rightEnhancement)) {
            x = rectMoveX - width/2 + length;
            y = rectMoveY - height/2 - topEnhancement + length;
            var path = new Path(x, y,
            [0, 0, leftEnhancement + width + rightEnhancement - 2*length, 0],
            [topEnhancement - 2*length, height + botEnhancement/2 + length, 0, -botEnhancement/2 - height - topEnhancement + length],
            [0, 0, 0, 0],
            [0, 1, 0, 0]);
            fill_enhancement_rectangle("top-bot-right-enhancement");
            circlesByPath(path);
          }
          else 
            errorAlert();
          draw_polyline("top-bot-right-enhancement");
        }
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
    function drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) {
      var k = i;
      for (i; i<heightCircNum; i++) {
        if (mode == "standart") {
          y = rectMoveY - (new_height) + heightCircStep*i;
          x = rectMoveX - (new_width);
          fill_circle(x, y, radius);
          x = rectMoveX + (new_width);
          fill_circle(x, y, radius);
        }
        if (mode == "top-enhancement") {
          y = rectMoveY - topEnhancement - height/2 + length + heightCircStep*i;
          x = rectMoveX - (new_width);
          fill_circle(x, y, radius);
          x = rectMoveX + (new_width);
          fill_circle(x, y, radius);
        }
        if (mode == "top-enhancement-limited-width") {
          y = rectMoveY - height/2 - topEnhancement + length + heightCircStep*i;
          x = rectMoveX;
          fill_circle(x, y, radius);
        }
        if (mode == "bot-enhancement") {
          y = rectMoveY + height/2 + length + heightCircStep*i;
          x = rectMoveX - (new_width);
          fill_circle(x, y, radius);
          x = rectMoveX + (new_width);
          fill_circle(x, y, radius);
        }
        if (mode == "bot-enhancement-limited-width") {
          y = rectMoveY + height/2 + botEnhancement - length - heightCircStep*i;
          x = rectMoveX;
          fill_circle(x, y, radius);
        }
        if (mode == "left-enhancement") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX - width/2 - leftEnhancement + length;
          fill_circle(x, y, radius);
        }
        if (mode == "left-enhancement-single") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX - width/2 - leftEnhancement/2;
          fill_circle(x, y, radius);
        }
        if (mode == "right-enhancement") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX + width/2 + rightEnhancement - length;
          fill_circle(x, y, radius);
        }
        if (mode == "right-enhancement-single") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX + width/2 + rightEnhancement/2;
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
        if (mode == "top-enhancement") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - topEnhancement - height/2 + length;
          fill_circle(x, y, radius);
        }
        if (mode == "top-enhancement-single") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - topEnhancement/2 - height/2;
          fill_circle(x, y, radius);
        }
        if (mode == "bot-enhancement") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY + height/2 + (botEnhancement - length);
          fill_circle(x, y, radius);
        }
        if (mode == "bot-enhancement-single") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY + botEnhancement/2 + height/2;
          fill_circle(x, y, radius);
        }
        if (mode == "left-enhancement") {
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY - (height/2) + length;
          fill_circle(x, y, radius);
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY + (height/2) - length;
          fill_circle(x, y, radius);
        }
        if (mode == "left-enhancement-limited-height") {
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY;
          fill_circle(x, y, radius);
        }
        if (mode == "right-enhancement") {
          x = rectMoveX + width/2 + length + widthCircStep*i;
          y = rectMoveY - (height/2) + length;
          fill_circle(x, y, radius);
          x = rectMoveX + width/2 + length + widthCircStep*i;
          y = rectMoveY + (height/2) - length;
          fill_circle(x, y, radius);
        }
        if (mode == "right-enhancement-limited-height") {
          x = rectMoveX + width/2 + rightEnhancement - length - widthCircStep*i;
          y = rectMoveY;
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
      i = k;
      for (i; i<heightCircNum; i++) {
        if (mode == "standart") {
          y = rectMoveY - (new_height) + heightCircStep*i;
          x = rectMoveX - (new_width);
          draw_circle(x, y, radius);
          x = rectMoveX + (new_width);
          draw_circle(x, y, radius);
        }
        if (mode == "top-enhancement") {
          y = rectMoveY - topEnhancement - height/2 + length + heightCircStep*i;
          x = rectMoveX - (new_width);
          draw_circle(x, y, radius);
          x = rectMoveX + (new_width);
          draw_circle(x, y, radius);
        }
        if (mode == "top-enhancement-limited-width") {
          y = rectMoveY - topEnhancement - height/2 + length + heightCircStep*i;
          x = rectMoveX;
          draw_circle(x, y, radius);
        }
        if (mode == "bot-enhancement") {
          y = rectMoveY + height/2 + length + heightCircStep*i;
          x = rectMoveX - (new_width);
          draw_circle(x, y, radius);
          x = rectMoveX + (new_width);
          draw_circle(x, y, radius);
        }
        if (mode == "bot-enhancement-limited-width") {
          y = rectMoveY + height/2 + botEnhancement - length - heightCircStep*i;
          x = rectMoveX;
          draw_circle(x, y, radius);
        }
        if (mode == "left-enhancement") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX - width/2 - leftEnhancement + length;
          draw_circle(x, y, radius);
        }
        if (mode == "left-enhancement-single") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX - width/2 - leftEnhancement/2;
          draw_circle(x, y, radius);
        }
        if (mode == "right-enhancement") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX + width/2 + rightEnhancement - length;
          draw_circle(x, y, radius);
        }
        if (mode == "right-enhancement-single") {
          y = rectMoveY - height/2 + length + heightCircStep*i;
          x = rectMoveX + width/2 + rightEnhancement/2;
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
        if (mode == "top-enhancement") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - topEnhancement - height/2 + length;
          draw_circle(x, y, radius);
        }
        if (mode == "top-enhancement-single") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY - topEnhancement/2 - height/2;
          draw_circle(x, y, radius);
        }
        if (mode == "bot-enhancement") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY + height/2 + (botEnhancement - length);
          draw_circle(x, y, radius);
        }
        if (mode == "bot-enhancement-single") {
          x = rectMoveX - (new_width) + widthCircStep*i;
          y = rectMoveY + botEnhancement/2 + height/2;
          draw_circle(x, y, radius);
        }
        if (mode == "left-enhancement") {
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY - (height/2) + length;
          draw_circle(x, y, radius);
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY + (height/2) - length;
          draw_circle(x, y, radius);
        }
        if (mode == "left-enhancement-limited-height") {
          x = rectMoveX - width/2 - leftEnhancement + length + widthCircStep*i;
          y = rectMoveY;
          draw_circle(x, y, radius);
        }
        if (mode == "right-enhancement") {
          x = rectMoveX + width/2 + length + widthCircStep*i;
          y = rectMoveY - (height/2) + length;
          draw_circle(x, y, radius);
          x = rectMoveX + width/2 + length + widthCircStep*i;
          y = rectMoveY + (height/2) - length;
          draw_circle(x, y, radius);
        }
        if (mode == "right-enhancement-limited-height") {
          x = rectMoveX + width/2 + rightEnhancement - length - widthCircStep*i;
          y = rectMoveY;
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
      this.skipX = (function() {
        if (skipX === undefined) {
          var skip = [];
          for (i=0; i < x.length; i++) {
            skip.push("0");
          }
          return skip;
        }
        else
          return skipX;
      })();
      this.skipY = (function() {
        if (skipY === undefined) {
          var skip = [];
          for (i=0; i < y.length; i++) {
            skip.push("0");
          }
          return skip;
        }
        else
          return skipY;
      })();
    }
    // function fillCirclesByPath (path) {
    //   var xCoord = path.xStart;
    //   var yCoord = path.yStart;
    //   fill_circle(xCoord, yCoord, radius);
    //   for (let i = 0; (i < path.x.length); i++) {
    //     xCoord += path.x[i];
    //     yCoord += path.y[i];
    //     fill_circle(xCoord, yCoord, radius);
    //   }
    // }
    function HolesDist() {
      this.holesDistVertLeftToRight = [];
      this.holesDistHorTopToBot = [];
    }
    function circlesByPath(path) {
      var xCoord = path.xStart;
      var yCoord = path.yStart;
      fill_circle(xCoord, yCoord, radius);
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
      for (let i = 0; (i <= path.x.length); i++) {
        var xDirection = "false";
        var yDirection = "false";
        var hor = "false";
        var vert = "false";
        if (i < path.x.length) {
          if (path.skipY[i] == "0") {
            heightCircNum = get_circNum(Math.abs(path.y[i]), 0, 0).circNum;
            heightCircStep = get_circNum(Math.abs(path.y[i]), 0, 0).circStep;
            if ((yCoord + path.y[i]) > yCoord) {
              getHolesVert();
            }
            else if ((yCoord + path.y[i]) < yCoord) {
              getHolesVert();
              yDirection = "true";
            }
          }
          if (path.skipX[i] == "0") {
            widthCircNum = get_circNum(Math.abs(path.x[i]), 0, 0).circNum;
            widthCircStep = get_circNum(Math.abs(path.x[i]), 0, 0).circStep;
            if ((xCoord + path.x[i]) > xCoord) {
              getHolesHor();
            }
            else if ((xCoord + path.x[i]) < xCoord) {
              getHolesHor();
              xDirection = "true";
            }
          }
        }
        else {
          if (checkY() === "true") {
            widthCircNum = get_circNum(Math.abs(xCoord - path.xStart), 0, 0).circNum;
            widthCircStep = get_circNum(Math.abs(xCoord - path.xStart), 0, 0).circStep;
            if ((xCoord - path.xStart) < 0) {
              getHolesHor();
            }
            else if ((xCoord - path.xStart) > 0) {
              getHolesHor();
              xDirection = "true";
            }
          }
        }
          drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
        if (i < path.x.length) {
          xCoord += path.x[i];
          yCoord += path.y[i];
        }
      }
      xCoord = path.xStart;
      yCoord = path.yStart;
      draw_circle(xCoord, yCoord, radius);
      for (let i = 0; (i < path.x.length); i++) {
        xCoord += path.x[i];
        yCoord += path.y[i];
        draw_circle(xCoord, yCoord, radius);
      }
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
      function checkY() {
        let yC = Math.trunc(yCoord) + (yCoord).toString().slice((yCoord).toString().indexOf("."), ((yCoord).toString().indexOf(".")+3))
        let y = Math.trunc(path.yStart) + (path.yStart).toString().slice((path.yStart).toString().indexOf("."), ((path.yStart).toString().indexOf(".")+3))
        if ((parseFloat(yC) === parseFloat(y)) && (topEnhancement>0))
          return "true";
        else 
          return "false";
      }
    }
    // function drawCirclesByPath (path) {
    //   var xCoord = path.xStart;
    //   var yCoord = path.yStart;
    //   draw_circle(xCoord, yCoord, radius);
    //   for (let i = 0; (i < path.x.length); i++) {
    //     xCoord += path.x[i];
    //     yCoord += path.y[i];
    //     draw_circle(xCoord, yCoord, radius);
    //   }
    // }
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
          if (sides[i]<minSide)
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
    function collect_first_Nums() {
      holesDistVertLeftToRight1 = heightCircStep/scalar;
      holesDistVertLeftToRight1 = Math.trunc(heightCircStep/scalar) + holesDistVertLeftToRight1.toString().slice(holesDistVertLeftToRight1.toString().indexOf("."), (holesDistVertLeftToRight1.toString().indexOf(".")+3));
      holesDistHorTopToBot1 = widthCircStep/scalar;
      holesDistHorTopToBot1 = Math.trunc(widthCircStep/scalar) + holesDistHorTopToBot1.toString().slice(holesDistHorTopToBot1.toString().indexOf("."), (holesDistHorTopToBot1.toString().indexOf(".")+3));
    }
    function collect_second_Nums() {
      holesDistVertLeftToRight2 = heightCircStep/scalar;
      holesDistVertLeftToRight2 = Math.trunc(heightCircStep/scalar) + holesDistVertLeftToRight2.toString().slice(holesDistVertLeftToRight2.toString().indexOf("."), (holesDistVertLeftToRight2.toString().indexOf(".")+3));
      holesDistHorTopToBot2 = widthCircStep/scalar;
      holesDistHorTopToBot2 = Math.trunc(widthCircStep/scalar) + holesDistHorTopToBot2.toString().slice(holesDistHorTopToBot2.toString().indexOf("."), (holesDistHorTopToBot2.toString().indexOf(".")+3));
    }
    function collect_third_Nums() {
      holesDistVertLeftToRight3 = heightCircStep/scalar;
      holesDistVertLeftToRight3 = Math.trunc(heightCircStep/scalar) + holesDistVertLeftToRight2.toString().slice(holesDistVertLeftToRight2.toString().indexOf("."), (holesDistVertLeftToRight2.toString().indexOf(".")+3));
      holesDistHorTopToBot3 = widthCircStep/scalar;
      holesDistHorTopToBot3 = Math.trunc(widthCircStep/scalar) + holesDistHorTopToBot2.toString().slice(holesDistHorTopToBot2.toString().indexOf("."), (holesDistHorTopToBot2.toString().indexOf(".")+3));
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