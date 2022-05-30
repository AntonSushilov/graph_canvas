canvas = document.querySelector("#myCanvas");
context = canvas.getContext("2d");
elements = new Figures();

var previousSelectedFigure;
var isDraggingFigure = false;
var isDraggingCanvas = false;
var scale = 1.0
var translatePos = {x: 0, y: 0}
var lastPosition = {x: canvas.width / 2, y: canvas.height / 2};

canvas.onmousedown = canvasClick;
canvas.onmouseup = stopDragging;
canvas.onmousemove = dragFigureAndCanvas;
canvas.onwheel = changeScale;


//Рисование из json файла
/*

const testElements = import('./testElements.json', {
    assert: {
        type: 'json'
    }
});

jsonFromPython = JSON.parse(testElements);
createFiguresFromJSON();

function createFiguresFromJSON(){
    var layout = jsonFromPython.layout;
    switch (layout.name) {
        case "Random":
            break;
        case "Circle":
            for (var i = 0; i < layout.count; i++){
                paintCircle(jsonFromPython.figures, layout.nameGroups[i], layout.centerGroups[i].x, layout.centerGroups[i].y);
            }
            jsonFromPython.figures.forEach(elem => {
                if (elem.group.includes("Node")) {
                    elements.newNode(elem.shape, elem.id, elem.position.x, elem.position.y, elem.size.width, elem.size.height, elem.color, null);
                }
            });
            break;
        case "DoubleCircle":
            break;
        case "TripleCircle":
            break;
        case "Table":
            break;
    }
    drawCanvas();
}

function paintCircle(array, groupName, baseX, baseY){
    var currentAngle = 0;
    var maxSumWH = 0;
    var nNode = 0; //var nNodes = array.filter(el => el.group == "Node").length;
    array.forEach(elem => {
        var sum = elem.size.width + elem.size.height;
        if (sum > maxSumWH) maxSumWH = sum;
        if (elem.group == groupName) nNode++;
    });
    var radius = (nNode * (maxSumWH / 8)) / 2 * Math.PI; // R = L / 2 * pi, где L - длинна окружности
    var counter = 1;
    array.filter(el => el/group == groupName).forEach(elem => {
        var vx = Math.cos(currentAngle) * radius;
        var vy = Math.sin(currentAngle) * radius;
        elem.position = {x: baseX + vx, y: baseY + vy};
        currentAngle = 2 * Math.PI / nNode * counter;
        counter++;
    });
}
*/









createFigures(10, 5);

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function addRandomNodes(){
    //example: id, x, y, width, height, color, shape, label
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["Circle", "Triangle", "Rectangle", "Rhomb", "Pentagon", "Hexagon", "Plus", "Vee"];
    var positions = ["TopLeft", "TopCenter", "TopRight", "CenterLeft", "CenterRight", "BottomLeft", "BottomCenter", "BottomRight"];
    var fontFamilies = ["Times", "Times New Roman", "Georgia", "Verdana", "Arial", "cursive", "fantasy"];
    var pos = positions[randomFromTo(0, 7)];
    var content = pos
    var color = colors[randomFromTo(0, 9)]
    var font = randomFromTo(10, 20).toString() + 'px ' + fontFamilies[randomFromTo(0, 6)]
    return {
        id: 'id',
        x: randomFromTo(0, canvas.width),
        y: randomFromTo(0, canvas.height),
        size: randomFromTo(20, 100),
        color: color,
        shape: shapes[randomFromTo(0, 7)],
        //example: content, position, color, font
        label: new NodeLabel(content, pos, color, font),
    }
}

function addRandomEdges(nNodes){
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["straight", "curve", "loop"];
    var arrows = ["none", "triangle", "rhomb", "vee"];
    var positions = ["TopCenterLable", "BottomCenterLable"];
    var fontFamilies = ["Times", "Times New Roman", "Georgia", "Verdana", "Arial", "cursive", "fantasy"];
    var pos = positions[randomFromTo(0, 1)];
    var content = pos
    var arrow = arrows[randomFromTo(0,3)]
    var color = colors[randomFromTo(0, 9)]
    var font = randomFromTo(10, 20).toString() + 'px ' + fontFamilies[randomFromTo(0, 6)]
    return{
        id: 'idEdge',
        from: 'id' + randomFromTo(0, nNodes-1).toString(),
        to:  'id' + randomFromTo(0, nNodes-1).toString(),
        width: randomFromTo(3, 10),
        color: color,
        shape: shapes[randomFromTo(0, 1)],
        arrow: new EdgeArrow(arrow, color),
        //example: content, position, color, font
        label: new EdgeLabel(content, pos, color, font),
    }
}

function createFigures(nNodes, nEdges){
    for (var i = 0; i < nNodes; i++){
        var figure = addRandomNodes();
        //
        elements.newNode(figure.shape, figure.id + i.toString(), figure.x, figure.y, figure.size, figure.color, figure.label);
    }
    for (var i = 0; i < nEdges; i++){
        var figure = addRandomEdges(nNodes);
        //
        elements.newEdge(figure.id + i.toString(), figure.from, figure.to, figure.width, figure.color, figure.shape, figure.arrow, figure.label);
    }
    drawCanvas();
}

function canvasClick(e){ 
    scale = 1;
    var selectFigure = elements.isSelectedFigure(getMousePos(e));
    if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;

    if (selectFigure.isSelectFigure){
        previousSelectedFigure = selectFigure.figure;
        previousSelectedFigure.isSelected = true;
        isDraggingFigure = true;
        isDraggingCanvas = false;
    } 
    else {
        previousSelectedFigure = null;
        isDraggingFigure = false;
        isDraggingCanvas = true;
        lastPosition = getMousePos(e);
    }

    drawCanvas();
    return;
}

function drawCanvas(mousePos){
    context.clearRect(0, 0, canvas.width * 10, canvas.height * 10)
    context.scale(scale, scale);
    elements.figures.forEach(elem => elem.dragCanvas(translatePos));
    elements.draw();
    console.log(  elements.figures)
}

function stopDragging(){
    isDraggingFigure = false;
    isDraggingCanvas = false;
    translatePos = {x: 0, y: 0};
}

function dragFigureAndCanvas(e){
    e.preventDefault();
    if (isDraggingFigure && previousSelectedFigure != null){
        previousSelectedFigure.drag(getMousePos(e));
        drawCanvas();
    } else {
        if (isDraggingCanvas){
            var mousePos = getMousePos(e);
            translatePos.x = mousePos.x - lastPosition.x;
            translatePos.y = mousePos.y - lastPosition.y;
            lastPosition = mousePos;
            drawCanvas();
        }
    }
}

function changeScale(e){
    if (e.deltaY < 0) scale = 1.1;
    else if (e.deltaY = 0) scale = 1;
    else scale = 0.9;
    drawCanvas();
}

function getMousePos(e){
    return {
        x: e.clientX - canvas.offsetLeft,
        y: e.ClientY - canvas.offsetTop
    };
}