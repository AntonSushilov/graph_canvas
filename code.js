canvas = document.querySelector('#myCanvas');
context = canvas.getContext('2d');
elements = new Figures();

var previousSelectedFigure;
var isDragging = false;

canvas.onmousedown = canvasClick;
canvas.onmouseup = stopDragging;
canvas.onmousemove = dragFigure;

createFigures(10, 5);

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function addRandomNodes(){
    //example: id, x, y, width, height, color, shape, label
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["Rectangle", "Circle", "Triangle", "Rhomb"];
    var positions = ["TopLeft", "TopCenter", "TopRight", "CenterLeft", "CenterRight", "BottomLeft", "BottomCenter", "BottomRight"];
    var fontFamilies = ["Times", "Times New Roman", "Georgia", "Verdana", "Arial", "cursive", "fantasy"];
    var pos = positions[randomFromTo(0, 7)];
    return {
        id: 'id',
        x: randomFromTo(0, canvas.width),
        y: randomFromTo(0, canvas.height),
        width: randomFromTo(20, 100),
        height: randomFromTo(20, 100),
        color: colors[randomFromTo(0, 9)],
        shape: shapes[randomFromTo(0, 3)],
        //example: content, position, color, font
        label: new NodeLabel(pos, pos, colors[randomFromTo(0, 9)], randomFromTo(10, 20).toString() + 'px ' + fontFamilies[randomFromTo(0, 6)]),
    }
}

function addRandomEdges(nNodes){
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink", "cyan"];
    var shapes = ["straight", "curve", "loop"];
    var arrows = ["none", "triangle", "round", "square", "rhomb"];
    var positions = ["TopLeft", "TopCenter", "TopRight", "CenterLeft", "CenterRight", "BottomLeft", "BottomCenter", "BottomRight"];
    var fontFamilies = ["Times", "Times New Roman", "Georgia", "Verdana", "Arial", "cursive", "fantasy"];
    var pos = positions[randomFromTo(0, 7)];
    return{
        id: 'idEdge',
        from: 'id' + randomFromTo(0, nNodes-1).toString,
        to:  'id' + randomFromTo(0, nNodes-1).toString,
        width: randomFromTo(3, 10),
        color: colors[randomFromTo(0, 9)],
        shape: shapes[randomFromTo(0, 1)],
        shape: arrows[randomFromTo(0, 4)],
        //example: content, position, color, font
        label: null,
    }
}

function createFigures(nNodes, nEdges){
    for (var i = 0; i < nNodes; i++){
        var figure = addRandomNodes();
        elements.newNode(figure.shape, figure.id + i.toString(), figure.x, figure.y, figure.width, figure.height, figure.color, figure.label);
    }
    for (var i = 0; i < nEdges; i++){
        var figure = addRandomEdges(nNodes);
        elements.newEdge(figure.id + i.toString(), figure.from, figure.to, figure.width, figure.color, figure.shape, figure.arrow, figure.label);
    }
    drawCanvas();
}

function canvasClick(e){
    var selectFigure = elements.previousSelectedFigure(getMousePos(e));
    if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;

    if (selectFigure.isSelectedFigure){
        previousSelectedFigure = selectFigure.figure;
        previousSelectedFigure.isSelected = true;
    }
    else{
        previousSelectedFigure = null;
        isDragging = false;
    }

    drawCanvas();
    return;
}

function drawCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    elements.draw();
}

function stopDragging(){
    isDragging = false;
}

function dragFigure(e){
    if (isDragging && previousSelectedFigure != null){
        previousSelectedFigure.drag(getMousePos(e));
        drawCanvas();
    }
}

function getMousePos(e){
    return {
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop
    };
}