var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

canvas.width = 500
canvas.height = 500


function clearCanvas(canvas){
    canvas.width = canvas.width
};

const degreesToRadians = (n) => (n / 180) * Math.PI;
const radiansToDegrees = (n) => (n / Math.PI) * 180
//прямая линия
/*
ctx.moveTo(10,10);
ctx.lineTo(100,100);
ctx.stroke();
*/
//кривыя линия (фигуры с помощью линий)
ctx.beginPath();
ctx.moveTo(10,10);
ctx.lineTo(100,100);
ctx.lineTo(100,200);
ctx.strokeStyle = 'red'; //цвет линий
ctx.lineWidth = 5; //толщина линий
//конец линий 
//butt- по умолчанию 
//round - закругленное
//square - как butt только длиннее
ctx.lineCap = 'round'; 
//соединение линий
//miter- по умолчанию
//round - закругленное
//bevel - обрезанный угол
ctx.lineJoin = 'round';  
ctx.stroke();

ctx.beginPath();
ctx.rect(200,200,70,50)
ctx.strokeStyle = 'black';
ctx.fillStyle = 'red';

ctx.stroke();
ctx.fill();


//арка
// ctx.beginPath();
// ctx.arc(
//     300, 300, 75,
//     degreesToRadians(-45),
//     degreesToRadians(90),
//     false
// )
// ctx.fillStyle = 'yellow';
// ctx.lineWidth = 1; 
// ctx.stroke();
// ctx.fill();

//круг
ctx.beginPath();
ctx.arc(
    300, 300, 75,
    degreesToRadians(0),
    degreesToRadians(360),
    false
)
ctx.fillStyle = 'yellow';
ctx.lineWidth = 1; 
ctx.stroke();
ctx.fill();


//кривая безье
ctx.beginPath();
ctx.moveTo(190, 130);
ctx.quadraticCurveTo(380,100, 360, 20);//через одну контрольную точку
//ctx.bezierCurveTo(140, 10, 390, 10, 390, 170); //через две контрольных точек
ctx.stroke();

ctx.beginPath();
ctx.rotate(0.45);
ctx.moveTo(50, 400);
ctx.lineTo(200, 400);
ctx.lineTo(125, 350);
ctx.closePath();//вызывать когда фигура замкнута\закончена, ресует линию в начальную точку
ctx.stroke();


function drawRectWithRadius(x, y, width, height, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width-r, y);
    
};