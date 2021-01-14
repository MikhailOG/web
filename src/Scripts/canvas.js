

export function canvas(serviceName, data, concreteWeight, wasteWeight) {
  var holesNum = 0;
  //var sepHolesNum = 0;
  var holesDistHor = 0;
  var holesDistVert = 0;
  var error = false;
  // get data
  var width = data.width;
  var height = data.height;
  var diameter = data.diameter;
  var depth = data.depth;
  var old_radius = diameter/2;
  var radius = diameter/2;
  var topEnhancement;
  var botEnhancement;
  var leftEnhancement;
  var rightEnhancement;
  ((typeof data.enhancementTop) === 'undefined')? topEnhancement = 0 : topEnhancement = data.enhancementTop;
  ((typeof data.enhancementBottom) === 'undefined')? botEnhancement = 0 : botEnhancement = data.enhancementBottom;
  ((typeof data.enhancementLeft) === 'undefined')? leftEnhancement = 0 : leftEnhancement = data.enhancementLeft;
  ((typeof data.enhancementRight) === 'undefined')? rightEnhancement = 0 : rightEnhancement = data.enhancementRight;
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
  //var circSepMode = false;
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
  var baseCoringArea = 0;
  var externalCoringArea = 0;
  var restArea = 0;
  var totalArea = (topEnhancement + height + botEnhancement) * (leftEnhancement + width + rightEnhancement);
  var totalWeight = 0; // totalArea + externalCoringArea
  var restWeight = 0;
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
              baseCoringArea += (hole.circNum * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
              console.log('baseCoringArea: ' + baseCoringArea)
              externalCoringArea += hole.circNum * hole.topSegmentArea;
              if (hole.rowDistance === 'short') 
                externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
            });
            horHoles.map(hole => {
              baseCoringArea += (hole.circNum - 2) * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea; //pure coring weight
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
            //-----
            //waste calc
            get_waste_basic_info(vertHoles);
            get_waste_basic_info(horHoles);
            get_coringArea();
            restArea = totalArea - baseCoringArea + externalCoringArea;
            restWeight = restArea * 0.000001 * depth * 0.001 * concreteWeight;
            console.log('restWeight: ' + restWeight);
            if (restWeight > 1.02*wasteWeight) {
              var calc_width = (leftEnhancement + width + rightEnhancement - diameter - 2*length)/scalar;
              var calc_height = (topEnhancement + height + botEnhancement - diameter - 2*length)/scalar;
              diameter = data.diameter;
              radius = diameter/2;
              width = data.width;
              height = data.height;
              var minSide = Math.min(calc_width, calc_height);
              var maxSide = Math.max(calc_width, calc_height);
              var weightToCalc = restWeight;
              var partsQty = Math.ceil(restWeight/wasteWeight);
              console.log('first WEIGHT: '+ restWeight/partsQty)
              var processing = true;
              var counter = 0;
              var wasteCuts;
              var bestWasteCuts;
              var bestPaths = [];
              var bestRealPartWeight;
              do {
                console.log('COUNTER: ' + counter);
                console.log('new WeightToCalc: ' + weightToCalc)
                console.log('parts QTY: ' + partsQty)
                wasteCuts = calc_wasteQty(partsQty);
                console.log(wasteCuts)
                //console.log(minSide + ' / ' + maxSide)
                var deltaMinSide = (minSide - wasteCuts.longCut*diameter)/(wasteCuts.longCut+1) + diameter; 
                var deltaMaxSide = (maxSide - wasteCuts.shortCut*diameter)/(wasteCuts.shortCut+1) + diameter; 
                //console.log(deltaMinSide + ' / ' + deltaMaxSide)
                length = get_length(radius);
                let paths = calc_separate(wasteCuts);
                console.log('vertSepHoles: ')
                console.log(vertSepHoles)
                console.log('horSepHoles: ')
                console.log(horSepHoles)
                get_sepWaste_weight(vertSepHoles);
                get_sepWaste_weight(horSepHoles);
                let sepWasteWeight = 0;
                vertSepHoles.map(row => sepWasteWeight += row.weight);
                horSepHoles.map(row => sepWasteWeight += row.weight);
                console.log('restWeight: ' + restWeight);
                console.log('sepWeight: ' + sepWasteWeight)
                weightToCalc = restWeight - sepWasteWeight;
                console.log('WeightToCalc: ' + weightToCalc)
                if (weightToCalc < 0) {
                  console.log('ERROR');
                  processing = false;
                }
                let real_part_weight = weightToCalc/partsQty;
                console.log('real weight of one part: ' + real_part_weight + ' kg');
                console.log('partQTY: ' + partsQty);
                console.log('new PArtQTY: ' + Math.ceil(weightToCalc/wasteWeight))
                if (real_part_weight <= 1.05 * wasteWeight) {
                  bestWasteCuts = wasteCuts;
                  bestPaths = paths;
                  bestRealPartWeight = real_part_weight;
                  if ((partsQty - Math.ceil(weightToCalc/wasteWeight)) <= 0)  {
                    processing = false;
                    console.log('rejected to proceed, new PartsQty (' + Math.ceil(weightToCalc/wasteWeight) + ') >= (' + partsQty + ') prev partsQty')
                  }
                  else {
                    partsQty = Math.ceil(weightToCalc/wasteWeight);
                    console.log('accepted to proceed')
                    counter++;
                  }
                }
                else {
                  processing = false;
                  console.log('rejected to proceed, parts are too heavy: ' + (real_part_weight > 1.05 * wasteWeight))
                }
              } while (processing === true);
              diameter = data.diameter*scalar;
              radius = diameter/2;
              width = data.width*scalar;
              height = data.height*scalar;
              minSide *= scalar;
              maxSide *= scalar;
              deltaMinSide *= scalar;
              deltaMaxSide *= scalar;
              length *= scalar;

              console.log('bestWasteCuts: ' + bestWasteCuts)
              console.log(bestWasteCuts)
              console.log('Best real weight of one part: ' + bestRealPartWeight + ' kg');
              console.log(bestPaths)

              separate(bestWasteCuts);

            }
            //-----
            }
          else if ((width<=diameter)&&(height<=diameter)) {
              fill_circle(rectMoveX, rectMoveY, radius);
              draw_circle(rectMoveX, rectMoveY, radius);
          }
          else if ((width>diameter)&&(height<=diameter)) {
              var path = new Path(rectMoveX + width/2 - length, rectMoveY,
                  [- width + 2*length],
                  [0]);
              fill_rectangle("rgb(223,222,227)");
              circlesByPath(path);
          }
          else if ((width<=diameter)&&(height>diameter)) {
              var path = new Path(rectMoveX, rectMoveY + height/2 - length,
                  [0],
                  [- height + 2*length]);
              fill_rectangle("rgb(223,222,227)");
              circlesByPath(path);
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
  function calc_topSegmentArea(length) {
    let angle = 2 * Math.acos(length/old_radius);
    return 0.5 * (angle - Math.sin(angle)) * old_radius * old_radius;
  }
  function get_waste_basic_info (holesRow) {
    holesRow.map((row, index) => {
      var middleSectorAngel = 2*Math.acos((row.circStep/2)/old_radius); //rad
      var middleSegmentArea = (0.5 * (middleSectorAngel - Math.sin(middleSectorAngel)) * old_radius * old_radius); // 1/2
      var rowDistance;
      if (scalar*row.circStep/radius > 1.41421357) {
        rowDistance = 'long';
        var externalCoringOverLengthArea = 0;
      }
      else if (scalar*row.circStep/radius == 1.41421357) {
        rowDistance = 'perfect';
        var externalCoringOverLengthArea = 0;
      }
      else if (scalar*row.circStep/radius < 1.41421357) {
        rowDistance = 'short';
        var externalCoringOverLengthArea = get_externalCoringOverLengthArea(row);
      }
      holesRow[index] = {
        name: row.name+index,
        circStep: row.circStep,
        circNum: row.circNum,
        topSegmentArea: calc_topSegmentArea(length/scalar),
        middleSegmentArea: middleSegmentArea,
        rowDistance: rowDistance,
        externalCoringOverLengthArea: externalCoringOverLengthArea
      }
    } );
  }
  function get_externalCoringOverLengthArea(row) {
    let heightToCircIntersection = Math.sqrt(old_radius*old_radius-row.circStep*row.circStep/4);
    let hypotenuseAngle = (Math.asin(heightToCircIntersection/old_radius)-Math.asin((length/scalar)/old_radius));
    let hypotenuse = old_radius * hypotenuseAngle;
    let intersectionHeight = heightToCircIntersection - length/scalar;
    let side = Math.sqrt(hypotenuse * hypotenuse - intersectionHeight * intersectionHeight);
    return side * intersectionHeight;
  }
  function get_coringArea() {
    if ((vertHoles.length > 0) && (horHoles.length > 0)) {
      vertHoles.map(hole =>{
        baseCoringArea += (hole.circNum * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        externalCoringArea += hole.circNum * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
      horHoles.map(hole => {
        baseCoringArea += (hole.circNum - 2) * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea; //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        externalCoringArea += hole.circNum * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
    }
    else if ((vertHoles.length === 0) && (horHoles.length > 0)) {
      horHoles.map(hole =>{
        baseCoringArea += (hole.circNum * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
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
        baseCoringArea += (hole.circNum * Math.PI * old_radius * old_radius - (hole.circNum - 1) * 2 * hole.middleSegmentArea); //pure coring weight
        console.log('baseCoringArea: ' + baseCoringArea)
        let k;
        (serviceName === 'newCoring') ? k = 2: k = 1;
        externalCoringArea += (k * hole.circNum + 2) * hole.topSegmentArea;
        if (hole.rowDistance === 'short') 
          externalCoringArea -= (k * hole.circNum-1) * hole.externalCoringOverLengthArea;
      });
    }
    totalWeight = (totalArea + externalCoringArea) * depth * 0.000000001 * concreteWeight;
    console.log('total weight: ' + totalWeight);
  }
  function scaleSides() {
    minSide = scalar * minSide;
    maxSide = scalar * maxSide;
  }
  function get_sepCircNum(sideLength) {
    if (sideLength > 0) {
      circNum = Math.ceil(sideLength/diameter);
      if (((circNum * diameter - sideLength) > (diameter - 10*scalar)) && (circNum > 1)) {
        circNum --;
      }
      circStep = sideLength/circNum;
    }
    else {
      circStep = 0;
      circNum = 0;
    }
    return {
      circStep: circStep,
      circNum: circNum
    };
  }
  function calc_wasteQty(partsQty) {

    let shortCut = partsQty-1;
    let longCut = 0;
    let longCounter = 0;
    let minDistance = minSide*shortCut;

    do {  
      for (let shortCounter = partsQty - 1 - longCut; (shortCounter + 1)*(longCounter + 1) >= partsQty; shortCounter--) {
        var newDistance = minSide*shortCounter/(longCounter+1) + maxSide*longCounter;
        if (newDistance<minDistance) {
          minDistance = newDistance;
          longCut = longCounter;
          shortCut = shortCounter;
        } 
      }
      longCounter ++;
    } while ((minDistance == newDistance) || (longCounter<partsQty-2));
    console.log('result: ' + minDistance + ', longCuts: ' + longCut + ", shortCuts: " + shortCut + ', piece weight: ' + restWeight/((longCut + 1)*(shortCut + 1)))
    //let minSideScaled = scalar * minSide;
    //let maxSideScaled = scalar * maxSide;
    let longHolesNum = get_sepCircNum(maxSide).circNum*longCut;
    let shortHolesNum = (longCut+1) * shortCut * get_sepCircNum((minSide-longCut*diameter)/(longCut+1)).circNum;
    return {
      sepHolesNum: shortHolesNum + longHolesNum,
      longCut: longCut,
      shortCut: shortCut,
      longHolesNum: longHolesNum,
      // longHolesStep: get_sepCircNum(maxSide).circStep,
      // shortHolesStep: get_sepCircNum((minSide-longCut*diameter)/(longCut+1)).circStep,
      shortHolesNum: shortHolesNum
    };
  }
  function separate(wasteCuts) {
    var deltaMinSide = (minSide - wasteCuts.longCut*diameter)/(wasteCuts.longCut+1) + diameter; 
    var deltaMaxSide = (maxSide - wasteCuts.shortCut*diameter)/(wasteCuts.shortCut+1) + diameter;
    let heightGtWidthX, heightGtWidthY, widthGtHeightX, widthGtHeightY, heightGtWidthStartX, widthGtHeightStartY;
    if ((wasteCuts.shortHolesNum/(wasteCuts.shortCut*(wasteCuts.longCut+1))) === 1) {
      heightGtWidthStartX = deltaMinSide/2;
      widthGtHeightStartY = deltaMinSide/2;
      heightGtWidthX = 0;
      heightGtWidthY = - maxSide+diameter;
      widthGtHeightX = - maxSide+diameter;
      widthGtHeightY = 0;
    }
    else {
      heightGtWidthStartX = diameter;
      widthGtHeightStartY = diameter;
      heightGtWidthX = deltaMinSide-2*diameter;
      heightGtWidthY = - maxSide+diameter;
      widthGtHeightX = - maxSide+diameter;
      widthGtHeightY = -deltaMinSide+2*diameter;
    }
    if (height >= width) {
      for (let i=1; i <= wasteCuts.longCut; i++) {
        let path = new Path(
          rectMoveX + width/2 - length - i*deltaMinSide, 
          rectMoveY + height/2 - length - diameter,
          [0],
          [heightGtWidthY]);
        fillSepCirclesByPath(path);
        drawSepCirclesByPath(path);
      }
      for (let i=1; i <= wasteCuts.shortCut; i++) {
        for (let j=0; j < (wasteCuts.longCut + 1); j++) {
          let path = new Path(
            rectMoveX - width/2 + length + heightGtWidthStartX + j*deltaMinSide, 
            rectMoveY + height/2 - length - i * deltaMaxSide, //OK
            [heightGtWidthX],
            [0]);
          fillSepCirclesByPath(path);
          drawSepCirclesByPath(path);
        }
      }
    }
    else {
      for (let i=1; i <= wasteCuts.longCut; i++) {
        let path = new Path(
          rectMoveX + width/2 - length - diameter, 
          rectMoveY + height/2 - length - i*deltaMinSide,
          [widthGtHeightX],
          [0]);
        fillSepCirclesByPath(path);
        drawSepCirclesByPath(path);
      }
      for (let i=1; i <= wasteCuts.shortCut; i++) {
        for (let j=0; j < (wasteCuts.longCut + 1); j++) {
          let path = new Path(
            rectMoveX - width/2 + length  + i * deltaMaxSide,
            rectMoveY + height/2 - length - widthGtHeightStartY - j*deltaMinSide,
            [0],
            [widthGtHeightY]);
          fillSepCirclesByPath(path);
          drawSepCirclesByPath(path);
        }
      }
    }
  }
  function calc_separate(wasteCuts) {

    horSepHoles = [];
    vertSepHoles = [];
    let heightGtWidthX, heightGtWidthY, widthGtHeightX, widthGtHeightY, heightGtWidthStartX, widthGtHeightStartY;
    let paths = [];
    if ((wasteCuts.shortHolesNum/wasteCuts.shortCut/(wasteCuts.longCut+1)) === 1) {
      heightGtWidthStartX = deltaMinSide/2;
      widthGtHeightStartY = deltaMinSide/2;
      heightGtWidthX = 0;
      heightGtWidthY = - maxSide+diameter;
      widthGtHeightX = - maxSide+diameter;
      widthGtHeightY = 0;
    }
    else {
      heightGtWidthStartX = diameter;
      widthGtHeightStartY = diameter;
      heightGtWidthX = deltaMinSide-2*diameter;
      heightGtWidthY = - maxSide+diameter;
      widthGtHeightX = - maxSide+diameter;
      widthGtHeightY = -deltaMinSide+2*diameter;
    }
    if (height >= width) {
      for (let i=1; i <= wasteCuts.longCut; i++) {
        let path = new Path(
          rectMoveX + width/2 - length - i*deltaMinSide, 
          rectMoveY + height/2 - length - diameter,
          [0],
          [heightGtWidthY]);
        calc_SepCirclesByPath(path);
        paths.push(path);
      }
      for (let i=1; i <= wasteCuts.shortCut; i++) {
        for (let j=0; j < (wasteCuts.longCut + 1); j++) {
          let path = new Path(
            rectMoveX - width/2 + length + heightGtWidthStartX + j*deltaMinSide, 
            rectMoveY + height/2 - length - i * deltaMaxSide, //OK
            [heightGtWidthX],
            [0]);
          calc_SepCirclesByPath(path);
          paths.push(path);
        }
      }
    }
    else {
      for (let i=1; i <= wasteCuts.longCut; i++) {
        let path = new Path(
          rectMoveX + width/2 - length - diameter, 
          rectMoveY + height/2 - length - i*deltaMinSide,
          [widthGtHeightX],
          [0]);
        calc_SepCirclesByPath(path);
        paths.push(path);
      }
      for (let i=1; i <= wasteCuts.shortCut; i++) {
        for (let j=0; j < (wasteCuts.longCut + 1); j++) {
          let path = new Path(
            rectMoveX - width/2 + length  + i * deltaMaxSide,
            rectMoveY + height/2 - length - widthGtHeightStartY - j*deltaMinSide,
            [0],
            [widthGtHeightY]);
          calc_SepCirclesByPath(path);
          paths.push(path);
        }
      }
    }
    return paths;
  }
  function get_sepWaste_weight(holesRow) {
    holesRow.map((row, index) => {
      var middleSectorAngel = 2*Math.acos((row.circStep/2)/radius); //rad
      var middleSegmentArea = (0.5 * (middleSectorAngel - Math.sin(middleSectorAngel)) * radius * radius); // 1/2
      console.log(middleSegmentArea)
      holesRow[index] = {
        name: row.name+index,
        circStep: row.circStep,
        circNum: row.circNum,
        middleSegmentArea: middleSegmentArea,
        weight: (Math.PI * old_radius * old_radius * row.circNum - 2 * middleSegmentArea * (row.circNum - 1)) * depth * 0.000000001 * concreteWeight
      }
    } );
  }
  function fillSepCirclesByPath(path) {
    var xCoord = path.xStart;
    var yCoord = path.yStart;
    fill_circle(xCoord, yCoord, radius);
    if (!((path.x.length == "1") && (path.y.length == "1") && (path.x[0] == "0") && (path.y[0] == "0"))) {
      for (let i = 0; (i < path.x.length); i++) {
        xCoord += path.x[i];
        yCoord += path.y[i];
        fill_circle(xCoord, yCoord, radius);
      }
      //var holesDist = new HolesDist();
      xCoord = path.xStart;
      yCoord = path.yStart;
      var v = 0;
      var h = 0;
      for (let i = 0; (i < path.x.length); i++) {
        var xDirection = "false";
        var yDirection = "false";
        var hor = "false";
        var vert = "false";
        heightCircNum = get_sepCircNum(Math.abs(path.y[i])).circNum;
        heightCircStep = get_sepCircNum(Math.abs(path.y[i])).circStep;
        if ((yCoord + path.y[i]) > yCoord) {
          vert = "true";
        }
        else if ((yCoord + path.y[i]) < yCoord) {
          vert = "true";
          yDirection = "true";
        }
        widthCircNum = get_sepCircNum(Math.abs(path.x[i])).circNum;
        widthCircStep = get_sepCircNum(Math.abs(path.x[i])).circStep;
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
    }
  }
  function drawSepCirclesByPath(path) {
    var xCoord = path.xStart;
    var yCoord = path.yStart;
    fill_circle(xCoord, yCoord, radius);
    if (!((path.x.length == "1") && (path.y.length == "1") && (path.x[0] == "0") && (path.y[0] == "0"))) {
      for (let i = 0; i < path.x.length; i++) {
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
        heightCircNum = get_sepCircNum(Math.abs(path.y[i])).circNum;
        heightCircStep = get_sepCircNum(Math.abs(path.y[i])).circStep;
        if ((yCoord + path.y[i]) > yCoord) {
          vert = "true";
        }
        else if ((yCoord + path.y[i]) < yCoord) {
          vert = "true";
          yDirection = "true";
        }
        widthCircNum = get_sepCircNum(Math.abs(path.x[i])).circNum;
        widthCircStep = get_sepCircNum(Math.abs(path.x[i])).circStep;
        if ((xCoord + path.x[i]) > xCoord) {
          hor = "true";
        }
        else if ((xCoord + path.x[i]) < xCoord) {
          hor = "true";
          xDirection = "true";
        }
        drawCircles (heightCircNum, heightCircStep, widthCircNum, widthCircStep, 1, "free", vert, hor, xCoord, yCoord, 0, 0, xDirection, yDirection);
        if (heightCircNum === 0) 
          horSepHoles.push({name: 'horHoles', circNum: widthCircNum+1, circStep: widthCircStep/scalar});
        if (widthCircNum === 0) 
          vertSepHoles.push({name: 'vertHoles', circNum: heightCircNum+1, circStep: heightCircStep/scalar});
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
    // function getSepHolesHor() {
    //   hor = "true";
    //   holesDist.holesDistHorTopToBot[h] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
    //   h++;
    // }
    // function getSepHolesVert() {
    //   vert = "true";
    //   holesDist.holesDistVertLeftToRight[v] = Math.trunc(heightCircStep/scalar) + (heightCircStep/scalar).toString().slice((heightCircStep/scalar).toString().indexOf("."), ((heightCircStep/scalar).toString().indexOf(".")+3));
    //   v++;
    // }
  }
  function calc_SepCirclesByPath(path) {
    widthCircNum = 0;
    heightCircNum = 0;

    heightCircNum = get_sepCircNum(Math.abs(path.y[0])).circNum;
    heightCircStep = get_sepCircNum(Math.abs(path.y[0])).circStep;

    widthCircNum = get_sepCircNum(Math.abs(path.x[0])).circNum;
    widthCircStep = get_sepCircNum(Math.abs(path.x[0])).circStep;

    console.log('wN/hN: ' + widthCircNum + ' / ' + heightCircNum)

    if (heightCircNum === 0) 
      horSepHoles.push({name: 'horHoles', circNum: widthCircNum+1, circStep: widthCircStep});
    if (widthCircNum === 0) 
      vertSepHoles.push({name: 'vertHoles', circNum: heightCircNum+1, circStep: heightCircStep});
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

