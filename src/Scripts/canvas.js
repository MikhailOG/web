export const newCoring = (data) => {
    const width = data.width;
    var height = data.height;
    var diameter = data.diameter;
    var depth = data.depth;
    var radius = diameter/2;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    reset_canvas();
    
}
const fill_circle = (x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(243,255,253)";
    ctx.fill();
  }
const draw_circle = (x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(16,56,125)";
    ctx.stroke();
    holesNum++;
  }
 const get_length = (diameter) => {
    length = Math.cos(45 * Math.PI / 180) * diameter;
    return length;
  }
const get_circNum = (sideLength, firstLength, secondLength) =>{
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
const fillCircles = (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) => {
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
const drawCircles = (heightCircNum, heightCircStep, widthCircNum, widthCircStep, i, mode, vert, hor, xStart, yStart, xLength, yLength, xDirection, yDirection) => {
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
const fillAllCorners = () => {
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
const drawAllCorners = () => {
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
  }
  function HolesDist() {
    this.holesDistVertLeftToRight = [];
    this.holesDistHorTopToBot = [];
  }
const circlesByPath = (path) => {
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
    }
}
const scale_enhancement_input = (scale=0.8) => {
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
const get_input = (a) => {
    a = a ? parseFloat(a) : 0;
    return a;
}
const drawTopEnhancement = (rectMoveX, rectMoveY) => {
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
const drawBotEnhancement = (rectMoveX, rectMoveY) => {
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
const drawLeftEnhancement = (rectMoveX, rectMoveY) => {
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
const drawRightEnhancement = (rectMoveX, rectMoveY) => {
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
