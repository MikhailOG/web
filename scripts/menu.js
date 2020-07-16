const $CORING = $("button .diamond-coring");
const $SAW = $("button .diamond-saw");
const $WIRE = $("button .diamond-wire");
const $CORING_CONTAINER = $(".services.diamond-coring");
const $SAW_CONTAINER = $(".services.diamond-saw");
const $WIRE_CONTAINER = $(".services.diamond-wire");

function addData(event) {
    switch (event.target) {
        case $CORING_CONTAINER:
            data = ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет одиночных отверстий</h3>"];
            break;
        case $SAW_CONTAINER:
            data = ["<h3>Расчет нового проема</h3>","<h3>Расчет расширения проема</h3>","<h3>Расчет по длине резки</h3>","<h3>Расчет по площади резки</h3>"];
            break;
        case $WIRE_CONTAINER:
            data = ["<h3>Расчет нового проема</h3>","<h3>Расчет по площади резки</h3>"];
            break;
    }
   var timeOut = 0;
    data.forEach(h3 => {
        setTimeout(function() {
            container.append(h3);
          }, timeOut);
          timeOut += 100;
    });
}
$CORING.click(addData(event));