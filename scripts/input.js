  // Script that appends a row on click event

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
function switchToRed(curRow) {
  curRow.querySelector(".button").classList.toggle("redButton");
  curRow.querySelector(".button").classList.toggle("button");
  redButton = curRow.querySelector(".redButton");
  redButton.textContent="Удалить строку";
  redButton.addEventListener("click", function(){
    if (curRow.querySelector("button").classList.contains("redButton"))
      curRow.remove();
  });
}
function switchToWhite(curRow) {
  curRow.querySelector(".redButton").classList.toggle("button");
  curRow.querySelector(".redButton").classList.toggle("redButton");
  button = curRow.querySelector(".button");
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
  INPUT_ROWS.addEventListener("click", (function (e) {
      var INPUT = e.target.parentElement.parentElement.parentElement;
      function reveal(e) {
        INPUT.lastChild.remove();
        INPUT.lastChild.remove();
        for (var i = 1; i < (INPUT.children.length); i++)
          INPUT.children[i].classList.toggle("hide");
        INPUT.classList.toggle("input-mod");
        INPUT.classList.toggle("input");
        INPUT.querySelector(".signs p").children[1].classList.remove("fa-caret-down");
        INPUT.querySelector(".signs p").children[1].classList.add("fa-caret-right");
      }
      function hide(e) {
        for (var i = 1; i < (INPUT.children.length); i++)
          INPUT.children[i].classList.toggle("hide");
        var newText = document.createTextNode("Проем " + INPUT.getElementsByTagName("input")["width"].value + " x " + INPUT.getElementsByTagName("input")["height"].value + " x " + INPUT.getElementsByTagName("input")["depth"].value + " мм - " + INPUT.getElementsByTagName("input")["qty"].value + " шт.");
        var paragraphElement = document.createElement("p");
        paragraphElement.appendChild(newText);
        INPUT.appendChild(paragraphElement);
        INPUT.lastChild.style.alignSelf="center";
        var pencilWrap = document.createElement("p");
        var pencil = document.createElement("i");
        INPUT.appendChild(pencilWrap);
        INPUT.lastChild.appendChild(pencil);
        INPUT.lastChild.style.cssText = "flex-grow: 1; align-self: center; display: flex; justify-content: flex-end; font-size: 2rem; margin-right: 3rem;"
        INPUT.lastChild.lastChild.classList.add("button");
        INPUT.lastChild.lastChild.classList.add("fas");
        INPUT.lastChild.lastChild.classList.add("fa-pencil-ruler");
        INPUT.classList.toggle("input-mod");
        INPUT.classList.toggle("input");
        INPUT.querySelector(".signs p").children[1].classList.remove("fa-caret-right");
        INPUT.querySelector(".signs p").children[1].classList.add("fa-caret-down");
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
              if ((INPUT.querySelector("button").classList.contains("button")) && (INPUT_ROWS.childElementCount > 1)) {
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
        if (INPUT_ROWS.children[i].classList.contains("input-mod")){
          reveal(e);
          if (INPUT.querySelector("button").classList.contains("redButton")) {
            switchToWhite(INPUT);
          }
          referenceNode = INPUT;
          row_to_copy = referenceNode.cloneNode(true)
          insertAfter(row_to_copy, referenceNode);
          addZeroListener(INPUT.nextSibling);
          hide();
        }
        else {
          if (INPUT.querySelector("button").classList.contains("redButton")) {
            switchToWhite(INPUT);
          }
          referenceNode = INPUT;
          row_to_copy = referenceNode.cloneNode(true)
          insertAfter(row_to_copy, referenceNode);
          addZeroListener(INPUT.nextSibling);
        }
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["qty"].value = "1";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["width"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["height"].value = "500";
        INPUT_ROWS.children[newRowIndex].getElementsByTagName("input")["depth"].value = "250";
      }
      else if (e.target && e.target.classList.contains("fa-caret-right")) {
        hide(e);
      }
      else if (e.target && e.target.classList.contains("fa-caret-down")) {
        reveal(e);
      }
  }));