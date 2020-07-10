function switchCircle (circ) {
  circ.classList.toggle("fa-check-circle");
  circ.classList.toggle("fa-circle");
  circ.classList.toggle("fas");
}
function switchWireImg (row) {
  row.querySelector(".wire").classList.toggle("hide")
  row.querySelector(".bit").classList.toggle("hide")
  row.querySelector(".disk").classList.toggle("hide")
}
function addCircleListener(row, divContainer, firstAnswerClass, secondAnswerClass) {
  row.querySelector("." + divContainer).addEventListener("click", (function (e) {
    if (e.target && (e.target.classList.contains(firstAnswerClass) && (e.target.parentElement.parentElement.querySelector("." + firstAnswerClass + " .far").classList.contains("fa-circle")))) {
      switchCircle(row.querySelector("." + firstAnswerClass + " .far"));
      if (e.target.parentElement.parentElement.parentElement.querySelector("." + secondAnswerClass + " .far").classList.contains("fa-check-circle"))
      switchCircle (row.querySelector("." + secondAnswerClass + " .far"));
    }
    else if (e.target && (e.target.classList.contains(secondAnswerClass) && (e.target.parentElement.parentElement.querySelector("." + secondAnswerClass + " .far").classList.contains("fa-circle")))) {
      switchCircle (row.querySelector("." + secondAnswerClass + " .far"));
      if (e.target.parentElement.parentElement.parentElement.querySelector("." + firstAnswerClass + " .far").classList.contains("fa-check-circle"))
      switchCircle(row.querySelector("." + firstAnswerClass + " .far"));
    }
  }), false);
}
function hideSecondRow (e, secondLine) {
  secondLine.classList.toggle("second-line-transition");
  secondLine.classList.toggle("second-line");
  for (var i = 0; i < (secondLine.children.length); i++) {
    secondLine.children[i].style.opacity = "0";
  }
  if (e.target && e.target.classList.contains("fa-plus-square")) {
    secondLine.classList.toggle("hide");
    secondLine.classList.toggle("second-line");
    secondLine.classList.toggle("second-line-transition");
  }
  else {
    setTimeout(function() {
      secondLine.classList.toggle("hide");
      secondLine.classList.toggle("second-line");
      secondLine.classList.toggle("second-line-transition");
    }, 150);
  }
}
function hideThirdRow (thirdLine) {
  thirdLine.classList.toggle("third-line-transition");
  thirdLine.classList.toggle("third-line");
  for (var i = 0; i < (thirdLine.children.length); i++) {
    thirdLine.children[i].style.opacity = "0";
  }
  setTimeout(function() {
    thirdLine.classList.toggle("hide");
    thirdLine.classList.toggle("third-line");
    thirdLine.classList.toggle("third-line-transition");
  }, 150);
}
function revealThirdRow (e, thirdLine) {
  if ((thirdLine.firstElementChild.style.opacity == "") || (thirdLine.firstElementChild.style.opacity == "1")) {
    for (var i = 0; i < (thirdLine.children.length); i++) {
      thirdLine.children[i].style.opacity = "0";
    }
  }
  thirdLine.classList.toggle("third-line-transition");
  var transitionLine = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".third-line-transition");
  thirdLine.classList.toggle("third-line");
  transitionLine.classList.toggle("hide");
  setTimeout(function() {
    transitionLine.classList.toggle("third-line");
    thirdLine.classList.toggle("third-line-transition");
    for (var i = 0; i < (thirdLine.children.length); i++) {
      thirdLine.children[i].style.opacity = "1";
    }
  }, 150);
}
function addSpinner(row) {
  row.querySelector(".cog i").addEventListener("mouseenter", function (e){
    if (!e.target.classList.contains("fa-spin"))
      e.target.classList.toggle("fa-spin");
  }, false);
  row.querySelector(".cog i").addEventListener("mouseleave", function (e){
    if (e.target.classList.contains("fa-spin"))
      e.target.classList.toggle("fa-spin");
  }, false);
  row.querySelector(".cog i").addEventListener("click", function (e){
    var secondLine = e.target.parentElement.parentElement.parentElement.querySelector(".second-line");
    if (secondLine.classList.contains("hide")) {
      if ((secondLine.firstElementChild.style.opacity == "") || (secondLine.firstElementChild.style.opacity == "1")) {
        for (var i = 0; i < (secondLine.children.length); i++) {
          secondLine.children[i].style.opacity = "0";
        }
      }
      secondLine.classList.toggle("second-line-transition");
      var transitionLine = e.target.parentElement.parentElement.parentElement.querySelector(".second-line-transition");
      secondLine.classList.toggle("second-line");
      transitionLine.classList.toggle("hide");
      setTimeout(function() {
        transitionLine.classList.toggle("second-line");
        secondLine.classList.toggle("second-line-transition");
        for (var i = 0; i < (secondLine.children.length); i++) {
          secondLine.children[i].style.opacity = "1";
        }
      }, 150);
    }
    else if (!secondLine.classList.contains("hide"))
      hideSecondRow (e, secondLine);
  }, false);
}
// Script that appends a row on click event
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
function switchToRed(row) {
  if (INPUT_ROWS.childElementCount > 1) {  
    row.querySelector(".button").classList.toggle("redButton");
    row.querySelector(".button").classList.toggle("button");
    redButton = row.querySelector(".redButton");
    redButton.textContent="Удалить строку";
    redButton.addEventListener("click", function(){
    if ((row.querySelector("button").classList.contains("redButton")) && (INPUT_ROWS.childElementCount > 1)) 
        row.remove();
    if ((INPUT_ROWS.childElementCount == 1) && (INPUT_ROWS.firstElementChild.querySelector("button").classList.contains("redButton")))
      switchToWhite(INPUT_ROWS.firstElementChild);
    }, false);
  }
}
function switchToWhite(row) {
  row.querySelector(".redButton").classList.toggle("button");
  row.querySelector(".redButton").classList.toggle("redButton");
  button = row.querySelector(".button");
  button.textContent="Нарисовать схему";
  button.removeEventListener("click", arguments.callee,false);
}
function addZeroListener(row) {
  let qty=row.getElementsByTagName("input")["qty"];
  qty.addEventListener('input', function(e) {
   if ((e.target.value == 0) && (row.querySelector("button").classList.contains("button"))){
        switchToRed(row);
        this.removeEventListener('input', arguments.callee,false);
        restoreDrawButton(row);
      }
    else if ((e.target.value > 0) && (row.querySelector("button").classList.contains("redButton")))
        restoreDrawButton(row);
  }, false);
}
function restoreDrawButton(row) {
  let qty=row.getElementsByTagName("input")["qty"];
  qty.addEventListener('input', function(e) {
    if ((e.target.value > 0) && (row.querySelector("button").classList.contains("redButton"))){
      switchToWhite(row);
      this.removeEventListener('input', arguments.callee,false);
      addZeroListener(row);
    }
  }, false);
}
function addInputListener(row, inputId) {
  let input=row.getElementsByTagName("select")[inputId];
  input.addEventListener("input", function(e) {
    var thirdLine = row.querySelector(".third-line");
    if (e.target.value == "enhancement") {
      if (!row.querySelector(".wire").classList.contains("hide"))
        switchWireImg (row);
      if (thirdLine.classList.contains("hide"))
        revealThirdRow (e, thirdLine)
      if (!thirdLine.querySelector(".input-wire").classList.contains("hide"))
       thirdLine.querySelector(".input-wire").classList.toggle("hide");
      if (thirdLine.querySelector(".input-enhancement").classList.contains("hide"))
       thirdLine.querySelector(".input-enhancement").classList.toggle("hide");
    }
    else if (e.target.value == "wire-saw") {
      if (row.querySelector(".wire").classList.contains("hide"))
        switchWireImg (row)
      if (thirdLine.classList.contains("hide"))
        revealThirdRow (e, thirdLine)
      if (!thirdLine.querySelector(".input-enhancement").classList.contains("hide"))
      thirdLine.querySelector(".input-enhancement").classList.toggle("hide");
      if (thirdLine.querySelector(".input-wire").classList.contains("hide"))
        thirdLine.querySelector(".input-wire").classList.toggle("hide");
    }
    else if (((e.target.value == "floor")||(e.target.value == "wall")) && !(thirdLine.classList.contains("hide"))) {
      if (!row.querySelector(".wire").classList.contains("hide"))
        switchWireImg (row);
      hideThirdRow(thirdLine);
    }
  }, false)
}
// function AddEnhancementInputListener (row) {
//   var top = row.getElementsByTagName("input")["enhancement-top"];
//   var bot = row.getElementsByTagName("input")["enhancement-bot"];
//   var left = row.getElementsByTagName("input")["enhancement-left"];
//   var right = row.getElementsByTagName("input")["enhancement-right"];
//   var enhancement = [top, bot, left, right];
//   row.setAttribute("sides", 0)
//   enhancement.forEach((side) => {
//     side.addEventListener("input", enhancementInput)
//   });
//   function enhancementInput(e) {
//     if (e.target.value > 0) {
//       if ((e.target.getAttribute("modified") == "") || (e.target.getAttribute("modified") == null)) {
//         row.setAttribute("sides", (parseFloat(row.getAttribute("sides"))+1));
//         row.setAttribute(e.target.id, 1);
//         e.target.setAttribute("modified", 1);
//       }
//       else if (e.target.getAttribute("modified") == 0) {
//         row.setAttribute("sides", (parseFloat(row.getAttribute("sides"))+1));
//         row.setAttribute(e.target.id, 1);
//         e.target.setAttribute("modified", 1);
//       }
//       row.setAttribute("last", e.target.id);
//     }
//     else if ((e.target.value == 0) || (e.target.value == "")) {
//         if (e.target.getAttribute("modified") == 1) {
//         row.setAttribute("sides", (parseFloat(row.getAttribute("sides"))-1));
//         row.setAttribute(e.target.id, 0);
//         row.setAttribute("last", "deleted")
//         e.target.setAttribute("modified", 0);
//       }
//     }
//   }
//   function updateValue(valueSide, updateSide) {
//     updateSide.value = valueSide.value;
//   }
//   const config = {
//       attributes: true,
//   }; 
//   const callback = function(mutationsList, observer) {
//     for (let mutation of mutationsList) {
//       if (mutation.type === 'attributes') {
//         if (row.getAttribute("sides") == 4) {
//           switch (row.getAttribute("last")) {
//             case "enhancement-top":
//               if (row.getAttribute("enhancement-bot") == 1)
//                 top.addEventListener("input", updateValue(top, bot)); 
//               if ((row.getAttribute("enhancement-right") == 1) && (row.getAttribute("enhancement-left") == 1) && !(right.value == left.value)) {
//                 right.value = left.value;
//                 right.classList.add("highlight");
//                 setTimeout(function() {right.classList.remove("highlight")}, 3000);
//               }
//               break;
//             case "enhancement-bot":
//               if (row.getAttribute("enhancement-top") == 1)
//                 bot.addEventListener("input", updateValue(bot, top));
//               if ((row.getAttribute("enhancement-right") == 1) && (row.getAttribute("enhancement-left") == 1) && !(right.value == left.value)) {
//                 right.value = left.value;
//                 right.classList.add("highlight");
//                 setTimeout(function() {right.classList.remove("highlight")}, 3000);
//               } 
//               break;
//             case "enhancement-left":
//               if (row.getAttribute("enhancement-right") == 1)
//                 left.addEventListener("input", updateValue(left, right)); 
//               if ((row.getAttribute("enhancement-top") == 1) && (row.getAttribute("enhancement-bot") == 1) && !(bot.value == top.value)) {
//                 bot.value = top.value;
//                 bot.classList.add("highlight");
//                 setTimeout(function() {bot.classList.remove("highlight")}, 3000);
//               }
//               break;
//             case "enhancement-right":
//               if (row.getAttribute("enhancement-left") == 1)
//                 right.addEventListener("input", updateValue(right, left));  
//               if ((row.getAttribute("enhancement-top") == 1) && (row.getAttribute("enhancement-bot") == 1) && !(bot.value == top.value)) {
//                 bot.value = top.value;
//                 bot.classList.add("highlight");
//                 setTimeout(function() {bot.classList.remove("highlight")}, 3000);
//               }
//               break;
//           }
//         }
//       }
//     }
//   };
//   const observer = new MutationObserver(callback);
//   observer.observe(row, config);
// }
addZeroListener(INPUT_ROWS.firstElementChild);
addCircleListener(INPUT_ROWS.firstElementChild, "select", "disk", "bit");
addCircleListener(INPUT_ROWS.firstElementChild, "waste-answers", "waste-off", "waste-on");
addCircleListener(INPUT_ROWS.firstElementChild, "elevation-check-answers", "elevation-over-limit", "elevation-under-limit");
addCircleListener(INPUT_ROWS.firstElementChild, "water-check-answers", "water-check-on", "water-check-off");
addCircleListener(INPUT_ROWS.firstElementChild, "settings-check-answers", "settings-check-on", "settings-check-off");
addSpinner(INPUT_ROWS.firstElementChild);
addInputListener(INPUT_ROWS.firstElementChild,"job-type");
INPUT_ROWS.addEventListener("click", (function (e) {
    var INPUT = e.target.parentElement.parentElement.parentElement.parentElement;
  // embrasure variables
    // var holesNum = 0; ---> canvas.js
    // var holesDistHor = "null"; ---> canvas.js
    // var holesDistVert = "null"; ---> canvas.js
    // var cutNum = "null";
    // var cutLengthHor = "null";
    // var cutLengthVert = "null";
    // var coringPrice = 35;
    // var cutNum = "null";
    // var cuttingPrice = 2500;
    // var wastePrice = 415;
    // function Embrasure(width, height, depth, diameter, selectBitOrSaw, quantity, material, job, waste, wasteWeightLimit, concreteWeight, elevation, water, holesNum, holesDistHor, holesDistVert, cutNum, coringPrice, cuttingPrice, wastePrice) {
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
    //     if (this.elevation)
    //       money = 1.1*money;
    //     if (this.water)
    //       money = 1.2*money;
    //     return money;
    //   };
    //   this.cuttingPrice = cuttingPrice;
    //   this.cuttingMoney = function() {
    //     return (this.cutLengthTotal*this.depth*this.cuttingPrice/1000);
    //   };
    //   this.wasteWeight = function() {
    //     return (this.height*this.width*this.depth*this.concreteWeight/1000/1000/1000);
    //   };
    //   this.wastePrice = wastePrice;
    //   this.wasteMoney = function() {
    //     return (this.wasteWeight*wastePrice);
    //   };
    // }
    // var embrasures = [
    //   new Embrasure(
    //     INPUT.getElementsByTagName("input")["width"].value, 
    //     INPUT.getElementsByTagName("input")["height"].value,
    //     INPUT.getElementsByTagName("input")["depth"].value,
    //     INPUT.getElementsByTagName("select")["diameter"].children[INPUT.getElementsByTagName("select")["diameter"].options.selectedIndex].value, 
    //     bitOrSawValue = (function(){
    //       if (INPUT.getElementsByTagName("i")["bit"].classList.contains("fas"))
    //         return "bit"
    //       else
    //         return "disk"
    //     })(), 
    //     INPUT.getElementsByTagName("input")["qty"].value, 
    //     INPUT.getElementsByTagName("select")["material-type"].children[INPUT.getElementsByTagName("select")["material-type"].options.selectedIndex].value,
    //     INPUT.getElementsByTagName("select")["job-type"].children[INPUT.getElementsByTagName("select")["job-type"].options.selectedIndex].value,
    //     wasteValue = (function(){
    //       if (INPUT.getElementsByTagName("i")["waste-off"].classList.contains("fas"))
    //         return "waste-off"
    //       else
    //         return "waste-on"
    //     })(),
    //     INPUT.getElementsByTagName("input")["waste-weight"].value,
    //     INPUT.getElementsByTagName("input")["concrete-weight"].value,
    //     elevationValue = (function(){
    //       if (INPUT.getElementsByTagName("i")["elevation-over-limit"].classList.contains("fas"))
    //         return "true"
    //       else
    //         return "false"
    //     })(),
    //     waterValue = (function(){
    //       if (INPUT.getElementsByTagName("i")["water-check-on"].classList.contains("fas"))
    //         return "true"
    //       else
    //         return "false"
    //     })(),
    //     holesNum, holesDistHor, holesDistVert, cutNum, coringPrice, cuttingPrice, wastePrice
    //     )];
    //     console.log(embrasures[0]);
    function reveal(e) {
      var firstRow = INPUT.children[0];
      // var secondRow = INPUT.children[1];
      firstRow.lastChild.remove();
      firstRow.lastChild.remove();
      if ((e.target) && !(e.target.classList.contains("fa-plus-square"))) {
        for (var i = 1; i < (firstRow.children.length); i++) {
          if (!firstRow.children[i].classList.contains("input-diameter"))
            firstRow.children[i].classList.toggle("hide");
          else
            break;
        }
        setTimeout(function() {
          for (i; i < (firstRow.children.length); i++)
            firstRow.children[i].classList.toggle("hide");
        }, 150);
      }
      else if ((e.target) && (e.target.classList.contains("fa-plus-square"))) {
        for (var i = 1; i < (firstRow.children.length); i++)
          firstRow.children[i].classList.toggle("hide");
      }
      firstRow.classList.toggle("input-mod");
      firstRow.classList.toggle("first-line");
      firstRow.querySelector(".signs p").children[1].classList.remove("fa-caret-down");
      firstRow.querySelector(".signs p").children[1].classList.add("fa-caret-right");
    }
    function hide(e) {
      var firstRow = INPUT.children[0];
      var secondRow = INPUT.children[1];
      var thirdRow = INPUT.children[2];
      for (var i = 1; i < (firstRow.children.length); i++)
        firstRow.children[i].classList.toggle("hide");
      var newText = document.createTextNode("Проем " + INPUT.getElementsByTagName("input")["width"].value + " x " + INPUT.getElementsByTagName("input")["height"].value + " x " + INPUT.getElementsByTagName("input")["depth"].value + " мм - " + INPUT.getElementsByTagName("input")["qty"].value + " шт.");
      var paragraphElement = document.createElement("p");
      paragraphElement.appendChild(newText);
      firstRow.appendChild(paragraphElement);
      firstRow.lastChild.style.alignSelf="center";
      var pencilWrap = document.createElement("p");
      var pencil = document.createElement("i");
      firstRow.appendChild(pencilWrap);
      firstRow.lastChild.appendChild(pencil);
      firstRow.lastChild.style.cssText = "flex-grow: 1; align-self: center; display: flex; justify-content: flex-end; font-size: 2rem; margin-right: 3rem;"
      firstRow.lastChild.lastChild.classList.add("button");
      firstRow.lastChild.lastChild.classList.add("fas");
      firstRow.lastChild.lastChild.classList.add("fa-pencil-ruler");
      firstRow.classList.toggle("input-mod");
      firstRow.classList.toggle("first-line");
      firstRow.querySelector(".signs p").children[1].classList.remove("fa-caret-right");
      firstRow.querySelector(".signs p").children[1].classList.add("fa-caret-down");
      if (!secondRow.classList.contains("hide"))
        hideSecondRow (e, secondRow);
      if (!thirdRow.classList.contains("hide"))
        hideThirdRow(thirdRow);
    }
    if (e.target && e.target.classList.contains("fa-plus")) {
      (function add() {
        var num = INPUT.getElementsByTagName("input")["qty"].value;
        var plusNum = num*1 + 1;
        if (plusNum > 0)
        INPUT.getElementsByTagName("input")["qty"].value = plusNum;
        else
        INPUT.getElementsByTagName("input")["qty"].value = 1;
        if (INPUT.querySelector("button").classList.contains("redButton")) {
          switchToWhite(INPUT);
          addZeroListener(INPUT);
        }
      })();
    }
      else if (e.target && e.target.classList.contains("fa-minus")) {
        (function subtract() {
          var num = INPUT.getElementsByTagName("input")["qty"].value;
          var minusNum = num*1 - 1;
          if (minusNum > 0) {
            INPUT.getElementsByTagName("input")["qty"].value = minusNum;
            if (INPUT.querySelector("button").classList.contains("redButton")) {
              switchToWhite(INPUT);
              addZeroListener(INPUT);
            }
          }
          else if (minusNum <= 0) {
            INPUT.getElementsByTagName("input")["qty"].value = 0;
            if (INPUT.querySelector("button").classList.contains("button")) {
            switchToRed(INPUT);
            restoreDrawButton(INPUT)
            }
          }
        })();
      }
    else if (e.target && e.target.classList.contains("fa-plus-square")) {
      for (var i = 0; i < (INPUT_ROWS.childElementCount); i++) {
        if (INPUT_ROWS.children[i].contains(e.target)) {
          var newRowIndex = i + 1;
          break;
        }
      }
      switchResult = false;
      if (INPUT_ROWS.children[i].firstElementChild.classList.contains("input-mod")){
        reveal(e);
        if (INPUT.querySelector("button").classList.contains("redButton")) {
          switchToWhite(INPUT);
          switchResult = true;
        }
        referenceNode = INPUT;
        row_to_copy = referenceNode.cloneNode(true)
        insertAfter(row_to_copy, referenceNode);
        hide();
        if (switchResult) {
        switchToRed(INPUT);
        switchResult = false;
        }
      }
      else {
        if (INPUT.querySelector("button").classList.contains("redButton")) {
          switchToWhite(INPUT);
          switchResult = true;
        }
        referenceNode = INPUT;
        row_to_copy = referenceNode.cloneNode(true)
        insertAfter(row_to_copy, referenceNode);
        if (switchResult) {
          switchToRed(INPUT);
          switchResult = false;
        }
      }
      if (INPUT.getElementsByTagName("i")["settings-check-off"].classList.contains("fas")) {
        if (!INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["bit"].classList.contains("fas")) {
          switchCircle (INPUT_ROWS.children[newRowIndex].querySelector(".disk .far"));
          switchCircle (INPUT_ROWS.children[newRowIndex].querySelector(".bit .far"));
        }
        if (!INPUT_ROWS.children[newRowIndex].children[2].classList.contains("hide")) {
          INPUT_ROWS.children[newRowIndex].children[2].classList.toggle("hide");
          switchWireImg (INPUT_ROWS.children[newRowIndex])
        }
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["width"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["height"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["depth"].value = "250";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["waste-weight"].value = "100";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["concrete-weight"].value = "2.4";
        if (!INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["elevation-under-limit"].classList.contains("fas")) {
          switchCircle(INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["elevation-under-limit"]);
          switchCircle(INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["elevation-over-limit"]);
        }
        if (!INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["water-check-off"].classList.contains("fas")) {
          switchCircle(INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["water-check-off"]);
          switchCircle(INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["water-check-on"]);
        }
      }
      else {
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("select")["diameter"].options.selectedIndex = INPUT.getElementsByTagName("select")["diameter"].options.selectedIndex;
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("select")["material-type"].options.selectedIndex = INPUT.getElementsByTagName("select")["material-type"].options.selectedIndex;
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("select")["job-type"].options.selectedIndex = INPUT.getElementsByTagName("select")["job-type"].options.selectedIndex;
      }
      INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["qty"].value = "1";
      addZeroListener(INPUT.nextSibling);
      addZeroListener(INPUT);
      addCircleListener(INPUT.nextSibling, "select", "disk", "bit");
      addCircleListener(INPUT.nextSibling, "waste-answers", "waste-off", "waste-on");
      addCircleListener(INPUT.nextSibling, "elevation-check-answers", "elevation-over-limit", "elevation-under-limit");
      addCircleListener(INPUT.nextSibling, "water-check-answers", "water-check-on", "water-check-off");
      addCircleListener(INPUT.nextSibling, "settings-check-answers", "settings-check-on", "settings-check-off");
      addSpinner(INPUT.nextSibling);
      addInputListener(INPUT.nextSibling,"job-type");
      if ((INPUT_ROWS.firstElementChild.getElementsByTagName("input")["qty"].value == 0) && (INPUT_ROWS.firstElementChild.querySelector("button").classList.contains("button")))
        switchToRed(INPUT_ROWS.firstElementChild);
      if (!INPUT.nextSibling.children[1].classList.contains("hide"))
        hideSecondRow (e, INPUT.nextSibling.children[1])
    }
    else if (e.target && e.target.classList.contains("fa-caret-right")) {
      hide(e);
    }
    else if (e.target && e.target.classList.contains("fa-caret-down")) {
      reveal(e);
    }
}), false);
