function switchCircleDisk (row) {
  row.querySelector(".disk .far").classList.toggle("fa-check-circle");
  row.querySelector(".disk .far").classList.toggle("fa-circle");
  row.querySelector(".disk .far").classList.toggle("fas");
}
function switchCircleBit (row) {
  row.querySelector(".bit .far").classList.toggle("fa-check-circle");
  row.querySelector(".bit .far").classList.toggle("fa-circle");
  row.querySelector(".bit .far").classList.toggle("fas");
}
function addCircleListener(row) {
  row.querySelector(".select").addEventListener("click", (function (e) {
    if (e.target && (e.target.classList.contains("disk") && (e.target.parentElement.querySelector(".disk .far").classList.contains("fa-circle")))) {
      switchCircleDisk(row);
      if (e.target.parentElement.parentElement.querySelector(".bit .far").classList.contains("fa-check-circle"))
      switchCircleBit (row);
    }
    else if (e.target && (e.target.classList.contains("bit") && (e.target.parentElement.querySelector(".bit .far").classList.contains("fa-circle")))) {
      switchCircleBit(row);
      if (e.target.parentElement.parentElement.querySelector(".disk .far").classList.contains("fa-check-circle"))
      switchCircleDisk (row);
    }
  }));
}
function addSpinner(row) {
  row.querySelector(".buttons i").addEventListener("mouseenter", function (e){
    if (!e.target.classList.contains("fa-spin"))
      e.target.classList.toggle("fa-spin");
  });
  row.querySelector(".buttons i").addEventListener("mouseleave", function (e){
    if (e.target.classList.contains("fa-spin"))
      e.target.classList.toggle("fa-spin");
  });
  // row.querySelector(".buttons i").addEventListener("click", function (e){
  //     e.target.classList.toggle("hide");
  // });
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
    });}
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
  });
  }
  function restoreDrawButton(row) {
    let qty=row.getElementsByTagName("input")["qty"];
    qty.addEventListener('input', function(e) {
      if ((e.target.value > 0) && (row.querySelector("button").classList.contains("redButton"))){
        switchToWhite(row);
        this.removeEventListener('input', arguments.callee,false);
        addZeroListener(row);
      }
    });
  }
  addZeroListener(INPUT_ROWS.firstElementChild);
  addCircleListener(INPUT_ROWS.firstElementChild);
  addSpinner(INPUT_ROWS.firstElementChild);
  INPUT_ROWS.addEventListener("click", (function (e) {
      var INPUT = e.target.parentElement.parentElement.parentElement.parentElement;
      var firstRow = INPUT.children[0];
      var secondRow = INPUT.children[1];
      function reveal(e) {
        firstRow.lastChild.remove();
        firstRow.lastChild.remove();
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
        firstRow.classList.toggle("input-mod");
        firstRow.classList.toggle("first-line");
        firstRow.querySelector(".signs p").children[1].classList.remove("fa-caret-down");
        firstRow.querySelector(".signs p").children[1].classList.add("fa-caret-right");
      }
      function hide(e) {
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
        secondRow.classList.add("hide");
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
        if (INPUT_ROWS.children[i].classList.contains("input-mod")){
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
        if (!INPUT_ROWS.children[newRowIndex].getElementsByTagName("i")["bit"].classList.contains("fas")) {
          switchCircleDisk (INPUT_ROWS.children[newRowIndex]);
          switchCircleBit (INPUT_ROWS.children[newRowIndex]);
        }
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["qty"].value = "1";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["width"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["height"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["depth"].value = "250";
        addZeroListener(INPUT.nextSibling);
        addZeroListener(INPUT);
        addCircleListener(INPUT.nextSibling);
        addSpinner(INPUT.nextSibling);
        if ((INPUT_ROWS.firstElementChild.getElementsByTagName("input")["qty"].value == 0) && (INPUT_ROWS.firstElementChild.querySelector("button").classList.contains("button")))
        switchToRed(INPUT_ROWS.firstElementChild);
      }
      else if (e.target && e.target.classList.contains("fa-caret-right")) {
        hide(e);
      }
      else if (e.target && e.target.classList.contains("fa-caret-down")) {
        reveal(e);
      }
  }));
