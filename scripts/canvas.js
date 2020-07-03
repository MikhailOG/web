const INPUT_ROWS = document.querySelector(".input-rows");
INPUT_ROWS.addEventListener("click", (function (e) {
  if (e.target && e.target.classList.contains("button")) {
    for (var i = 0; i < (INPUT_ROWS.childElementCount); i++) {
      if (INPUT_ROWS.children[i].contains(e.target)) {
        break;
      }
    }
    var curINPUT = INPUT_ROWS.children[i];
    holesNum = 0;
    holesDistHor = 0;
    holesDistVert = 0;
    var width = curINPUT.getElementsByTagName("input")["width"].value;
    var height = curINPUT.getElementsByTagName("input")["height"].value;
    var diameter = curINPUT.getElementsByTagName("select")["diameter"].value;
    var depth = curINPUT.getElementsByTagName("input")["depth"].value;
    var radius = diameter/2;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    reset_canvas()
    var enhancement = curINPUT.getElementsByTagName("select")["job-type"].value == "enhancement";
    if (enhancement) {
      topEnhancement = parseFloat(curINPUT.getElementsByTagName("input")["enhancement-top"].value);
      botEnhancement = parseFloat(curINPUT.getElementsByTagName("input")["enhancement-bot"].value);
      leftEnhancement = parseFloat(curINPUT.getElementsByTagName("input")["enhancement-left"].value);
      rightEnhancement = parseFloat(curINPUT.getElementsByTagName("input")["enhancement-right"].value);
      scale_enhancement_input();
      console.log("leftE: " + (leftEnhancement));
      console.log("rightE: " + (rightEnhancement));
      console.log("botE: " + (botEnhancement));
      console.log("topE: " + (topEnhancement));
      length = get_length(radius);
      if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
        window.alert("Введите значение для расширения проема хотя бы в одном из направлений");
        var enhancementSides = ["#enhancement-top", "#enhancement-bot", "#enhancement-left", "#enhancement-right"];
        enhancementSides.forEach((inputId) => {$(inputId).addClass("higlight")});
        setTimeout(function() {
          enhancementSides.forEach((inputId) => {$(inputId).removeClass("higlight")});
        }, 4000);
      }
      else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
        rectMoveX = 250;
        rectMoveY = 250 + topEnhancement/2
        var heightCircNum = get_circNum(topEnhancement).circNum;
        var heightCircStep = get_circNum(topEnhancement).circStep;
        holesDistVert = heightCircStep/scalar;
        holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
        var widthCircNum = get_circNum(width).circNum;
        var widthCircStep = get_circNum(width).circStep;
        holesDistHor = widthCircStep/scalar;
        holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
        fill_rectangle("rgb(223,222,227)");
        fill_top_rectangle("rgb(243,255,253)");
        new_width = width/2-length;
        new_height = height/2+length;
        if (diameter < topEnhancement) {
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
        else if (diameter >= topEnhancement) {
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
        draw_rectangle(width, height, "standart");
        draw_rectangle(width, topEnhancement, "top-enhancement");
      }
    }
    else {
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
          else if (depth > 530)
            window.alert("Максимальная толщина конструкции при использовании стенорезной машины составляет 530 мм. При большей толщине рекомендуем воспользоваться канатной резкой.");
        }
      }
      else if (wire) {
        console.log(wire);
      }
      else {
        if ((width>diameter)&&(height>diameter)) {
          fillAllCorners();
          let heightCircNum = get_circNum(height).circNum;
          let heightCircStep = get_circNum(height).circStep;
          holesDistVert = heightCircStep/scalar;
          holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
          let widthCircNum = get_circNum(width).circNum;
          let widthCircStep = get_circNum(width).circStep;
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
    function fill_rectangle(color) {
      var xUpperLeft = rectMoveX - (width/2);
      var yUpperLeft = rectMoveY - (height/2);
      ctx.fillStyle = color;
      ctx.fillRect(xUpperLeft, yUpperLeft, width, height);
    }
    function fill_top_rectangle(color) {
      var xUpperLeft = rectMoveX - (width/2);
      var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
      ctx.fillStyle = color;
      ctx.fillRect(xUpperLeft, yUpperLeft, width, topEnhancement);
    }
    function draw_rectangle(widthSize, heightSize, mode, border=1, dash=false) {
      if (mode == "standart") {
        var xUpperLeft = rectMoveX - (width/2);
        var yUpperLeft = rectMoveY - (height/2);
      }
      else if (mode == "top-enhancement") {
        var xUpperLeft = rectMoveX - (width/2);
        var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
      }
      ctx.beginPath();
      if (dash) {
        ctx.setLineDash([5,5]);
      }
      ctx.strokeStyle = "rgb(16,56,125)";
      ctx.lineWidth = 3;
      ctx.rect(xUpperLeft, yUpperLeft, widthSize, heightSize);
      ctx.stroke();
      ctx.setLineDash([])
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
    function get_circNum(sideLength) {
      const FB = 120/152;
      var between = sideLength-2*length;
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
    function drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode) {
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
        // if (mode == "bot-enhancement") {
        //   y = rectMoveY + botEnhancement - (new_height) + heightCircStep*i;
        //   x = rectMoveX - (new_width);
        //   fill_circle(x, y, radius);
        //   x = rectMoveX + (new_width);
        //   fill_circle(x, y, radius);
        // }
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
    /* Enhancemant fuctions */
    function scale_enhancement_input(scale=0.8) {
      shortest = Math.min(c.width, c.height);
      if ((leftEnhancement > 0)&&(rightEnhancement > 0))
        maxWidth = parseFloat(width) + 2*leftEnhancement + 2*rightEnhancement;
      else if ((leftEnhancement <= 0) || (rightEnhancement <= 0))
        maxWidth = parseFloat(width) + leftEnhancement + rightEnhancement;
      if ((topEnhancement > 0)&&(botEnhancement > 0))
        maxHeight = parseFloat(height) + 2*topEnhancement + 2*botEnhancement;
      else if ((topEnhancement <= 0) || (botEnhancement <= 0))
        maxHeight = parseFloat(height) + topEnhancement + botEnhancement;
      longest_side = Math.max(maxWidth, maxHeight, diameter)
      max_length = shortest*scale;
      scalar = max_length/longest_side;
      console.log("scalar: " + scalar);
      width = width*scalar;
      height = height*scalar;
      diameter = diameter*scalar;
      radius = radius*scalar;
      topEnhancement = topEnhancement*scalar;
      botEnhancement = botEnhancement*scalar;
      leftEnhancement = leftEnhancement*scalar;
      rightEnhancement = rightEnhancement*scalar;
    }
    /* CanvasInfo */
    var canvasInfo = document.querySelector(".canvasInfo");
    canvasInfo
  }
}));
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