// const $CORING = $("button .diamond-coring");
// const $SAW = $("button .diamond-saw");
// const $WIRE = $("button .diamond-wire");
// const $CORING_CONTAINER = $(".services.diamond-coring");
// const $SAW_CONTAINER = $(".services.diamond-saw");
// const $WIRE_CONTAINER = $(".services.diamond-wire");

// function addData() {
//     switch (container) {
//         case $CORING_CONTAINER:
//             data = ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет одиночных отверстий</h3>"];
//             break;
//         case $SAW_CONTAINER:
//             data = ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет по длине резки</h3>","<h3>Расчет по площади резки</h3>"];
//             break;
//         case $WIRE_CONTAINER:
//             data = ["<h3>Расчет нового проема</h3>","<h3>Расчет по площади резки</h3>"];
//             break;
//     }
//    var timeOut = 0;
//     data.forEach(h3 => {
//         setTimeout(function() {
//             container.append(h3);
//           }, timeOut);
//           timeOut += 100;
//     });
// }
// $CORING.click(addData(event));
new Vue({
el: ".menu",
    data: {
        hover: false,
        clicked: false,
        coringServices: ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет одиночных отверстий</h3>"],
        sawServices: ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет по длине резки</h3>","<h3>Расчет по площади резки</h3>"],
        wireServices: ["<h3>Расчет нового проема</h3>","<h3>Расчет по площади резки</h3>"],
        enhancementServices: ["<h3>Усиление проема</h3>","<h3>Обрамление проема</h3>"],
        currentTarget: "",
        mouseLeft: false,
        mouseMove: "",
        cursorY: "",
        mouseEnterTitile: false
    },
    methods: {
        updateCoordinates: function(event) {
            var oldY = this.cursorY;
            this.cursorY = event.clientY;
            if (oldY>event.clientY)
                this.mouseMove = "up"
            else if (oldY<event.clientY)
                this.mouseMove = "down"
        },
        buttonFunc: function(className) {
            if (this.currentTarget != "") {
                return {
                    hover: ((this.hover || this.clicked) && (this.currentTarget.classList.contains(className))),
                };
            }
        },
        fillFunc: function(className) {
            if (this.currentTarget != "") {
                return {
                    fill: ((this.hover || this.clicked) && (this.currentTarget.classList.contains(className))),
                };
            }
        },
        clickEvt: function(event) {
            this.clicked = !this.clicked;
            this.currentTarget = event.target;
        },
        mouseEvt: function(event) {
            if (event.type == "mouseenter") {
                this.hover = true;
                if ((event.target != this.currentTarget) && (this.clicked == true))
                    this.clicked = false
                this.currentTarget = event.target;
            }
            else if ((event.type == "mouseleave")&&!(this.mouseMove == "down")) {
                    this.hover = false;
                    if (!this.clicked)
                    this.currentTarget = "";
                }
        },
        mouseAtServisesEvt: function() {
            if ((event.type == "mouseleave") && (this.hover == true) && (this.mouseEnterTitile == false)){
                    this.hover = false;
                    if (!this.clicked)
                        this.currentTarget = "";
                }
        },
        mouseTitleEvt: function() {
            if (event.type == "mouseenter")
                this.mouseEnterTitile = true;
            else if (event.type == "mouseleave")
                this.mouseEnterTitile = false;
        },
        getServices: function(className) {
            var list = "";
            if (this.currentTarget != "") {
                if (this.currentTarget.classList.contains("diamond-coring"))
                    returnData = this.coringServices;
                else if (this.currentTarget.classList.contains("diamond-saw"))
                    returnData = this.sawServices;
                else if (this.currentTarget.classList.contains("diamond-wire"))
                    returnData = this.wireServices;
                else if (this.currentTarget.classList.contains("enforcement"))
                    returnData = this.enhancementServices;
                if (this.currentTarget.classList.contains(className)) {
                    returnData.forEach(h3 => (list += h3));
                    return list
                }
            }
            else    
                return this.currentTarget;
        }
    },
    computed: {

    }
});