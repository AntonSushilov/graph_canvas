canvas = document.querySelector("#myCanvas");
context = canvas.getContext("2d");
elements = new Figures();

var previousSelectedFigure;
var isDraggingFigure = false;
var isDraggingCanvas = false;
var scaleFigure = 1.0;
var translatePos = {x: 0, y: 0};
var lastPosition = {x: canvas.width / 2, y: canvas.height / 2};

canvas.onmousedown = canvasClick;
canvas.onmouseup = stopDragging;
canvas.onmousemove = dragFigureAndCanvas;
canvas.onwheel = changeScale;

window.addEventListener('resize', resizeCanvas, false)

//Рисование из json файла
/*
testElems = '{ \
    "layout": { "name": "Circle", "count": 2, "nameGroups": ["Node1", "Node2", "Edge"], "centerGroups": [{"x": 220, "y": 220}, {"x": 700, "y": 500}]}, \
    "figures": [ \
        {"id": "id0", "shape": "Triangle", "color": "green", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id1", "shape": "Circle", "color": "blue", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id2", "shape": "Rectangle", "color": "purple", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id3", "shape": "Rhomb", "color": "red", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id4", "shape": "Pentagon", "color": "orange", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id5", "shape": "Hexagon", "color": "green", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id6", "shape": "Plus", "color": "purple", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id7", "shape": "Vee", "color": "red", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id8", "shape": "Triangle", "color": "green", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id9", "shape": "Triangle", "color": "blue", "group": "Node1", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id10", "shape": "Triangle", "color": "orange", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id11", "shape": "Circle", "color": "magenta", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id12", "shape": "Rectangle", "color": "green", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id13", "shape": "Rhomb", "color": "pink", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id14", "shape": "Pentagon", "color": "green", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id15", "shape": "Hexagon", "color": "red", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id16", "shape": "Plus", "color": "blue", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id17", "shape": "Vee", "color": "purple", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id18", "shape": "Pentagon", "color": "orange", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}},\
        {"id": "id19", "shape": "Plus", "color": "pink", "group": "Node2", "position:":{"x": 0, "y": 0}, "size":{"width":50, "height": 60}}\
    ] \
}';

jsonFromPython = JSON.parse(testElems);
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
                    elements.newNode(elem.shape, elem.id, elem.position.x, elem.position.y, elem.size.size, elem.color, null);
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
    array.filter(el => el.group == groupName).forEach(elem => {
        var vx = Math.cos(currentAngle) * radius;
        var vy = Math.sin(currentAngle) * radius;
        elem.position = {x: baseX + vx, y: baseY + vy};
        currentAngle = 2 * Math.PI / nNode * counter;
        counter++;
    });
}
*/
resizeCanvas();
createFigures(10, 5);
let preload = document.getElementById('preloader')
preload.style.display = 'none'

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
}

//Видимость блоков фильтр, легенда
function setVis(tag) {
    let el = document.getElementById(tag);
    el.classList.toggle('switch')
}

//Скрыть/раскрыть блок настроек
function setVisible(id) {
    let el = document.getElementById(id);
    el.style.display = (el.style.display == 'none') ? 'block' : 'none';
}

//Помещает граф по центру
function setZoom(){
    console.log("zooom")
    let trPos; let scale;
    do {
        setGraphAtCenter(getMinMaxCoordinates())
        trPos = translatePos;
        drawCanvas();

        setGraphAtNormalSize(getMinMaxCoordinates())
        scale = scaleFigure
        drawCanvas();
    } while (trPos.x != 0 || trPos.y != 0 || scale != 1)
}

function getMinMaxCoordinates(){
    let minX = elements.figures[0].position.x;
    let minY = elements.figures[0].position.y;
    let maxX = 0; let maxY = 0;
    elements.figures.forEach(elem => {
        if (elem.group.includes("Node")){
            if (elem.position.x < minX) minX = elem.position.x;
            if (elem.position.y < minY) minY = elem.position.y;
            if((elem.position.x + elem.size) > maxX) maxX = elem.position.x + elem.size;
            if((elem.position.y + elem.size) > maxY) maxY = elem.position.y + elem.size;
        }
    });
    return {minX, minY, maxX, maxY}
}

function setGraphAtCenter(coords){
    let centerCanvas = {x: canvas.width / 2, y: canvas.height / 2};
    let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};
    translatePos = {x: centerCanvas.x - centerGraph.x, y: centerCanvas.y - centerGraph.y}
}

function setGraphAtNormalSize(coords){
    let scaleX = canvas.width / (coords.maxX - coords.minX);
    let scaleY = canvas.height / (coords.maxY - coords.minY);
    scaleFigure = ((coords.maxX - coords.minX) > (coords.maxY - coords.minY)) ? scaleX : scaleY;
}


function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function addRandomNodes(){
    //example: id, x, y, width, height, color, shape, label
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["Circle", "Triangle", "Rectangle", "Rhomb", "Pentagon", "Hexagon", "Plus"];
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
        shape: shapes[randomFromTo(0, 6)],
        //example: content, position, color, font
        label: new NodeLabel(content, pos, color, font),
    }
}

function addRandomEdges(nNodes){
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["straight", "curve", "loop"];
    var arrows = ["none", "angle", "triangle", "vee"];
    var positions = ["TopCenterLable", "BottomCenterLable"];
    var fontFamilies = ["Times", "Times New Roman", "Georgia", "Verdana", "Arial", "cursive", "fantasy"];
    var pos = positions[randomFromTo(0, 1)];
    var content = pos;
    var arrow = arrows[randomFromTo(0,3)];
    var shape = shapes[randomFromTo(0, 1)];
    var color = colors[randomFromTo(0, 9)];
    var font = randomFromTo(10, 20).toString() + 'px ' + fontFamilies[randomFromTo(0, 6)];
    return{
        id: 'idEdge',
        from: 'id' + randomFromTo(0, nNodes-1).toString(),
        to:  'id' + randomFromTo(0, nNodes-1).toString(),
        width: randomFromTo(3, 10),
        color: color,
        shape: shape,
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
    console.log(elements)
    drawCanvas();
}

function canvasClick(e){ 
    scaleFigure = 1;
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

function drawCanvas(){
    context.clearRect(0, 0, canvas.width * 10, canvas.height * 10)
    elements.figures.forEach(elem => elem.dragCanvas(translatePos, scaleFigure));
    elements.draw();
    translatePos = {x:0, y:0};
    scaleFigure = 1;
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
    if (e.deltaY < 0){
        scaleFigure = 1.2;
    }
    else {
        scaleFigure = 0.8;
    }
    drawCanvas();

    var mousePos = getMousePos(e);
    let coords = getMinMaxCoordinates();
    let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};

    translatePos.x = mousePos.x - centerGraph.x;
    translatePos.y = mousePos.y - centerGraph.y;
    drawCanvas();
}

function getMousePos(e){
    return {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    };
}