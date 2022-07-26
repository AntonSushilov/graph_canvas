preload = document.getElementById('preloader')
canvas = document.querySelector("#myCanvas");
context = canvas.getContext("2d");
elements = new Figures();
nodes = new Set();
edges = new Set();

var previousSelectedFigure;
var isDraggingFigure = false;
var isDraggingCanvas = false;
var scale = 1.0;
var translatePos = {x: 0, y: 0};
var lastPosition = {x: canvas.width / 2, y: canvas.height / 2};

canvas.onmousedown = canvasClick;
canvas.onmousemove = dragFigureAndCanvas;
canvas.onmouseup = stopDragging;
canvas.onwheel = changeScale;
document.addEventListener("DOMContentLoaded", readyDom)
window.addEventListener('resize', resizeCanvas, false)

preload.style.display = 'block';
resizeCanvas();
createElements();
preload.style.display = 'none';


//Функции для создания и отрисовки элементов графа


//Создание элементов графа
function createElements(){
    example.nodes.forEach(node => {
        //
        let label = new NodeLabel(node.label, example.layout.positionLabelNode, example.layout.colorLabelNode, example.layout.fontSize + "px" + example.layout.fontFamilies);
        //
        elements.newNode(node.id, node.position.x, node.position.y, node.size, node.color, node.shape, label, node.group)
    });
    example.edges.forEach(edge => {
        //
        let label = new EdgeLabel(edge.label, example.layout.positionLabelEdge, example.layout.colorLabelEdge, example.layout.fontSize + "px" + example.layout.fontFamilies);
        //
        let arrow = new EdgeArrow(edge.arrow, edge.color)
        //
        elements.newEdge(edge.id, edge.from, edge.to, edge.width, edge.color, edge.shape, arrow, label, edge.group)
    });
    drawCanvas();
}

function changeStyleElements(){
    let counter = elements.figures.length;
    for (let count = 0; count < counter; count++){
        let label;
        let elem = elements.figures.shift();
        if (elem.group.includes("Node")){
            if (!document.getElementById(elem.group + '_txt').checked) label = new NodeLabel();
            //
            else label = new NodeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
            //
            elements.newNode(elem.id, elem.position.x, elem.position.y, elem.size, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, label, elem.group);
        }
        else {
            if (!document.getElementById(elem.group + '_txt').checked) label = new EdgeLabel();
            //
            else label = new EdgeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
            //
            let arrow = new EdgeArrow(document.getElementById(elem.group + '_arrow').value, document.getElementById(elem.group + '_color').value);
            //
            elements.newEdge(elem.id, elem.from.id, elem.to.id, elem.width, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, arrow, label, elem.group);
        }
    }










    drawCanvas();
}

//отрисовка всех элементов
function drawCanvas(){
    context.clearRect(0, 0, canvas.width * 10, canvas.height * 10)
    elements.figures.forEach(elem => elem.dragCanvas());
    elements.draw();
    translatePos = {x:0, y:0};
    scale = 1;
}

//установка выбранного элемента
function setSelect(id){
    previousSelectedFigure = elements.figures.find(el => el.id == id);
    previousSelectedFigure.isSelected = true;
    drawCanvas();
}


//Функции для взаимодействия с канвас


//событие при изменение канвы
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
}

//событие при нажатие на канву или фигуру
function canvasClick(e){ 
    scale = 1;
    var selectFigure = elements.isSelectedFigure(getMousePos(e));
    if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;

    if (selectFigure.isSelectFigure){
        previousSelectedFigure = selectFigure.figure;
        previousSelectedFigure.isSelected = true;
        isDraggingFigure = true;
        isDraggingCanvas = false;
        lastPosition = previousSelectedFigure.position;
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

//событие при движении канвы или фигуры
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

//событие при остановке движения канвы или фигуры
function stopDragging(){
    if (previousSelectedFigure != null && previousSelectedFigure.isSelected
        && previousSelectedFigure.position.x == lastPosition.x && previousSelectedFigure.position.y == lastPosition.y){
        if (document.getElementById('rightSidebar').classList == 'sidebar') setVis('rightSidebar');
        let p = document.getElementById('info');
        let infoLegend = example.nodes.find(el => el.id == previousSelectedFigure.id).infoLegend;
        let str = '';
        for (var key in infoLegend){
            str += key + ' ' + infoLegend[key] + '<br>'; 
        }
        let link = '<a href="javascript:void(0);" onclick="setSelect(\'' + previousSelectedFigure.id + '\')"; id="my_node">';
        p.innerHTML = "Узел " + link + previousSelectedFigure.label.content + "</a><br>";
        p.innerHTML += str;
    }
    isDraggingFigure = false;
    isDraggingCanvas = false;
    translatePos = {x: 0, y: 0};
}

//событие при изменение масштаба канвы
function changeScale(e){
    if (e.deltaY < 0) scale = 1.2;
    else scale = 0.8;
    drawCanvas();

    var mousePos = getMousePos(e);
    let coords = getMinMaxCoordinates();
    let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};

    translatePos.x = mousePos.x - centerGraph.x;
    translatePos.y = mousePos.y - centerGraph.y;
    drawCanvas();
}

//получение координат курсора
function getMousePos(e){
    return {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    };
}

function readyDom(){
    setLayout();
    createNodeMenu();
    createEdgeMenu();
}


//функции для работы html-панелек


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

//Помещает граф по центрунужного размера
function setZoom(){
    let trPos; let scale;
    do {
        setGraphAtCenter(getMinMaxCoordinates())
        trPos = translatePos;
        drawCanvas();

        setGraphAtNormalSize(getMinMaxCoordinates());
        scale = scale;
        drawCanvas();
    } while (trPos.x != 0 || trPos.y != 0 || scale != 1)
}

//вычисление координат левого верхнего и правого нижнего углов изображения графа
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

//Помещение графа по центру
function setGraphAtCenter(coords){
    let centerCanvas = {x: canvas.width / 2, y: canvas.height / 2};
    let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};
    translatePos = {x: centerCanvas.x - centerGraph.x, y: centerCanvas.y - centerGraph.y}
}

//приведение графа к правильному виду
function setGraphAtNormalSize(coords){
    let scaleX = canvas.width / (coords.maxX - coords.minX);
    let scaleY = canvas.height / (coords.maxY - coords.minY);
    scale = ((coords.maxX - coords.minX) > (coords.maxY - coords.minY)) ? scaleX : scaleY;
}

function setLayout(){
    for (let elem of document.querySelectorAll('input[name=typeDiagr]')){
        if (elem.value == example.layout.name) elem.checked = true;
    }
}

function createNodeMenu(){
    nodes = new Set();
    example.nodes.forEach(el => nodes.add(el.group));

    let div = document.getElementById('NodesGroup');
    let str = "";
    for (let node of nodes){
        let num = parseInt(node.replace("Node", "0"));
        let element = example.nodes.find(el => el.group == node);

        let shape = element.shape;
        let color = element.color;
        let positionLabel = example.layout.positionLabelNode;
        let colorLabel = example.layout.colorLabelNode;
        let sizeLabel = example.layout.fontSize;

        str += `<a href="javascript:void(0);" onclick="setVisible('` + node + `')">Узел` + (num != 0 ? num : '') + `</a>
                <div id="` + node + `" style="display:none">
                    <p>
                        Форма: <br />
                        <select id="` + node + `_shape">
                            <option value="Circle" ` + (shape == "Circle" ? 'selected' : '') + `>Круг</option>
                            <option value="Triangle" ` + (shape == "Triangle" ? 'selected' : '') + `>Треугольник</option>
                            <option value="Rectangle" ` + (shape == "Rectangle" ? 'selected' : '') + `>Квадрат</option>
                            <option value="Rhomb" ` + (shape == "Rhomb" ? 'selected' : '') + `>Ромб</option>
                            <option value="Pentagon" ` + (shape == "Pentagon" ? 'selected' : '') + `>Пятиугольник</option>
                            <option value="Hexagon" ` + (shape == "Hexagon" ? 'selected' : '') + `>Шестиугольник</option>
                            <option value="Plus" ` + (shape == "Plus" ? 'selected' : '') + `>Плюс</option>
                        </select>
                    </p>
                    <p>
                        Цвет: <br />
                        <input type="color" value="` + color + `" id="` + node + `_color">
                    </p>
                    <p>
                        Расположение надписи: <br />
                        <select id="` + node + `_position">
                            <option value="TopLeft" ` + (positionLabel == "TopLeft" ? 'selected' : '') + `>Сверху слева</option>
                            <option value="TopCenter" ` + (positionLabel == "TopCenter" ? 'selected' : '') + `>Сверху по центру</option>
                            <option value="TopRight" ` + (positionLabel == "TopRight" ? 'selected' : '') + `>Сверху справа</option>
                            <option value="CenterLeft" ` + (positionLabel == "CenterLeft" ? 'selected' : '') + `>По центру слева</option>
                            <option value="CenterRight" ` + (positionLabel == "CenterRight" ? 'selected' : '') + `>По центру справа</option>
                            <option value="BottomLeft" ` + (positionLabel == "BottomLeft" ? 'selected' : '') + `>Снизу слева</option>
                            <option value="BottomCenter" ` + (positionLabel == "BottomCenter" ? 'selected' : '') + `>Снизу по центру</option>
                            <option value="BottomRight" ` + (positionLabel == "BottomRight" ? 'selected' : '') + `>Снизу справа</option>
                        </select>
                    </p>
                    <p>
                        Цвет надписи: <br />
                        <input type="color" value="` + colorLabel + `" id="` + node + `_colorLabel">
                    </p>
                    <p>
                        Размер шрифта надписи: <br />
                        <input type="number" value="` + sizeLabel + `" id="` + node + `_sizeLabel" min="5" max="99">
                    </p>
                    <p>
                        <input type="checkbox" id="` + node + `_txt" checked/><label id="txt_lb" for="` + node + `_txt">Отображать надпись</label>
                    </p><br />
                </div>
                <br /><br />`;
    }
    div.innerHTML = str;
}

function createEdgeMenu(){
    edges = new Set();
    example.edges.forEach(el => edges.add(el.group));

    let div = document.getElementById('EdgesGroup');
    let str = "";
    for (let edge of edges){
        let num = parseInt(edge.replace("Edge", "0"));
        let element = example.edges.find(el => el.group == edge && el.shape != "loop");
        if (element == undefined) element = example.edges.find(el => el.group == edge);
        
        let shape = element.shape;
        let arrow = element.arrow;
        let color = element.color;
        let positionLabel = example.layout.positionLabelNode;
        let colorLabel = example.layout.colorLabelNode;
        let sizeLabel = example.layout.fontSize;

        str += `<a href="javascript:void(0);" onclick="setVisible('` + edge + `')">Ребро` + (num != 0 ? num : '') + `</a>
                <div id="` + edge + `" style="display:none">
                    <p>
                        Форма линии: <br />
                        <select id="` + edge + `_shape">
                            <option value="straight" ` + (shape == "straight" ? 'selected' : '') + `>Прямая</option>
                            <option value="curve" ` + (shape == "curve" ? 'selected' : '') + `>Изогнутая</option>
                            <option value="loop" ` + (shape == "loop" ? 'selected' : '') + `>Петля</option>
                        </select>
                    </p>
                    <p>
                        Форма стрелочки: <br />
                        <select id="` + edge + `_arrow">
                            <option value="none" ` + (arrow == "none" ? 'selected' : '') + `>Без стрелочки</option>
                            <option value="angle" ` + (arrow == "angle" ? 'selected' : '') + `>Простая стрелочка</option>
                            <option value="triangle" ` + (arrow == "triangle" ? 'selected' : '') + `>Треуголяная стрелочка</option>
                            <option value="vee" ` + (arrow == "vee" ? 'selected' : '') + `>V-образная стрелочка</option>
                        </select>
                    </p>
                    <p>
                        Цвет линии: <br />
                        <input type="color" value="` + color + `" id="` + edge + `_color">
                    </p>
                    <p>
                        Расположение надписи: <br />
                        <select id="` + edge + `_position">
                            <option value="TopCenterLable" ` + (positionLabel == "TopCenterLable" ? 'selected' : '') + `>Сверху по центру</option>
                            <option value="BottomCenterLable" ` + (positionLabel == "BottomCenterLable" ? 'selected' : '') + `>Снизу по центру</option>
                        </select>
                    </p>
                    <p>
                        Цвет надписи: <br />
                        <input type="color" value="` + colorLabel + `" id="` + edge + `_colorLabel">
                    </p>
                    <p>
                        Размер шрифта надписи: <br />
                        <input type="number" value="` + sizeLabel + `" id="` + edge + `_sizeLabel" min="5" max="99">
                    </p>
                    <p>
                        <input type="checkbox" id="` + edge + `_txt" checked/><label id="txt_lb" for="` + edge + `_txt">Отображать надпись</label>
                    </p><br />
                </div>
                <br /><br />`;
    }
    div.innerHTML = str;
}