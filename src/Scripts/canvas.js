export async function canvas(serviceName, data, concreteWeight, wasteWeight, callback) {
  const DIAMETERS = [42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350];
  var holesNum = 0;
  //var sepHolesNum = 0;
  var holesDistHor = 0;
  var holesDistVert = 0;
  var error = false;
  var weightSpread = 2;
  // get data
  var width = data.width;
  var height = data.height;
  var diameter = data.diameter;
  var depth = data.depth;
  var radius = diameter/2;
  var topEnhancement;
  var botEnhancement;
  var leftEnhancement;
  var rightEnhancement;
  ((typeof data.enhancementTop) === 'undefined')? topEnhancement = 0 : topEnhancement = data.enhancementTop;
  ((typeof data.enhancementBottom) === 'undefined')? botEnhancement = 0 : botEnhancement = data.enhancementBottom;
  ((typeof data.enhancementLeft) === 'undefined')? leftEnhancement = 0 : leftEnhancement = data.enhancementLeft;
  ((typeof data.enhancementRight) === 'undefined')? rightEnhancement = 0 : rightEnhancement = data.enhancementRight;
  var unscaled = {
    width: width,
    height: height,
    diameter: diameter,
    radius: radius,
    depth: depth,
    length: get_length(radius),
    topEnhancement: topEnhancement,
    botEnhancement: botEnhancement,
    leftEnhancement: leftEnhancement,
    rightEnhancement: rightEnhancement
  }
  var info = {input: unscaled};
  // declaring function variables
  var x;
  var y;
  var shortest;
  var maxWidth;
  var maxHeight;
  var longest_side;
  var max_length;
  var scalar;
  var rectMoveX;
  var rectMoveY;
  var circNum;
  var circStep;
  var circStepMinRes;
  var circStepMaxRes;
  var circStepRes;
  var minRes;
  var heightCircNum;
  var heightCircStep;
  var widthCircNum;
  var widthCircStep;
  var wasteInfo
  //----------------------
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  const canvasWidth = parseFloat(getComputedStyle(c).width);
  const canvasHeight = parseFloat(getComputedStyle(c).height);
  reset_canvas();
  // if ((width <= 0) || (height <= 0) || (depth <= 0)) {
  //   window.alert("Введите корректные гарабиты проема");
  //   var sides = [];
  //   if (width <= 0) 
  //     sides.push("width");
  //   if (height <= 0)
  //     sides.push("height");
  //   if (depth <= 0)
  //     sides.push("depth");
  //   sides.forEach((side) => {curINPUT.getElementsByTagName("input")[side].classList.add("highlight");});
  //   setTimeout(function() {
  //     sides.forEach((side) => {curINPUT.getElementsByTagName("input")[side].classList.remove("highlight")});
  //   }, 4000);
  //   error = true;
  // }
  // var enhancement = curINPUT.getElementsByTagName("select")["job-type"].value == "enhancement";
  // waste calculation variables
  var vertHoles = [];
  var horHoles = [];
  var horSepHoles = [];
  var vertSepHoles = [];
  // var baseCoringArea = 0;
  // var externalCoringArea = 0;
  // var restArea = 0;
  // var totalArea = (topEnhancement + height + botEnhancement) * (leftEnhancement + width + rightEnhancement);
  // var totalWeight = 0; // totalArea + externalCoringArea
  // var restWeight = 0;
  // ---------------------------
  switch (serviceName) {
      case 'enhancementCoring': 
        totalArea -= height * width;
        scale_enhancement_input();
        var length = get_length(radius);
        var limit = 30*scalar - radius + length;
        if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
            window.alert("Введите значение для расширения проема хотя бы в одном из направлений");
            error = true;
        }
        else {
          if      ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement > 0) && ((leftEnhancement + width > diameter) || (rightEnhancement + width > diameter)) && ((topEnhancement + height > diameter) || (botEnhancement + height > diameter))) {
            rectMoveX = (canvasWidth - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
            rectMoveY = (canvasHeight - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
            var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY + height/2 + botEnhancement - length,
                [-rightEnhancement - width - leftEnhancement + 2*length, 0, leftEnhancement + width + rightEnhancement - 2*length, 0],
                [0, -botEnhancement - height - topEnhancement + 2*length, 0, topEnhancement + height + botEnhancement - 2*length]);
            fill_enhancement_rectangle("top-bot-left-right-enhancement");
            fill_rectangle("rgb(223,222,227)");
            circlesByPath(path);
            holesNum--;
            draw_polyline("top-bot-left-right-enhancement");
            //waste calc
            //getArea();
            console.log('vertHoles')
            console.log(vertHoles)
            console.log('horHoles')
            console.log(horHoles)
            vertHoles.map(hole =>{
              baseCoringArea += (hole.circNum * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
              console.log('baseCoringArea: ' + baseCoringArea)
              externalCoringArea += hole.circNum * hole.topSegmentArea;
              if (hole.rowDistance === 'short') 
                externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
            });
            horHoles.map(hole => {
              baseCoringArea += (hole.circNum - 2) * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea; //pure coring weight
              console.log('baseCoringArea: ' + baseCoringArea)
              externalCoringArea += hole.circNum * hole.topSegmentArea;
              if (hole.rowDistance === 'short') 
                externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
            });
            restArea = totalArea - baseCoringArea + externalCoringArea;
            restWeight = restArea * 0.000001 * depth * 0.001 * concreteWeight;
            console.log('restWeight: ' + restWeight);
            if (restWeight > 1.02*wasteWeight) {
              let partsQty = Math.ceil(restWeight/wasteWeight);
              console.log('parts QTY: ' + partsQty)
              var embrasureAreaPercent = 100*(width*height/scalar/scalar)/restArea;
              console.log('R/S: ' + embrasureAreaPercent)
              if (embrasureAreaPercent < 10) { //?
                var calc_width = (leftEnhancement + width + rightEnhancement - diameter - 2*length)/scalar;
                var calc_height = (topEnhancement + height + botEnhancement - diameter - 2*length)/scalar;
                var minSide = Math.min(calc_width, calc_height);
                var maxSide = Math.max(calc_width, calc_height);
                var k = 0;
                var minDistance = minSide*(partsQty-1)/(k+1) + maxSide*k;
                do {  
                  k ++;
                  var newDistance = minSide*(partsQty-1)/(k+1) + maxSide*k;
                  console.log('N.D./O.D: ' + newDistance + ' / ' + minDistance);
                  if (newDistance<minDistance)  
                    minDistance = newDistance
                } while (minDistance == newDistance)
              }
              //if (restArea/(width*height))
              //----------------------------
              // var enhancementSum = topEnhancement + botEnhancement + leftEnhancement + rightEnhancement;
              // var shortest = Math.min((topEnhancement + botEnhancement), (leftEnhancement + rightEnhancement))
              // switch (shortest) {
              //   case topEnhancement + botEnhancement:
              //     if (((topEnhancement + botEnhancement + height)<leftEnhancement) || ((topEnhancement + botEnhancement + height)<rightEnhancement))
              //       if (rightEnhancement<leftEnhancement) {
              //         if (rightEnhancement+width+leftEnhancement)
              //       }
              //       else {

              //       }
              //     break;
              //   case leftEnhancement + rightEnhancement:
              //     break;
              // }
              // //var longest = Math.max(leftEnhancement/enhancementSum, + rightEnhancement/enhancementSum, topEnhancement/enhancementSum, botEnhancement/enhancementSum);
              // switch (partsQty) {
              //   case 2: 

              // }
            }
          }
          else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          // completed
              rectMoveX = canvasWidth/2;
              rectMoveY = canvasHeight/2 + topEnhancement/2;
              fill_rectangle("rgb(223,222,227)");
              drawTopEnhancement(rectMoveX, rectMoveY);
              console.log('length: ' + length/scalar)
          }
          else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
            rectMoveX = canvasWidth/2;
            rectMoveY = (canvasHeight - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
            fill_rectangle("rgb(223,222,227)");
            drawTopEnhancement(rectMoveX, rectMoveY);
            drawBotEnhancement(rectMoveX, rectMoveY);
          }
          else if ((topEnhancement > 0) && (botEnhancement > 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
            // completed
                rectMoveY = (canvasWidth - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
                rectMoveX = canvasHeight/2 + leftEnhancement/2;
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
                    else if ((diameter >= topEnhancement - limit) && (diameter < botEnhancement - limit)) {
                      var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 + length,
                          [0, -width - leftEnhancement + 2*length, 0, leftEnhancement + width - 2*length],
                          [botEnhancement - 2*length, 0, -botEnhancement - height - topEnhancement + 2*length, 0]);
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
                    else
                      errorAlert();
                    draw_polyline("top-bot-left-enhancement");
                }
                else 
                    errorAlert();
            }
          else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
            //completed
                rectMoveX = canvasWidth/2 + leftEnhancement/2;
                rectMoveY = canvasHeight/2 + topEnhancement/2;
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
              rectMoveX = canvasWidth/2 - rightEnhancement/2;
              rectMoveY = canvasHeight/2 + topEnhancement/2;
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
          else if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
            //completed
                rectMoveX = (canvasWidth - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
                rectMoveY = canvasHeight/2 + topEnhancement/2;
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
              rectMoveY = (canvasWidth - botEnhancement - topEnhancement - height)/2 + topEnhancement + height/2;
              rectMoveX = canvasHeight/2 - rightEnhancement/2;
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
                  else if ((diameter < topEnhancement - limit) && (diameter >= botEnhancement - limit)) {
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
          else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement > 0)) {
            rectMoveX = (canvasWidth - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
            rectMoveY = canvasHeight/2;
            fill_rectangle("rgb(223,222,227)");
            drawLeftEnhancement(rectMoveX, rectMoveY);
            drawRightEnhancement(rectMoveX, rectMoveY);
          }
          else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
          //completed
              rectMoveX = canvasWidth/2;
              rectMoveY = canvasHeight/2 - botEnhancement/2;
              fill_rectangle("rgb(223,222,227)");
              drawBotEnhancement(rectMoveX, rectMoveY);
          }
          else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement > 0) && (rightEnhancement <= 0)) {
          //completed
              rectMoveX = canvasWidth/2 + leftEnhancement/2;
              rectMoveY = canvasHeight/2;
              fill_rectangle("rgb(223,222,227)");
              drawLeftEnhancement(rectMoveX, rectMoveY);
          }
          else if ((topEnhancement <= 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          //completed
              rectMoveX = canvasWidth/2 - rightEnhancement/2;
              rectMoveY = canvasHeight/2;
              fill_rectangle("rgb(223,222,227)");
              drawRightEnhancement(rectMoveX, rectMoveY);
          }
          else if ((topEnhancement <= 0) && (botEnhancement > 0) && (leftEnhancement <= 0) && (rightEnhancement > 0)) {
          // completed
              rectMoveX = canvasWidth/2 - rightEnhancement/2;
              rectMoveY = canvasHeight/2 - botEnhancement/2;
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
              rectMoveX = canvasWidth/2 + leftEnhancement/2;
              rectMoveY = canvasHeight/2 - botEnhancement/2;
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
              rectMoveX = (canvasWidth - leftEnhancement - width - rightEnhancement)/2 + leftEnhancement + width/2;
              rectMoveY = canvasHeight/2 - botEnhancement/2;
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
          //else if
          else
            errorAlert();
        }
        draw_rectangle(width, height, "standart");

      break;
      case 'newCoring':
          scale_input();
          var length = get_length(radius);
          rectMoveX = canvasWidth/2;
          rectMoveY = canvasHeight/2;
          if ((width>diameter)&&(height>diameter)) {
            var path = new Path(rectMoveX + width/2 - length, rectMoveY + height/2 - length,
                [- width + 2*length, 0, width - 2*length, 0],
                [0, - height + 2*length, 0, height - 2*length]);
            fill_rectangle("rgb(223,222,227)");
            circlesByPath(path);
            holesNum--;
            // info = {...info,
            //   mainHolesNum: holesNum
            // }
            //-----
            //waste calc
            info = {...info, ...sepStandart(), mainHolesNum: holesNum};
            //-----
            }
          else if ((width<=diameter)&&(height<=diameter)) {
              fill_circle(rectMoveX, rectMoveY, radius);
              draw_circle(rectMoveX, rectMoveY, radius);
              info = {...info, ...sepStandart(), mainHolesNum: holesNum}; //incorrect wasteWeight
          }
          else if ((width>diameter)&&(height<=diameter)) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY,
                  [- width + 2*length],
                  [0]);
              fill_rectangle("rgb(223,222,227)");
              circlesByPath(path);
              info = {...info, ...sepStandart(), mainHolesNum: holesNum}; //incorrect wasteWeight
          }
          else if ((width<=diameter)&&(height>diameter)) {
              var path = new Path(rectMoveX, rectMoveY + height/2 - length,
                  [0],
                  [- height + 2*length]);
              fill_rectangle("rgb(223,222,227)");
              circlesByPath(path);
              info = {...info, ...sepStandart(), mainHolesNum: holesNum}; //incorrect wasteWeight
          }
          draw_rectangle(width, height, "standart");
      break;
  }
  //------
  // else if (!error) {
  //   rectMoveX = 250;
  //   rectMoveY = 250;
  //   var saw = curINPUT.getElementsByTagName("i")["disk"].classList.contains("fas");
  //   var wire = curINPUT.getElementsByTagName("select")["job-type"].value == "wire-saw";
  //   scale_input();
  //   fill_rectangle("rgb(243,255,253)");
  //   length = get_length(radius);
  //   new_width = width/2-length;
  //   new_height = height/2-length;
  //   if (saw) {
  //     if ((width/scalar < 1000) && (height/scalar <1000)) {
  //       window.alert("Использование стенорезной машины целесообразно если ширина и (или) высота проема больше 1 метра. Проем размером " + curINPUT.getElementsByTagName("input")["width"].value + " x " + curINPUT.getElementsByTagName("input")["height"].value + " выполняется методом алмазного бурения. Скорректируйте исходные данные для выбора стенорезной машины");
  //       switchCircle (curINPUT.querySelector(".disk .far"));
  //       switchCircle (curINPUT.querySelector(".bit .far"));
  //     }
  //     else {
  //       if (depth <= 350) {
  //         fillAllCorners();
  //         drawAllCorners();
  //       }
  //       else if ((depth > 350) && (depth < 400)) {
  //         fillAllCorners();
  //         let heightCircNum = get_circNum(height).circNum;
  //         let heightCircStep = get_circNum(height).circStep;
  //         holesDistVert = heightCircStep/scalar;
  //         holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
  //         let widthCircNum = get_circNum(width).circNum;
  //         let widthCircStep = get_circNum(width).circStep;
  //         holesDistHor = widthCircStep/scalar;
  //         holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
  //         drawCircles (2, heightCircStep, 2, widthCircStep, 1, "standart");
  //         drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-1, "standart");
  //         drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-1, "standart");
  //         drawAllCorners();
  //       }
  //       else if ((depth >= 400) && (depth <= 530)) {
  //         fillAllCorners();
  //         let heightCircNum = get_circNum(height).circNum;
  //         let heightCircStep = get_circNum(height).circStep;
  //         holesDistVert = heightCircStep/scalar;
  //         holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
  //         let widthCircNum = get_circNum(width).circNum;
  //         let widthCircStep = get_circNum(width).circStep;
  //         holesDistHor = widthCircStep/scalar;
  //         holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
  //         drawCircles (3, heightCircStep, 3, widthCircStep, 1, "standart");
  //         drawCircles (0, 0, widthCircNum, widthCircStep, widthCircNum-2, "standart");
  //         drawCircles (heightCircNum, heightCircStep, 0, 0, heightCircNum-2, "standart");
  //         drawAllCorners();
  //       }
  //       else if (depth > 530) {
  //         window.alert("Максимальная толщина конструкции при использовании стенорезной машины составляет 530 мм. При большей толщине рекомендуем воспользоваться канатной резкой.");
  //         $(inputId).addClass("higlight");
  //         setTimeout(function() {
  //           enhancementSides.forEach((inputId) => {$(inputId).removeClass("higlight")});
  //         }, 4000);
  //         error = true;
  //       }
  //     }
  //   }
  //   else if (wire) {
  //     console.log(wire);
  //   }
  //   else {
  //     if ((width>diameter)&&(height>diameter)) {
  //       fillAllCorners();
  //       let heightCircNum = get_circNum(height, length, length).circNum;
  //       let heightCircStep = get_circNum(height, length, length).circStep;
  //       holesDistVert = heightCircStep/scalar;
  //       holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
  //       let widthCircNum = get_circNum(width, length, length).circNum;
  //       let widthCircStep = get_circNum(width, length, length).circStep;
  //       holesDistHor = widthCircStep/scalar;
  //       holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
  //       drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "standart");
  //       drawAllCorners();
  //     }
  //     else if ((width<=diameter)&&(height<=diameter)) {
  //       fill_circle(rectMoveX, rectMoveY, radius);
  //       draw_circle(rectMoveX, rectMoveY, radius);
  //     }
  //     else if ((width>diameter)&&(height<=diameter)) {
  //       x = rectMoveX - (new_width);
  //       fill_circle(x, rectMoveY, radius);
  //       x = rectMoveX + (new_width);
  //       fill_circle(x, rectMoveY, radius);
  //       let widthCircNum = get_circNum(width).circNum;
  //       let widthCircStep = get_circNum(width).circStep;
  //       holesDistHor = widthCircStep/scalar;
  //       holesDistHor = Math.trunc(widthCircStep/scalar) + holesDistHor.toString().slice(holesDistHor.toString().indexOf("."), (holesDistHor.toString().indexOf(".")+3));
  //       for (let i=1; i<widthCircNum; i++) {
  //         x = rectMoveX - (new_width) + widthCircStep*i;
  //         fill_circle(x, rectMoveY, radius);
  //       }
  //       for (let i=1; i<widthCircNum; i++) {
  //         x = rectMoveX - (new_width) + widthCircStep*i;
  //         draw_circle(x, rectMoveY, radius);
  //       }
  //       x = rectMoveX - (new_width);
  //       draw_circle(x, rectMoveY, radius);
  //       x = rectMoveX + (new_width);
  //       draw_circle(x, rectMoveY, radius);
  //     }
  //     else if ((width<=diameter)&&(height>diameter)) {
  //       x = rectMoveX;
  //       y = rectMoveY - (new_height);
  //       fill_circle(x, y, radius);
  //       x = rectMoveX;
  //       y = rectMoveY + (new_height);
  //       fill_circle(x, y, radius);
  //       var heightCircNum = get_circNum(height).circNum;
  //       var heightCircStep = get_circNum(height).circStep;
  //       holesDistVert = heightCircStep/scalar;
  //       holesDistVert = Math.trunc(heightCircStep/scalar) + holesDistVert.toString().slice(holesDistVert.toString().indexOf("."), (holesDistVert.toString().indexOf(".")+3));
  //       for (let i=1; i<heightCircNum; i++) {
  //         y = 250 - (new_height) + heightCircStep*i;
  //         fill_circle(rectMoveX, y, radius);
  //       }
  //       for (let i=1; i<heightCircNum; i++) {
  //         y = rectMoveY - (new_height) + heightCircStep*i;
  //         draw_circle(rectMoveX, y, radius);
  //       }
  //       y = rectMoveY - (new_height);
  //       draw_circle(rectMoveX, y, radius);
  //       y = rectMoveY + (new_height);
  //       draw_circle(rectMoveX, y, radius);
  //     }
  //   }
  //   draw_rectangle(width, height, "standart");
  // }
  // TBD
  if (!error)
    c.style.background="#BFBDC7";
  else
    c.style.background="#f3fffd";
  console.log('returning from canvas:')
  console.log(info)
  return info;
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
    console.log("FILL!!!")
    //ctx.beginPath();
    let path = new Path2D();
    path.arc(x, y, radius, 0, 2 * Math.PI);
    //ctx.arc(x, y, radius, 0, 2 * Math.PI);
    //ctx.ellipse(x, y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(243,255,253)";
    ctx.fill(path);
  }
  function draw_circle(x, y, radius, mode) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(16,56,125)";
    ctx.stroke();
    holesNum++;
  }
  function get_length(radius) {
    length = Math.cos(45 * Math.PI / 180) * radius;
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

  // function Unscaled(xStart, yStart, x, y, skipX, skipY) {
  //   this.xStart = xStart;
  //   this.yStart = yStart;
  //   this.x = x;
  //   this.y = y;
  // }
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
        // waste calculation 
        if (heightCircNum === 0) 
          horHoles.push({name: 'horHoles', circNum: widthCircNum+1, circStep: widthCircStep/scalar});
        if (widthCircNum === 0) 
          vertHoles.push({name: 'vertHoles', circNum: heightCircNum+1, circStep: heightCircStep/scalar});
        // -------------------
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
      console.log(holesDist)
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
      // curINPUT.getElementsByTagName("select")["diameter"].classList.add("highlight");
      // setTimeout(function() {
      //   curINPUT.getElementsByTagName("select")["diameter"].classList.remove("highlight");
      // }, 3000);
      // error = true;
      // fill_rectangle("rgb(243,255,253)");
      // var enhancementSides = ["enhancement-top", "enhancement-bot", "enhancement-left", "enhancement-right"];
      // var sides = [];
      // enhancementSides.forEach((inputId) => {
      //   if (curINPUT.getElementsByTagName("input")[inputId].value > 0)
      //     sides.push(curINPUT.getElementsByTagName("input")[inputId].value);
      // });
      // var minSide = sides[0];
      // for (let i=1; i<sides.length; i++) {
      //   if (sides[i]*1<minSide)
      //     minSide = sides[i];
      // } 
      // var diameters = curINPUT.querySelector("select");
      // var dif = minSide;
      // var diameterSelected = "";
      // for (let i=0; (i<diameters.childElementCount); i++) {
      //   let difValue = Math.abs(diameters.children[i].value-minSide);
      //   if (difValue < dif) {
      //     dif = difValue;
      //     diameterSelected = i;
      //   }
      // }
      // curINPUT.getElementsByTagName("select")["diameter"].options.selectedIndex = diameterSelected;
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
  // waste section
  function calc_topSegmentArea(unscaled) {
    let angle = 2 * Math.acos(unscaled.length/unscaled.radius);
    return 0.5 * (angle - Math.sin(angle)) * unscaled.radius * unscaled.radius;
  }
  function get_waste_basic_info (holesRow) {
    holesRow.map((row, index) => {
      var middleSectorAngel = 2*Math.acos((row.circStep/2)/unscaled.radius); //rad
      var middleSegmentArea = (0.5 * (middleSectorAngel - Math.sin(middleSectorAngel)) * unscaled.radius * unscaled.radius); // 1/2
      var rowDistance;
      if (row.circStep/unscaled.radius > 1.41421357) {
        rowDistance = 'long';
        var externalCoringOverLengthArea = 0;
      }
      else if (row.circStep/unscaled.radius == 1.41421357) {
        rowDistance = 'perfect';
        var externalCoringOverLengthArea = 0;
      }
      else if (row.circStep/unscaled.radius < 1.41421357) {
        rowDistance = 'short';
        var externalCoringOverLengthArea = get_externalCoringOverLengthArea(row);
      }
      holesRow[index] = {
        name: row.name+index,
        circStep: row.circStep,
        circNum: row.circNum,
        topSegmentArea: calc_topSegmentArea(unscaled),
        middleSegmentArea: middleSegmentArea,
        rowDistance: rowDistance,
        externalCoringOverLengthArea: externalCoringOverLengthArea
      }
    } );
  }
  function get_externalCoringOverLengthArea(row) {
    let heightToCircIntersection = Math.sqrt(unscaled.radius*unscaled.radius-row.circStep*row.circStep/4);
    let hypotenuseAngle = (Math.asin(heightToCircIntersection/unscaled.radius)-Math.asin((length/scalar)/unscaled.radius));
    let hypotenuse = unscaled.radius * hypotenuseAngle;
    let intersectionHeight = heightToCircIntersection - length/scalar;
    let side = Math.sqrt(hypotenuse * hypotenuse - intersectionHeight * intersectionHeight);
    return side * intersectionHeight;
  }
  function get_coringArea() {
    var totalArea = (unscaled.topEnhancement + unscaled.height + unscaled.botEnhancement) * (unscaled.leftEnhancement + unscaled.width + unscaled.rightEnhancement)
    var baseCoringArea = 0;
    var externalCoringArea = 0;
    if ((vertHoles.length > 0) && (horHoles.length > 0)) {
      vertHoles.map(hole =>{
        baseCoringArea += (hole.circNum * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        externalCoringArea += hole.circNum * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
      horHoles.map(hole => {
        baseCoringArea += (hole.circNum - 2) * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea; //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        externalCoringArea += hole.circNum * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
    }
    else if ((vertHoles.length === 0) && (horHoles.length > 0)) {
      horHoles.map(hole =>{
        baseCoringArea += (hole.circNum * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        let k;
        (serviceName === 'newCoring') ? k = 2: k = 1;
        externalCoringArea += (k * hole.circNum + 2) * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (k * hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
    }
    else if ((vertHoles.length > 0) && (horHoles.length === 0)) {
      vertHoles.map(hole =>{
        baseCoringArea += (hole.circNum * Math.PI * unscaled.radius * unscaled.radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        let k;
        (serviceName === 'newCoring') ? k = 2: k = 1;
        externalCoringArea += (k * hole.circNum + 2) * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (k * hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
    }
    return {
      totalWeight: (totalArea + externalCoringArea) * depth * 0.000000001 * concreteWeight,
      restArea: totalArea - baseCoringArea + externalCoringArea,
    }
  }
  function get_sepCircNum(sideLength, diameter, acceptableDelta) { // takes total distance to cover, delta = min acceptable distance between circles
    //console.log('acceptableDelta: ' + acceptableDelta)
    if (sideLength <= 0)
      //window.alert('length<0')
      console.log('get_sepCircNum input: ' + sideLength + ', ' + diameter + ', ' + acceptableDelta) 
    if (sideLength > diameter) {
      var circNum = Math.ceil(sideLength/diameter);
      let delta = (sideLength - diameter * (circNum-1))/(circNum-1);
      //console.log('circNum calculated: ' + circNum + ', multiplied by diameter: ' + circNum * diameter + ', sideLenght: ' + sideLength + ', dif: ' + (circNum * diameter - sideLength) + ', between: ' + delta, (delta < acceptableDelta))
      if ((delta < acceptableDelta) && (circNum > 1)) {
        console.log("delta: " + delta + ', acceptabledeta: ' + acceptableDelta)
        circNum --;
        console.log('circNum reduced')
      }
      if (circNum > 1) {
        circStep = (sideLength - diameter)/(circNum - 1);
      } else {
        circStep = 0
      }
    } else {
      circStep = 0;
      circNum = 1;
    }
    if (circStep == Infinity) {
      window.alert('warning circStep = INFINITY')
      console.log('returning circNum: ' + circNum);
      console.log('returning circStep: ' + circStep);
    }
    return {
      circStep: circStep,
      circNum: circNum
    };
  }
  function calc_wasteQty(partsQty, minSide, maxSide) { // operates unscaled values
    let shortCut = partsQty-1;
    let longCut = 0;
    let longCounter = 0;
    let minDistance = minSide*shortCut;
    do {  
      let shortCounter = partsQty - 1 - longCounter;
      do {
        var newDistance = shortCounter * minSide + maxSide * longCounter; //try delete (unscaled.diameter * longCounter)
        if (newDistance < minDistance && minDistance > 0) {
          // console.log('longCounter, shortCounter: [' + longCounter + ', ' + shortCounter + ']');
          // console.log('prev Dist: ' + minDistance);
          // console.log('newDist: ' + newDistance);
          minDistance = newDistance;
          longCut = longCounter;
          shortCut = shortCounter;
        } 
        shortCounter--
      } while ((shortCounter + 1)*(longCounter + 1) >= partsQty)
      longCounter ++;
    } while ((longCounter<partsQty-2));
    console.log('longCut, shortCut: [' + longCut + ', ' + shortCut + ']');
    console.log('minDistance: ' + minDistance);
    // let longHolesNum = get_sepCircNum(maxSide - 2 * unscaled.length, unscaled.diameter, 10).circNum*longCut;
    // let shortHolesNum = (longCut+1) * shortCut * get_sepCircNum((minSide-(longCut+1)*unscaled.diameter)/(longCut+1), unscaled.diameter, 10).circNum;
    
    let delta = 5;
    console.log('delta: ' + delta)
    if (unscaled.width > unscaled.height) {
      var longSideName = "horHoles";
      var shortSideName = "vertHoles";
    } else {
      var longSideName = "vertHoles";
      var shortSideName = "horHoles";
    }
    if (longCut > 0) {
      // long case
      var longCutResult
      let longHoles = new Array(longCut);
      for (let index = 0; index < longHoles.length; index++) {
        longHoles[index] = 
        {
          name: longSideName,
          circNum: get_sepCircNum(maxSide, unscaled.diameter, delta).circNum,
          circStep: get_sepCircNum(maxSide, unscaled.diameter, delta).circStep
        }
      }
      let shortHoles = new Array(shortCut * (longCut + 1));
      for (let index = 0; index < shortHoles.length; index += longCut+1) {
        for (let i = 0; i < longCut+1; i++) {
          // if ((minSide - longCut * unscaled.diameter) <= 0) {
          //   console.log('WARNING!!!');
          //   console.log('minSide: ' + minSide);
          //   console.log('longCut: ' + longCut);
          //   console.log('unscld Diam: ' + unscaled.diameter);
          // }


          shortHoles[index + i] = 
          {
            name: shortSideName,
            circNum: get_sepCircNum((minSide - longCut * unscaled.diameter)/(longCut+1), unscaled.diameter, delta).circNum,
            circStep: get_sepCircNum((minSide - longCut * unscaled.diameter)/(longCut+1), unscaled.diameter, delta).circStep
          }
        }
      }
      console.log(shortHoles)
      longCutResult = {shortHoles: shortHoles, longHoles: longHoles}; // result for long case
      // short case
      var shortCutResult;
      shortHoles = new Array(shortCut);
      for (let index = 0; index < shortHoles.length; index++) {
        shortHoles[index] = 
        {
          name: shortSideName,
          circNum: get_sepCircNum(minSide, unscaled.diameter, delta).circNum,
          circStep: get_sepCircNum(minSide, unscaled.diameter, delta).circStep
        }
      }
      longHoles = new Array(longCut * (shortCut + 1));
      for (let index = 0; index < longHoles.length; index += shortCut+1) {
        for (let i = 0; i < shortCut+1; i++) {
            longHoles[index + i] = 
            {
              name: longSideName,
              circNum: get_sepCircNum((maxSide - shortCut * unscaled.diameter)/(shortCut+1), unscaled.diameter, delta).circNum,
              circStep: get_sepCircNum((maxSide - shortCut * unscaled.diameter)/(shortCut+1), unscaled.diameter, delta).circStep
            }
        }
      }
      shortCutResult = {shortHoles: shortHoles, longHoles: longHoles}; // result for short case
    } else {
      var shortHoles = new Array(shortCut);
      for (let index = 0; index < shortHoles.length; index++) {
        shortHoles[index] = 
        {
          name: shortSideName,
          circNum: get_sepCircNum(minSide, unscaled.diameter, delta).circNum,
          circStep: get_sepCircNum(minSide, unscaled.diameter, delta).circStep
        }
      }

      var longHoles = 0; // typeof Array?
    }
    var bestResult = {};
    if (typeof(longHoles) === 'undefined') { // two results available
      let longCaseLongCutCircNum = 0;
      let longCaseShortCutCircNum = 0;
      longCutResult.shortHoles.map(row => longCaseShortCutCircNum += row.circNum);
      longCutResult.longHoles.map(row => longCaseLongCutCircNum += row.circNum);
      let shortCaseLongCutCircNum = 0;
      let shortCaseShortCutCircNum = 0;
      shortCutResult.shortHoles.map(row => shortCaseShortCutCircNum += row.circNum);
      shortCutResult.longHoles.map(row => shortCaseLongCutCircNum += row.circNum);
      ((longCaseLongCutCircNum + longCaseShortCutCircNum) <= (shortCaseLongCutCircNum + shortCaseShortCutCircNum)) ? bestResult = {...longCutResult, longHolesNum: longCaseLongCutCircNum, shortHolesNum: longCaseShortCutCircNum} : bestResult = {...shortCutResult, longHolesNum: shortCaseLongCutCircNum, shortHolesNum: shortCaseShortCutCircNum};
    } else { // only shortCuts
      let shortHolesNum = 0;
      shortHoles.map(row => shortHolesNum += row.circNum)
      bestResult = {shortHoles: shortHoles, longHoles: [], longHolesNum: 0, shortHolesNum: shortHolesNum}
    }
    // let shortCaseShortHolesNumSum = 0
    // shortCutResult.map(row => shortCaseShortHolesNumSum += row.circNum)
    // let longCaseShortHolesNumSum = 0
    // longCutResult.map(row => longCaseShortHolesNumSum += row.circNum)
    //let shortHolesNum = (longCut+1) * shortCut * get_sepCircNum((minSide-(longCut)*unscaled.diameter)/(longCut+1), unscaled.diameter, 3).circNum;
    return {
      partsQty: (longCut + 1) * (shortCut + 1),
      sepHolesNum: bestResult.shortHolesNum + bestResult.longHolesNum,
      longCut: longCut,
      shortCut: shortCut,
      longHolesNum: bestResult.longHolesNum,
      // longHolesStep: get_sepCircNum(maxSide).circStep,
      // shortHolesStep: get_sepCircNum((minSide-longCut*diameter)/(longCut+1)).circStep,
      shortHolesNum: bestResult.shortHolesNum,
      bestResult: bestResult
    };
  }
  function separate(wasteCuts, minSide, maxSide, mode) {
    var minSide = minSide*scalar;
    var maxSide = maxSide*scalar;
    var deltaMinSide = (minSide - wasteCuts.longCut*diameter)/(wasteCuts.longCut+1) + diameter; 
    var deltaMaxSide = (maxSide - wasteCuts.shortCut*diameter)/(wasteCuts.shortCut+1) + diameter;
    let shortHoles = wasteCuts.bestResult.shortHoles;
    let longHoles = wasteCuts.bestResult.longHoles;
    console.log('longHoles:')        
    console.log(longHoles)      
    console.log('shortHoles')  
    console.log(shortHoles)        

      if (shortHoles.length > longHoles.length && longHoles.length > 0) { //longside is solid
        console.log('SOLID LONG SIDE'); 
        for (let i = 0; i < longHoles.length; i++) { // draw long side
          if (longHoles[i].name.toString().startsWith('vert')) { //height >= width
            let xStart = rectMoveX + width/2 - length - (i+1)*deltaMinSide;
            let yStart = rectMoveY + height/2 - length - diameter;
            for (let j = 0; j < longHoles[i].circNum; j++) {
              if (mode === 'draw') {
                draw_circle(xStart, yStart - j * longHoles[i].circStep*scalar, radius)
              } else if (mode === 'fill'){
                fill_circle(xStart, yStart - j * longHoles[i].circStep*scalar, radius)
              }
            }
          } else { // width > height
            let xStart = rectMoveX + width/2 - length - diameter;
            let yStart = rectMoveY + height/2 - length - (i+1)*deltaMinSide;
            for (let j = 0; j < longHoles[i].circNum; j++) {
              if (mode === 'draw') {
                draw_circle(xStart - j * longHoles[i].circStep*scalar, yStart, radius)
              } else if (mode === 'fill'){
                fill_circle(xStart - j * longHoles[i].circStep*scalar, yStart, radius)
              }
            }
          }
        } 
        // draw short side
        if (shortHoles[0].name.toString().startsWith('hor')) { //height > width
          for (let i = 0; i < wasteCuts.shortCut; i++) {
            let xStart = rectMoveX - width/2 + length + diameter;
            let yStart = rectMoveY + height/2 - length - (i+1)*deltaMaxSide;
            for (let j = 0; j < wasteCuts.longCut+1; j++) {
              for (let k = 0; k < shortHoles[i * (wasteCuts.longCut+1) + j].circNum; k++) {
                if (shortHoles[i * (wasteCuts.longCut+1) + j].circNum > 1) { //multi hole case
                  if (mode === 'draw') {
                    draw_circle(xStart + k * shortHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, yStart , radius)
                  } else if (mode === 'fill'){
                    fill_circle(xStart + k * shortHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, yStart , radius)
                  }
                } 
                else { //single hole case
                  if (mode === 'draw') {
                    draw_circle(xStart-diameter + deltaMinSide/(k+2), yStart , radius)
                  } else if (mode === 'fill'){
                    fill_circle(xStart-diameter + deltaMinSide/(k+2), yStart , radius)
                  }
                }
              }
              xStart += deltaMinSide;
            }
          }
        } else { // width >= height
          for (let i = 0; i < wasteCuts.shortCut; i++) {
            let xStart = rectMoveX - width/2 + length + (i+1)*deltaMaxSide;
            let yStart = rectMoveY + height/2 - length - diameter;
            for (let j = 0; j < wasteCuts.longCut+1; j++) {
              for (let k = 0; k < shortHoles[i * (wasteCuts.longCut+1) + j].circNum; k++) {
                console.log('k: ' + k)
                if (shortHoles[i * (wasteCuts.longCut+1) + j].circNum > 1) { //multi hole case
                  if (mode === 'draw') {
                    draw_circle(xStart, yStart - k * shortHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, radius)
                  } else if (mode === 'fill'){
                    fill_circle(xStart, yStart - k * shortHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, radius)
                  }
                } else {  //single hole case
                  if (mode === 'draw') {
                    draw_circle(xStart, yStart + diameter - deltaMinSide/(k+2), radius);
                  } else if (mode === 'fill'){
                    fill_circle(xStart, yStart + diameter - deltaMinSide/(k+2), radius);
                  }
                }
              }
              yStart -= deltaMinSide;
            }
          }
        }
      } else {//shrotSide is solid [shortHoles.length <= longHoles.length] completed
        console.log('SOLID SHORT SIDE');
        for (let i = 0; i < shortHoles.length; i++) { // draw solid circles
          if (shortHoles[i].name.toString().startsWith('hor')) { //height > width
            if (shortHoles[i].circStep === 0) { //single hole
              console.log('SINGLE HOLE')
              var xStart = rectMoveX;
              var yStart = rectMoveY - height/2 + length + (i+1)*deltaMaxSide;
            } else { // multi holes
              var xStart = rectMoveX - width/2 + length + diameter;
              var yStart = rectMoveY - height/2 + length + (i+1)*deltaMaxSide;
            }
            for (let j = 0; j < shortHoles[i].circNum; j++) {
              if (mode === 'draw') {
                draw_circle(xStart + j * shortHoles[i].circStep*scalar, yStart, radius)
              } else if (mode === 'fill'){
                fill_circle(xStart + j * shortHoles[i].circStep*scalar, yStart, radius)
              }
            }
          } else { // width >= height
            if (shortHoles[i].circStep === 0) { //single hole
              var xStart = rectMoveX - width/2 + length + (i+1)*deltaMaxSide;
              var yStart = rectMoveY; 
            } else { // multi holes
              var xStart = rectMoveX - width/2 + length + (i+1)*deltaMaxSide;
              var yStart = rectMoveY - height/2 + length + diameter;
            }
            for (let j = 0; j < shortHoles[i].circNum; j++) {
              if (mode === 'draw') {
                draw_circle(xStart, yStart + j * shortHoles[i].circStep*scalar, radius)
              } else if (mode === 'fill'){
                fill_circle(xStart, yStart + j * shortHoles[i].circStep*scalar, radius)
              }
            }
          }
        } 
        // draw separated circles
        if (longHoles.length > 0) {
          if (longHoles[0].name.toString().startsWith('vert')) { //height > width
            console.log('VERT!!!');
            for (let i = 0; i < wasteCuts.longCut; i++) {
              let xStart = rectMoveX - width/2 + length + (i+1)*deltaMinSide;
              let yStart;
              if (longHoles[i].circStep === 0)
                yStart = rectMoveY - height/2 + length + deltaMaxSide/2;
              else
                yStart = rectMoveY - height/2 + length + diameter;
              for (let j = 0; j < wasteCuts.shortCut+1; j++) {
                for (let k = 0; k < longHoles[i * (wasteCuts.longCut+1) + j].circNum; k++) {
                  if (mode === 'draw') {
                    draw_circle(xStart, yStart + k * longHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, radius)
                  } else if (mode === 'fill'){
                    fill_circle(xStart, yStart + k * longHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, radius)
                  }
                }
                yStart += deltaMaxSide;
              }
            }
          } else { // width >= height
            console.log('HOR!!!');
            for (let i = 0; i < wasteCuts.longCut; i++) {
              let xStart;
              if (longHoles[i].circStep === 0)
                xStart = rectMoveX - width/2 + length + deltaMaxSide/2;
              else
                xStart = rectMoveX - width/2 + length + diameter;   
              let yStart = rectMoveY - height/2 + length + (i+1)*deltaMinSide;
              for (let j = 0; j < wasteCuts.shortCut+1; j++) {
                for (let k = 0; k < longHoles[i * (wasteCuts.longCut+1) + j].circNum; k++) {
                  if (mode === 'draw') {
                    draw_circle(xStart + k * longHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, yStart, radius)
                  } else if (mode === 'fill'){
                    fill_circle(xStart + k * longHoles[i * (wasteCuts.longCut+1) + j].circStep * scalar, yStart, radius)
                  }
                }
                xStart += deltaMaxSide;
              }
            }
          }
        }
      }
  }
  function get_sepWaste_weight(holesRow) {
    holesRow.map((row, index) => {
      var middleSectorAngel;
      var middleSegmentArea = 0;
      if (((row.circStep/2)/unscaled.radius) < 1 && row.circNum > 1) {
        middleSectorAngel = 2*Math.acos((row.circStep/2)/unscaled.radius); //rad
        middleSegmentArea = (0.5 * (middleSectorAngel - Math.sin(middleSectorAngel)) * unscaled.radius * unscaled.radius); // 1/2
      }
      holesRow[index] = {
        name: row.name+index,
        circStep: row.circStep,
        circNum: row.circNum,
        middleSegmentArea: middleSegmentArea,
        weight: (Math.PI * unscaled.radius * unscaled.radius * row.circNum - 2 * middleSegmentArea * (row.circNum - 1)) * depth * 0.000000001 * concreteWeight
      }
    } );
  }
  function sepStandart() {
    get_waste_basic_info(vertHoles); //+
    get_waste_basic_info(horHoles);//+
    var coringArea = get_coringArea();
    var totalWeight = coringArea.totalWeight;
    var restWeight = coringArea.restArea * unscaled.depth * 0.000000001 * concreteWeight;
    let wasteInfo = {
      totalWeight: totalWeight,
      partsQty: 0
    }
    if (restWeight > (1+weightSpread/100)*wasteWeight) {
      let calc_width = (unscaled.leftEnhancement + unscaled.width + unscaled.rightEnhancement - unscaled.diameter - 2*unscaled.length);
      let calc_height = (unscaled.topEnhancement + unscaled.height + unscaled.botEnhancement - unscaled.diameter - 2*unscaled.length);
      let minSide = Math.min(calc_width, calc_height);
      let maxSide = Math.max(calc_width, calc_height);
      let weightToCalc = restWeight;
      let partsQty = Math.ceil(restWeight/wasteWeight);
      console.log('first parts num: '+ partsQty)
      let processing = true;
      let counter = 0;
      let wasteCuts;
      let bestWasteCuts;
      let bestPaths = [];
      let bestRealPartWeight;
      let bestSepHolesNum;
      let real_part_weight;

      do {
        console.log('COUNTER: ' + counter);
        // console.log('new WeightToCalc: ' + weightToCalc)
        // console.log('parts QTY: ' + partsQty)
        wasteCuts = calc_wasteQty(partsQty, minSide, maxSide);
        //console.log('partsQty: ' + partsQty + ' , wasteCuts.partsQty: ' + wasteCuts.partsQty)
        //console.log(wasteCuts) //+
        //console.log(minSide + ' / ' + maxSide)
        // var deltaMinSide = (minSide - wasteCuts.longCut*diameter)/(wasteCuts.longCut+1) + diameter; 
        // var deltaMaxSide = (maxSide - wasteCuts.shortCut*diameter)/(wasteCuts.shortCut+1) + diameter; 
        //console.log(deltaMinSide + ' / ' + deltaMaxSide)
        //length = get_length(radius);
        //let paths = calc_separate(wasteCuts, minSide, maxSide);
        // // console.log(paths)
        get_sepWaste_weight(wasteCuts.bestResult.shortHoles);
        get_sepWaste_weight(wasteCuts.bestResult.longHoles);
        // get_sepWaste_weight(vertSepHoles);
        // get_sepWaste_weight(horSepHoles);
        // console.log('vertSepHoles: ')
        // console.log(vertSepHoles)
        // console.log('horSepHoles: ')
        // console.log(horSepHoles)
        let sepWasteWeight = 0;
        wasteCuts.bestResult.shortHoles.map(row => sepWasteWeight += row.weight);
        wasteCuts.bestResult.longHoles.map(row => sepWasteWeight += row.weight);
        // console.log('restWeight: ' + restWeight);
        // console.log('sepWeight: ' + sepWasteWeight)
        weightToCalc = restWeight - sepWasteWeight;
        // console.log('WeightToCalc: ' + weightToCalc)
        if (weightToCalc < 0) { // need to find bug
          console.log('ERROR');
          // processing = false;
        }
        real_part_weight = weightToCalc/wasteCuts.partsQty;
        console.log('real weight of one part: ' + real_part_weight + ' kg');
        if (real_part_weight <= 1.05 * wasteWeight) {
          if (real_part_weight < 0)
            real_part_weight = 0;
          if (bestSepHolesNum == undefined || bestSepHolesNum >= wasteCuts.sepHolesNum ) {
            // console.log(bestWasteCuts)
            bestWasteCuts = wasteCuts;
            // bestPaths = paths;
            bestRealPartWeight = real_part_weight;
            bestSepHolesNum = wasteCuts.sepHolesNum;
          }
          if ((wasteCuts.partsQty - Math.ceil(weightToCalc/wasteWeight)) < 0) {  // or <=
            processing = false;
            console.log('rejected to proceed, new PartsQty (' + Math.ceil(weightToCalc/wasteWeight) + ') >= (' + wasteCuts.partsQty + ') prev partsQty')
          }
          else {
            partsQty --;
            console.log('accepted to proceed')
            counter++;
          }
        }
        else {
          processing = false;
          console.log('rejected to proceed, parts are too heavy: ' + (real_part_weight > 1.05 * wasteWeight))
        }
      } while (processing === true);
      // diameter = data.diameter*scalar;
      // radius = diameter/2;
      // width = data.width*scalar;
      // height = data.height*scalar;
      // minSide *= scalar;
      // maxSide *= scalar;
      // deltaMinSide *= scalar;
      // deltaMaxSide *= scalar;
      // length *= scalar;

      console.log('bestWasteCuts: ')
      console.log(bestWasteCuts)
      console.log('Best real weight of one part: ' + bestRealPartWeight + ' kg');
      //console.log(bestPaths)
      wasteInfo = {
        ...wasteInfo,
        sepHolesNum: bestWasteCuts.sepHolesNum,
        partsQty: bestWasteCuts.partsQty,
        singlePartWeight: bestRealPartWeight
      }
      separate(bestWasteCuts, minSide, maxSide, 'fill');
      separate(bestWasteCuts, minSide, maxSide, 'draw');
    }
    return wasteInfo;
  }
}
// export function canvas (serviceName, data) {
//     var width = data.width;
//     var height = data.height;
//     var diameter = data.diameter;
//     var depth = data.depth;
//     var radius = diameter/2;
//     var c = document.getElementById("myCanvas");
//     var ctx = c.getContext("2d");
//     var holesNum = 0;
//     // declaring function variables
//     var shortest;
//     var maxWidth;
//     var maxHeight;
//     var longest_side;
//     var max_length;
//     var scalar;
//     var rectMoveX;
//     var rectMoveY;
//     var circNum;
//     var circStep;
//     var circStepMinRes;
//     var circStepMaxRes;
//     var circStepRes;
//     var minRes;
//     var heightCircNum;
//     var heightCircStep;
//     var widthCircNum;
//     var widthCircStep;
//     reset_canvas();
//     switch (serviceName) {
//         case 'newCoring':
//             break;
//         case 'enhancementCoring':
//             var topEnhancement = data.enhancementTop;
//             var botEnhancement = data.enhancementBottom;
//             var leftEnhancement = data.enhancementLeft;
//             var rightEnhancement = data.enhancementRight;
//             scale_enhancement_input();
//             const length = get_length(radius);
//             var limit = 30*scalar - radius + length;
//             if ((topEnhancement > 0) && (botEnhancement <= 0) && (leftEnhancement <= 0) && (rightEnhancement <= 0)) {
//                 // completed
//                 rectMoveX = 250;
//                 rectMoveY = 250 + topEnhancement/2;
//                 fill_rectangle("rgb(223,222,227)");
//                 drawTopEnhancement(rectMoveX, rectMoveY);
//               }
//     }
//     function fill_rectangle(color) {
//         var xUpperLeft = rectMoveX - (width/2);
//         var yUpperLeft = rectMoveY - (height/2);
//         ctx.fillStyle = color;
//         ctx.fillRect(xUpperLeft, yUpperLeft, width, height);
//       }
//     function fill_enhancement_rectangle(mode) {
//         ctx.fillStyle = "rgb(243,255,253)";
//         if (mode == "top-enhancement") {
//         var xUpperLeft = rectMoveX - (width/2);
//         var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
//         ctx.fillRect(xUpperLeft, yUpperLeft, width, topEnhancement);
//         }
//         else if (mode == "bot-enhancement") {
//         var xUpperLeft = rectMoveX - (width/2);
//         var yUpperLeft = rectMoveY + (height/2);
//         ctx.fillRect(xUpperLeft, yUpperLeft, width, botEnhancement);
//         }
//         else if (mode == "left-enhancement") {
//         var xUpperLeft = rectMoveX - (width/2) - leftEnhancement;
//         var yUpperLeft = rectMoveY - (height/2);
//         ctx.fillRect(xUpperLeft, yUpperLeft, leftEnhancement, height);
//         }
//         else if (mode == "right-enhancement") {
//         var xUpperLeft = rectMoveX + (width/2);
//         var yUpperLeft = rectMoveY - (height/2);
//         ctx.fillRect(xUpperLeft, yUpperLeft, rightEnhancement, height);
//         }
//         else if (mode == "top-left-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.fill();
//         }
//         else if (mode == "top-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.fill();
//         }
//         else if (mode == "bot-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.fill();
//         }
//         else if (mode == "bot-left-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.fill();
//         }
//         else if (mode == "bot-left-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.fill();
//         }
//         else if (mode == "top-left-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.fill();
//         }
//         else if (mode == "top-bot-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.fill();
//         }
//         else if (mode == "top-bot-left-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX + width/2, rectMoveY + height/2);
//         ctx.lineTo(rectMoveX - width/2, rectMoveY + height/2);
//         ctx.fill();
//         }
//         else if (mode == "top-bot-left-right-enhancement") {
//         ctx.beginPath();
//         ctx.moveTo(rectMoveX - width/2 - leftEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY - height/2 - topEnhancement);
//         ctx.lineTo(rectMoveX + width/2 + rightEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.lineTo(rectMoveX - width/2 - leftEnhancement, rectMoveY + height/2 + botEnhancement);
//         ctx.fill();
//         }
//     }
//     function draw_rectangle(widthSize, heightSize, mode, border=1, dash=false) {
//           if (mode == "standart") {
//             var xUpperLeft = rectMoveX - (width/2);
//             var yUpperLeft = rectMoveY - (height/2);
//           }
//           else if (mode == "top-enhancement") {
//             var xUpperLeft = rectMoveX - (width/2);
//             var yUpperLeft = rectMoveY - (height/2) - topEnhancement;
//           }
//           else if (mode == "bot-enhancement") {
//             var xUpperLeft = rectMoveX - (width/2);
//             var yUpperLeft = rectMoveY + (height/2);
//           }
//           else if (mode == "left-enhancement") {
//             var xUpperLeft = rectMoveX - (width/2) - leftEnhancement;
//             var yUpperLeft = rectMoveY - (height/2);
//           }
//           else if (mode == "right-enhancement") {
//             var xUpperLeft = rectMoveX + (width/2);
//             var yUpperLeft = rectMoveY - (height/2);
//           }
//           ctx.strokeStyle = "rgb(16,56,125)";
//           ctx.lineWidth = 3;
//           ctx.rect(xUpperLeft, yUpperLeft, widthSize, heightSize);
//           ctx.stroke();
//       }
//     function fill_circle(x, y, radius) {
//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.fillStyle = "rgb(243,255,253)";
//         ctx.fill();
//     }
//     function draw_circle(x, y, radius) {
//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.lineWidth = 3;
//         ctx.strokeStyle = "rgb(16,56,125)";
//         ctx.stroke();
//         holesNum++;
//     }
//     function get_length(diameter) {
//         length = Math.cos(45 * Math.PI / 180) * diameter;
//         return length;
//     }
//     function get_circNum(sideLength, firstLength, secondLength) {
//         const FB = 120/152;
//         var between = sideLength-firstLength-secondLength;
//         if (between > 0) {
//             circNum = Math.ceil((sideLength/diameter)/FB);
//             circStep = between/circNum;
//             var dif = ((diameter/scalar)*FB)/(circStep/scalar);
//             var i = 0;
//             var j = 0;
//             do {
//             if (dif < 0.95) {
//                 ++circNum;
//                 circStep = between/circNum;
//                 ++i;
//             }
//             else if (dif > 1.05) {
//                 --circNum;
//                 circStep = between/circNum;
//                 ++j;
//             }
//             dif = ((diameter/scalar)*FB) / (circStep/scalar);
//             circStep = between/circNum;
//             if ((i>=1)&&(j>=1)) {
//                 var circStepMin = between/(circNum+1);
//                 var circStepMax = between/(circNum-1);
//                 circStepMinRes = Math.abs((circStepMin/scalar) - ((diameter/scalar)*FB));
//                 circStepRes = Math.abs((circStep/scalar) - ((diameter/scalar)*FB));
//                 circStepMaxRes = Math.abs((circStepMax/scalar) - ((diameter/scalar)*FB));
//                 minRes = Math.min(circStepMinRes, circStepRes, circStepMaxRes);
//                 switch (minRes) {
//                 case circStepRes:
//                     break;
//                 case circStepMinRes:
//                     ++circNum;
//                     circStep = between/circNum;
//                     break;
//                 case circStepMaxRes:
//                     --circNum;
//                     circStep = between/circNum;
//                     break;
//                 }
//                 if (circStep > diameter*0.98) {
//                 ++circNum;
//                 circStep = between/circNum;
//                 }
//                 break;
//             }
//             } while ((dif < 0.95) || (dif > 1.05));
//         }
//         else {
//             circStep = 0;
//             circNum = 0;
//         }
//         return {
//             circStep: circStep,
//             circNum: circNum,
//         };
//     }
//     function fillCircles(heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) {
//         var k = i;
//         for (i; i<heightCircNum; i++) {
//             if (mode == "standart") {
//             y = rectMoveY - (new_height) + heightCircStep*i;
//             x = rectMoveX - (new_width);
//             fill_circle(x, y, radius);
//             x = rectMoveX + (new_width);
//             fill_circle(x, y, radius);
//             }
//             if ((mode == "free") && (vert === "true")) {
//             (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
//             fill_circle(xStart, y, radius);
//             if (xLength > 0) {
//                 (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
//                 fill_circle(xStart+xLength, y, radius);
//             }
//             }
//         }
//         i = k;
//         for (i; i<widthCircNum; i++) {
//             if (mode == "standart") {
//             var x = rectMoveX - (new_width) + widthCircStep*i;
//             var y = rectMoveY - (new_height);
//             fill_circle(x, y, radius);
//             y = rectMoveY + (new_height);
//             fill_circle(x, y, radius);
//             }
//             if ((mode == "free") && (hor === "true")) {
//             (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
//             fill_circle(x, yStart, radius);
//             if (yLength > 0) {
//                 (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
//                 fill_circle(x, yStart+yLength, radius);
//             }
//             }
//         }
//     }
//     function drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) {
//         var k = i;
//         for (i; i<heightCircNum; i++) {
//             if (mode == "standart") {
//             var y = rectMoveY - (new_height) + heightCircStep*i;
//             var x = rectMoveX - (new_width);
//             draw_circle(x, y, radius);
//             x = rectMoveX + (new_width);
//             draw_circle(x, y, radius);
//             }
//             if ((mode == "free") && (vert === "true")) {
//             (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
//             draw_circle(xStart, y, radius);
//             if (xLength > 0) {
//                 (yDirection === "true")?(y = yStart - heightCircStep*i):(y = yStart + heightCircStep*i);
//                 draw_circle(xStart+xLength, y, radius);
//             }
//             }
//         }
//         i = k;
//         for (i; i<widthCircNum; i++) {
//             if (mode == "standart") {
//             x = rectMoveX - (new_width) + widthCircStep*i;
//             y = rectMoveY - (new_height);
//             draw_circle(x, y, radius);
//             y = rectMoveY + (new_height);
//             draw_circle(x, y, radius);
//             }
//             if ((mode == "free") && (hor === "true")) {
//             (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
//             draw_circle(x, yStart, radius);
//             if (yLength > 0) {
//                 (xDirection === "true")?(x = xStart - widthCircStep*i):(x = xStart + widthCircStep*i);
//                 draw_circle(x, yStart+yLength, radius);
//             }
//             }
//         }
//     }
//     const fillAllCorners = () => {
//         x = 250 - (new_width);
//         y = 250 - (new_height);
//         fill_circle(x, y, radius);
//         x = 250 + (new_width);
//         y = 250 - (new_height);
//         fill_circle(x, y, radius);
//         x = 250 - (new_width);
//         y = 250 + (new_height);
//         fill_circle(x, y, radius);
//         x = 250 + (new_width);
//         y = 250 + (new_height);
//         fill_circle(x, y, radius);
//     }
//     const drawAllCorners = () => {
//         x = 250 - (new_width);
//         y = 250 - (new_height);
//         draw_circle(x, y, radius);
//         x = 250 + (new_width);
//         y = 250 - (new_height);
//         draw_circle(x, y, radius);
//         x = 250 - (new_width);
//         y = 250 + (new_height);
//         draw_circle(x, y, radius);
//         x = 250 + (new_width);
//         y = 250 + (new_height);
//         draw_circle(x, y, radius);
//     }
//     function Path(xStart, yStart, x, y, skipX, skipY) {
//         this.xStart = xStart;
//         this.yStart = yStart;
//         this.x = x;
//         this.y = y;
//     }
//     function HolesDist() {
//         this.holesDistVertLeftToRight = [];
//         this.holesDistHorTopToBot = [];
//     }
//     function circlesByPath(path) {
//         var xCoord = path.xStart;
//         var yCoord = path.yStart;
//         fill_circle(xCoord, yCoord, radius);
//         if (!((path.x.length == "1") && (path.y.length == "1") && (path.x[0] == "0") && (path.y[0] == "0"))) {
//             for (let i = 0; (i < path.x.length); i++) {
//             xCoord += path.x[i];
//             yCoord += path.y[i];
//             fill_circle(xCoord, yCoord, radius);
//             }
//             var holesDist = new HolesDist();
//             xCoord = path.xStart;
//             yCoord = path.yStart;
//             var v = 0;
//             var h = 0;
//             for (let i = 0; (i < path.x.length); i++) {
//             var xDirection = "false";
//             var yDirection = "false";
//             var hor = "false";
//             var vert = "false";
//             heightCircNum = get_circNum(Math.abs(path.y[i]), 0, 0).circNum;
//             heightCircStep = get_circNum(Math.abs(path.y[i]), 0, 0).circStep;
//             if ((yCoord + path.y[i]) > yCoord) {
//                 vert = "true";
//             }
//             else if ((yCoord + path.y[i]) < yCoord) {
//                 vert = "true";
//                 yDirection = "true";
//             }
//             widthCircNum = get_circNum(Math.abs(path.x[i]), 0, 0).circNum;
//             widthCircStep = get_circNum(Math.abs(path.x[i]), 0, 0).circStep;
//             if ((xCoord + path.x[i]) > xCoord) {
//                 hor = "true";
//             }
//             else if ((xCoord + path.x[i]) < xCoord) {
//                 hor = "true";
//                 xDirection = "true";
//             }
//             fillCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
//             xCoord += path.x[i];
//             yCoord += path.y[i];
//             }
//             xCoord = path.xStart;
//             yCoord = path.yStart;
//             for (let i = 0; (i < path.x.length); i++) {
//             var xDirection = "false";
//             var yDirection = "false";
//             var hor = "false";
//             var vert = "false";
//             heightCircNum = get_circNum(Math.abs(path.y[i]), 0, 0).circNum;
//             heightCircStep = get_circNum(Math.abs(path.y[i]), 0, 0).circStep;
//             if ((yCoord + path.y[i]) > yCoord) {
//                 getHolesVert();
//             }
//             else if ((yCoord + path.y[i]) < yCoord) {
//                 getHolesVert();
//                 yDirection = "true";
//             }
//             widthCircNum = get_circNum(Math.abs(path.x[i]), 0, 0).circNum;
//             widthCircStep = get_circNum(Math.abs(path.x[i]), 0, 0).circStep;
//             if ((xCoord + path.x[i]) > xCoord) {
//                 getHolesHor();
//             }
//             else if ((xCoord + path.x[i]) < xCoord) {
//                 getHolesHor();
//                 xDirection = "true";
//             }
//             drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
//             xCoord += path.x[i];
//             yCoord += path.y[i];
//             }
//             xCoord = path.xStart;
//             yCoord = path.yStart;
//             for (let i = 0; (i < path.x.length); i++) {
//             xCoord += path.x[i];
//             yCoord += path.y[i];
//             draw_circle(xCoord, yCoord, radius);
//             }
//         }
//         xCoord = path.xStart;
//         yCoord = path.yStart;
//         draw_circle(xCoord, yCoord, radius);
//         console.log("holesNum: " + holesNum)
//         function getHolesHor() {
//             hor = "true";
//             holesDist.holesDistHorTopToBot[h] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
//             h++;
//         }
//         function getHolesVert() {
//             vert = "true";
//             holesDist.holesDistVertLeftToRight[v] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
//             v++;
//         }
//     }

//     function reset_canvas() {
//         ctx.clearRect(0, 0, c.width, c.height);
//     }

//     function scale_enhancement_input(scale=0.8) {
//         shortest = Math.min(c.width, c.height);
//         if ((leftEnhancement > 0)&&(rightEnhancement > 0))
//             maxWidth = parseFloat(width) + leftEnhancement + rightEnhancement;
//         else if ((leftEnhancement <= 0) || (rightEnhancement <= 0))
//             maxWidth = parseFloat(width) + leftEnhancement + rightEnhancement;
//         if ((topEnhancement > 0)&&(botEnhancement > 0))
//             maxHeight = parseFloat(height) + topEnhancement + botEnhancement;
//         else if ((topEnhancement <= 0) || (botEnhancement <= 0))
//             maxHeight = parseFloat(height) + topEnhancement + botEnhancement;
//         longest_side = Math.max(maxWidth, maxHeight, diameter)
//         max_length = shortest*scale;
//         scalar = max_length/longest_side;
//         width = width*scalar;
//         height = height*scalar;
//         diameter = diameter*scalar;
//         radius = radius*scalar;
//         topEnhancement = topEnhancement*scalar;
//         botEnhancement = botEnhancement*scalar;
//         leftEnhancement = leftEnhancement*scalar;
//         rightEnhancement = rightEnhancement*scalar;
//     }
//     const get_input = (a) => {
//         a = a ? parseFloat(a) : 0;
//         return a;
//     }
//     function drawTopEnhancement(rectMoveX, rectMoveY) {
//         if ((diameter < topEnhancement - limit) && (diameter < width - limit)) {
//             fill_enhancement_rectangle("top-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - length,
//             [0, width - 2*length, 0],
//             [-topEnhancement + 2*length, 0, topEnhancement - 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= topEnhancement - limit) && (diameter < width - limit)) {
//             fill_enhancement_rectangle("top-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
//             [width - 2*length],
//             [0]);
//             circlesByPath(path);
//         }
//         else if ((diameter < topEnhancement - limit) && (diameter >= width - limit)) {
//             fill_enhancement_rectangle("top-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
//             [0],
//             [topEnhancement - 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= topEnhancement - limit) && (diameter >= width - limit)) {
//             fill_enhancement_rectangle("top-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY - height/2 - topEnhancement + length,
//             [0],
//             [0]);
//             circlesByPath(path);
//         }
//         else 
//             errorAlert();
//         draw_rectangle(width, topEnhancement, "top-enhancement");
//     }
//     const drawBotEnhancement = (rectMoveX, rectMoveY) => {
//         if ((diameter < botEnhancement - limit) && (diameter < width - limit)) {
//             fill_enhancement_rectangle("bot-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
//             [0, width - 2*length, 0],
//             [botEnhancement - 2*length, 0, -botEnhancement + 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= botEnhancement - limit) && (diameter < width - limit)) {
//             fill_enhancement_rectangle("bot-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
//             [width - 2*length],
//             [0]);
//             circlesByPath(path);
//         }
//         else if ((diameter < botEnhancement - limit) && (diameter >= width - limit)) {
//             fill_enhancement_rectangle("bot-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + length,
//             [0],
//             [botEnhancement - 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= botEnhancement - limit) && (diameter >= width - limit)) {
//             fill_enhancement_rectangle("bot-enhancement");
//             var path = new Path(rectMoveX - width/2 + length, rectMoveY + height/2 + botEnhancement - length,
//             [0],
//             [0]);
//             circlesByPath(path);
//         }
//         else 
//             errorAlert();
//         draw_rectangle(width, botEnhancement, "bot-enhancement");
//     }
//     const drawLeftEnhancement = (rectMoveX, rectMoveY) => {
//         if ((diameter < leftEnhancement - limit) && (diameter < height - limit)) {
//             fill_enhancement_rectangle("left-enhancement");
//             var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
//             [-leftEnhancement + 2*length, 0, leftEnhancement - 2*length],
//             [0, height - 2*length, 0]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= leftEnhancement - limit) && (diameter < height - limit)) {
//             fill_enhancement_rectangle("left-enhancement");
//             var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
//             [0],
//             [height - 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter < leftEnhancement - limit) && (diameter >= height - limit)) {
//             fill_enhancement_rectangle("left-enhancement");
//             var path = new Path(rectMoveX - width/2 - length, rectMoveY - height/2 + length,
//             [-leftEnhancement + 2*length],
//             [0]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= leftEnhancement - limit) && (diameter >= height - limit)) {
//             fill_enhancement_rectangle("left-enhancement");
//             var path = new Path(rectMoveX - width/2 - leftEnhancement + length, rectMoveY - height/2 + length,
//             [0],
//             [0]);
//             circlesByPath(path);
//         }
//         else 
//             errorAlert();
//         draw_rectangle(leftEnhancement, height, "left-enhancement");
//     }
//     const drawRightEnhancement = (rectMoveX, rectMoveY) => {
//         if ((diameter < rightEnhancement - limit) && (diameter < height - limit)) {
//             fill_enhancement_rectangle("right-enhancement");
//             var path = new Path(rectMoveX + width/2 + length, rectMoveY - height/2 + length,
//             [rightEnhancement - 2*length, 0, -rightEnhancement + 2*length],
//             [0, height - 2*length, 0]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= rightEnhancement - limit) && (diameter < height - limit)) {
//             fill_enhancement_rectangle("right-enhancement");
//             var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length,
//             [0],
//             [height - 2*length]);
//             circlesByPath(path);
//         }
//         else if ((diameter < rightEnhancement - limit) && (diameter >= height - limit)) {
//             fill_enhancement_rectangle("right-enhancement");
//             var path = new Path(rectMoveX + width/2 + length, rectMoveY - height/2 + length,
//             [rightEnhancement - 2*length],
//             [0]);
//             circlesByPath(path);
//         }
//         else if ((diameter >= rightEnhancement - limit) && (diameter >= height - limit)) {
//             fill_enhancement_rectangle("right-enhancement");
//             var path = new Path(rectMoveX + width/2 + rightEnhancement - length, rectMoveY - height/2 + length,
//             [0],
//             [0]);
//             circlesByPath(path);
//         }
//         else 
//             errorAlert();
//         draw_rectangle(rightEnhancement, height, "right-enhancement");
//     }
// }
