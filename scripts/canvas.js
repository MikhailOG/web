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
    length = Math.cos(45 * Math.PI / 180) * diameter;
    reset_canvas()
    scale_input();
    fill_rectangle(width, height);
    length = get_length(radius);
    new_width = width/2-length;
    new_height = height/2-length;
    var saw = curINPUT.getElementsByTagName("i")["disk"].classList.contains("fas");
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
          drawCircles (2, heightCircStep, 2, widthCircStep, 1);
          drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-1);
          drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-1);
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
          drawCircles (3, heightCircStep, 3, widthCircStep, 1);
          drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-2);
          drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-2);
          drawAllCorners();
        }
        else if (depth > 530) {
          window.alert("Максимальная толщина конструкции при использовании стенорезной машины составляет 530 мм. При большей толщине рекомендуем воспользоваться канатной резкой.")
        }
      }
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
        drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1);
        drawAllCorners();
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
        let widthCircNum = get_circNum(width).circNum;
        let widthCircStep = get_circNum(width).circStep;
        holesDistHor = widthCircStep/scalar;
        holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
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
        holesDistVert = heightCircStep/scalar;
        holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
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
      holesNum++;
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
    function drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i) {
      var k = i;
      for (i; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250 - (new_width);
        fill_circle(x, y, radius);
        x = 250 + (new_width);
        fill_circle(x, y, radius);
      }
      i = k;
      for (i; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250 - (new_height);
        fill_circle(x, y, radius);
        y = 250 + (new_height);
        fill_circle(x, y, radius);
      }
      i = k;
      for (i; i<heightCircNum; i++) {
        y = 250 - (new_height) + heightCircStep*i;
        x = 250 - (new_width);
        draw_circle(x, y, radius);
        x = 250 + (new_width);
        draw_circle(x, y, radius);
      }
      i = k;
      for (i; i<widthCircNum; i++) {
        x = 250 - (new_width) + widthCircStep*i;
        y = 250 - (new_height);
        draw_circle(x, y, radius);
        y = 250 + (new_height);
        draw_circle(x, y, radius);
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