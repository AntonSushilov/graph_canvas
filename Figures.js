class NodeLabel{
    constructor(content, position, color, font){
        this.content = (content == null) ? "" : content;
        this.position = (position == null) ? "TopLeft" : position;
        this.color = (color == null) ? "black" : color;
        this.font = (font == null) ? "20px cursive" : font;
        this.lenght = 0;
    }
}

class NodeFigure{
    constructor(id, x, y, size, color, shape, label){
        this.id = id;
        this.shape = (shape == null) ? "Circle" : shape;
        this.color = (color == null) ? "black" : color;
        this.size = (size == null) ? randomFromTo(20, 100) : size;
        this.radius = this.size / 2;
        this.group = "Node"
        this.isSelected = false;

        this.position = {x: (x == null) ? randomFromTo(0, canvas.width) : x, y: (y == null) ? randomFromTo(0, canvas.height): y};
        this.center = {x: this.position.x + this.radius, y: this.position.y + this.radius};
        this.label = (label == null) ? new NodeLabel() : label;
    }

    draw(){
        context.strokeStyle = "black";
        if (this.isSelected) context.lineWidth = 5;
        else context.lineWidth = 1;
        context.stroke();
    }

    drag (mousePosition){
        this.position = {x: mousePosition.x - this.radius, y: mousePosition.y - this.radius};
        this.center = {x: mousePosition.x, y: mousePosition.y}
    }

    dragCanvas(translatePos){
        this.position = {x: this.position.x + translatePos.x, y: this.position.y + translatePos.y};
        this.center = {x: this.position.x + this.radius, y: this.position.y + this.radius}
    }

    addlabel(){
        context.font = this.label.font;
        context.fillStyle = this.label.color;
        this.label.lenght = context.measureText(this.label.content).width;
        var labelPosition = this.getLabelPosition();
        context.fillText(this.label.content, labelPosition.x, labelPosition.y);
    }

    getLabelPosition(){
        var x = 0; var y = 0;        
        switch (this.label.position){
            case "TopLeft":
                x = this.center.x - this.radius - this.label.lenght - 5;
                y = this.center.y - this.radius - 5;
                break;
            case "TopCenter":
                x = this.center.x - this.label.lenght / 2;
                y = this.center.y - this.radius - 5;
                break;
            case "TopRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y - this.radius - 5;
                break;
            case "CenterLeft":
                x = this.center.x - this.radius - this.label.lenght - 5;
                y = this.center.y + 5;
                break;
            case "CenterRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y + 5;
                break;    
            case "BottomLeft":
                x = this.center.x - this.radius - this.label.lenght - 5;
                y = this.center.y + this.radius + 15;
                break;
            case "BottomCenter":
                x = this.center.x - this.label.lenght / 2;
                y = this.center.y + this.radius + 15;
                break;
            case "BottomRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y + this.radius + 15;
                break;                
        }
        return {x, y}       
    }
}

class Circle extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        var distanceFromCenter = Math.sqrt(Math.pow(this.center.x - mousePosition.x, 2) + Math.pow(this.center.y - mousePosition.y, 2))
        if (distanceFromCenter <= this.radius)
            return true;
        return false;
    }
}

class Triangle extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.position.y + this.size);
        context.lineTo(this.position.x, this.position.y + this.size);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
       return inTriangle(this.center.x, this.position.y, this.position.x + this.size, this.position.y + this.size, this.position.x, this.position.y + this.size, mousePosition)
    }
}

class Rectangle extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath()
        context.rect(this.position.x, this.position.y, this.size, this.size);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return inRectangle(this.position.x, this.position.y, this.position.x + this.size, this.position.y + this.size, mousePosition)
    }
}

class Rhomb extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.center.y);
        context.lineTo(this.center.x, this.position.y + this.size);
        context.lineTo(this.position.x, this.center.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return (inTriangle(this.position.x, this.center.y, this.center.x, this.position.y, this.position.x + this.size, this.center.y, mousePosition)
            || inTriangle(this.position.x, this.center.y, this.center.x, this.position.y + this.size, this.position.x + this.size, this.center.y, mousePosition))
    }
}

class Pentagon extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.center.y);
        context.lineTo(this.position.x + this.size, this.position.y + this.size);
        context.lineTo(this.position.x, this.position.y + this.size);
        context.lineTo(this.position.x, this.center.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return (inTriangle(this.center.x, this.position.y, this.position.x + this.size, this.center.y, this.position.x, this.center.y, mousePosition)
            || inRectangle(this.position.x, this.center.y, this.position.x + this.size, this.position.y + this.size, mousePosition))
    }
}

class Hexagon extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.position.x + 1.5 * this.size / 6, this.position.y);
        context.lineTo(this.position.x + 4.5 * this.size / 6, this.position.y);
        context.lineTo(this.position.x + this.size, this.center.y);
        context.lineTo(this.position.x + 4.5 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x + 1.5 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x, this.center.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return (inTriangle(this.position.x + 1.5 * this.size / 6, this.position.y, this.position.x + 1.5 * this.size / 6, this.position.y + this.size, this.position.x, this.center.y, mousePosition)
            || inTriangle(this.position.x + 4.5 * this.size / 6, this.position.y, this.position.x + 4.5 * this.size / 6, this.position.y + this.size, this.position.x + this.size, this.center.y, mousePosition)
            || inRectangle(this.position.x + 1.5 * this.size / 6, this.position.y, this.position.x + 4.5 * this.size / 6, this.position.y + this.size, mousePosition))
    }
}

class Plus extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.position.x + this.size / 3, this.position.y);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + this.size);
        context.lineTo(this.position.x + this.size / 3, this.position.y + this.size);
        context.lineTo(this.position.x + this.size / 3, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size / 3, this.position.y + this.size / 3);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return (inRectangle(this.position.x + this.size / 3, this.position.y, this.position.x + 2 * this.size / 3, this.position.y + this.size, mousePosition)
            || inRectangle(this.position.x, this.position.y + this.size / 3, this.position.x + this.size, this.position.y + 2 * this.size / 3, mousePosition))
    }
}

class Vee extends NodeFigure{
    constructor (id, x, y, size, color, shape, label){
        super(id, x, y, size, color, shape, label);
    }

    draw(){
        context.beginPath();
        context.moveTo(this.center.x, this.center.y);
        context.lineTo(this.position.x + this.size, this.position.y);
        context.lineTo(this.center.x, this.position.y + this.size);
        context.lineTo(this.position.x, this.position.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addlabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
    }

    isSelect(mousePosition){
        return (inTriangle(this.position.x, this.position.y, this.center.x, this.center.y, this.center.x, this.position.y + this.size, mousePosition)
            || inTriangle(this.position.x + this.size, this.position.y, this.center.x, this.center.y, this.center.x, this.position.y + this.size, mousePosition))
    }
}

const shapeMapping = {
    "Circle" : Circle, "Triangle" : Triangle, "Rectangle" : Rectangle, "Rhomb" : Rhomb, "Pentagon" : Pentagon, "Hexagon" : Hexagon, "Plus" : Plus, "Vee" : Vee
}

class Figures{
    constructor(){
        this.figures = []
    }
    newNode(shape, id, x, y, size, color, label){
        if (this.figures.find(f => f.id == id)) return;
        var figure = new shapeMapping[shape](id, x, y, size, color, label);
        this.figures.push(figure)
        return figure;
    }
    newEdge(id, from, to, width, color, shape, arrow, label){
        if (this.figures.find(f => f.id == id)) return;
        var direction = 1;
        if (this.figures.filter(figure => figure.constructor.name == "Edge").find(f => (f.to.id == from && f.from.id == to))) direction = -1;
        if (from == to) shape = "loop";
        var figure = new Edge(id, this.getFiguresById(from), this.getFiguresById(to), width, color, shape, arrow, label, direction);
        this.figures.push(figure);
        return figure;
    }
    get allFigures(){
        return this.figures;
    }
    get numberOfFigures(){
        return this.figures.lenght;
    }
    getFiguresById(id){
        return this.figures.find(f => f.id == id);
    }
    draw(){
        //
        this.figures.filter(figure => figure.constructor.name == "Edge").forEach(fig => fig.draw());
        this.figures.filter(figure => figure.constructor.name != "Edge").forEach(fig => fig.draw());
        //
        //
    }
    isSelectedFigure(mousePos){
        var isSelectFigure = false;
        var figure;
        for (var i = this.figures.length-1; i >= 0; i--){
            figure = this.figures[i];
            if (figure.constructor.name != "Edge" && figure.isSelect(mousePos)) isSelectFigure = true;
            if (isSelectFigure) break;
        }
        return{
            isSelectFigure: isSelectFigure,
            figure: figure
        };
    }
}

class EdgeLabel{
    constructor(content, position, color, font){
        this.content = (content == null) ? "" : content;
        this.position = (position == null) ? "TopCenter" : position;
        this.color = (color == null) ? "black" : color;
        this.font = (font == null) ? "20px cursive" : font;
        this.lenght = 0;
    }
}

class EdgeArrow{
    constructor(arrow, color){
        this.arrow = (arrow == null) ? "none" : arrow;
        this.color = (color == null) ? "black" : color;
        this.lenght = 0;
    }
}

class Edge{
    constructor(id, from, to, width, color, shape, arrow, label, direction){
        this.id = id;
        this.from = from;
        this.to = to;
        this.width = (width == null) ? randomFromTo(3, 10) : width;
        this.color = (color == null) ? "grey" : color;
        this.shape = (shape == null) ? "straight" : shape;
        this.arrow = (arrow == null) ? new EdgeArrow() : arrow;
        this.label = (label == null) ? new EdgeLabel() : label;
        this.direction = (direction == null) ? 1 : direction;
        this.isSelected = false;
    }

    dragCanvas(translatePos){}

    draw(){
        switch (this.shape){
            case "straight":
                context.beginPath();
                context.moveTo(this.from.center.x, this.from.center.y);
                context.lineTo(this.to.center.x, this.to.center.y);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke();
                this.addlabel();
                this.addarrow();          
                break;
            case "curve":
                context.beginPath();
                context.moveTo(this.from.center.x, this.from.center.y);
                var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction)
                var controlX = controlPoint.x;
                var controlY = controlPoint.y;
                context.quadraticCurveTo(controlX, controlY, this.to.center.x, this.to.center.y);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke();
                this.addlabel();
                this.addarrow();
                break;
            case "loop":
                context.beginPath();
                var radius = this.from.radius / 1.5;
                context.arc(this.from.position.x, this.from.position.y, radius, 0, 2 * Math.PI);
                context.strokeStyle = this.color;
                context.stroke();
                //super.draw();
                this.addlabel(radius);
                //this.addarrow();
        }
    }

    controlPoint(x1, y1, x3, y3, direction){
        var x2 = 0; var y2 = 0;
        var cX = (x3+x1) / 2;
        var cY = (y3+y1) / 2;
        var koef = (y3-y1)/(x3-x1);
        if (koef == 0){
            koef = 0.001
        }
        console.log(koef)
        koef = -1 / koef;
        var b = cY-koef*cX;
        var R = 100;
        var a = 1+koef**2
        var d = 2*koef*b - 2*cX -2*koef*cY
        var c = cX**2 + b**2 + cY**2 - 2*b*cY - R**2 
        var D = d**2 - 4*a*c
        x2 = (d*(-1) + direction * Math.sqrt(D)) / (2*a)
        y2 = koef*x2 + b
        
        return {x: x2, y: y2}
    }

    addlabel(radius){
        context.font = this.label.font;
        context.fillStyle = this.label.color;
        this.label.lenght = context.measureText(this.label.content).width;
        var labelPosition = this.getLabelPosition(radius);
        context.fillText(this.label.content, labelPosition.x, labelPosition.y);
    }

    getLabelPosition(radius){
        var x = 0; var y = 0;        
        switch (this.label.position){
            case "TopCenterLable":
                if (this.shape == "loop") {
                    //console.log("TopCenter loop")
                    
                    x = this.from.center.x - radius * 2 - this.label.lenght;
                    y = this.from.center.y - radius * 2  - (this.width + 5);
                }else if (this.shape == "curve"){
                    var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction);
                    x = controlPoint.x - this.label.lenght / 2;
                    y = controlPoint.y;
                    console.log()
                }
                else{
                    //console.log("TopCenter no loop")
                    x = (this.from.center.x+this.to.center.x) / 2 - this.label.lenght / 2;
                    y = (this.from.center.y+this.to.center.y) / 2 - (this.width + 10);
                }       
                break;
            case "BottomCenterLable":
                if (this.shape == "loop") {
                    //console.log("TopCenter loop")
                    x = this.from.center.x - radius*2 - this.label.lenght;
                    y = this.from.center.y - radius*2  - (this.width + 5);
                }else if (this.shape == "curve"){
                    var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction);
                    x = controlPoint.x  - this.label.lenght / 2;
                    y = controlPoint.y;
                }else{
                    //console.log("TopCenter no loop")
                    x = (this.from.center.x+this.to.center.x) / 2 - this.label.lenght / 2;
                    y = (this.from.center.y+this.to.center.y) / 2 + this.width + 10;
                }
                break;                    
        }
        //console.log(this.label.position, x,y)
        return {x, y}       
    }

    addarrow(){
        context.fillStyle = this.arrow.color;
        this.getArrowPosition();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.fillStyle = this.color;
        
        //context.stroke();
        //context.fillText(this.label.content, labelPosition.x, labelPosition.y);
        
    }

    getArrowPosition(){
        var x1 = 0; var y1 = 0;
        var x2 = 0; var y2 = 0;
        var x3 = 0; var y3 = 0;
        var x4 = 0; var y4 = 0;
        var step1 = 0; var step2 = 0;
        if (this.to.radius){
            var step1 = this.to.radius;
        }
        else{
            step1 = Math.sqrt(this.to.size**2 + this.to.size**2)
        }
        step2 = step1 + 30;

        
        switch (this.shape){
            case "straight":
                var dx = this.from.center.x - this.to.center.x;
                var dy = this.from.center.y - this.to.center.y;
                var r = Math.sqrt(dx ** 2 + dy ** 2);
                
                break;
            case "curve":
                //Доделать
                var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction)
                var dx = controlPoint.x - this.to.center.x;
                var dy = controlPoint.y - this.to.center.y;
                var r = Math.sqrt(dx ** 2 + dy ** 2);
                break;
        }


        switch (this.arrow.arrow){
            case "none":
                
                break;
            case "triangle":
                x1 = dx * (step1/r) + this.to.center.x;
                y1 = dy * (step1/r) + this.to.center.y;
                x2 = dx * (step2/r) + this.to.center.x;
                y2 = dy * (step2/r) + this.to.center.y;
                var alpha =  Math.PI/4;
                x3 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y3 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                alpha = -Math.PI/4;
                x4 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y4 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.lineTo(x4, y4);
                context.closePath();
                context.lineWidth = 2;
                context.strokeStyle = "black";
                context.fillStyle = this.color;
                context.fill()
                break;
            case "rhomb":
                var x5 = 0; var y5 = 0
                x1 = dx * (step1/r) + this.to.center.x;
                y1 = dy * (step1/r) + this.to.center.y;
                step2 = step1 + 30;
                x2 = dx * (step2/r) + this.to.center.x;
                y2 = dy * (step2/r) + this.to.center.y;

                step2 = step1 + 45;
                x5 = dx * (step2/r) + this.to.center.x;
                y5 = dy * (step2/r) + this.to.center.y;
                var alpha =  Math.PI/6;
                x3 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y3 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                alpha = -Math.PI/6;
                x4 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y4 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.lineTo(x5, y5);
                context.lineTo(x4, y4);
                context.closePath();
                context.lineWidth = 2;
                context.strokeStyle = "black";
                context.fillStyle = this.color;
                context.fill()
                break;
            case "vee":
                var x5 = 0; var y5 = 0
                x1 = dx * (step1/r) + this.to.center.x;
                y1 = dy * (step1/r) + this.to.center.y;
                step2 = step1 + 35;
                x2 = dx * (step2/r) + this.to.center.x;
                y2 = dy * (step2/r) + this.to.center.y;
                step2 = step1 + 15;
                x5 = dx * (step2/r) + this.to.center.x;
                y5 = dy * (step2/r) + this.to.center.y;
                var alpha =  Math.PI/6;
                x3 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y3 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                alpha = -Math.PI/6;
                x4 = -Math.sin(alpha)*(y2-y1)+Math.cos(alpha)*(x2-x1)+x1;
                y4 = Math.cos(alpha)*(y2-y1)+Math.sin(alpha)*(x2-x1)+y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.lineTo(x5, y5);
                context.lineTo(x4, y4);
                context.closePath();
                context.lineWidth = 2;
                context.strokeStyle = "black";
                context.fillStyle = this.color;
                context.fill()
                break;
        }
    }
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function inTriangle(x1, y1, x2, y2, x3, y3, mousePosition){
    var a = (x1 - mousePosition.x) * (y2 - y1) - (x2 - x1) * (y1 - mousePosition.y);
    var b = (x2 - mousePosition.x) * (y3 - y2) - (x3 - x2) * (y2 - mousePosition.y);
    var c = (x3 - mousePosition.x) * (y1 - y3) - (x1 - x3) * (y3 - mousePosition.y);

    if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0))
        return true;
    return false;
}

function inRectangle(xLT, yLT, xRB, yRB, mousePosition){
    if ((xLT <= mousePosition.x && mousePosition.x <= xRB)
    && (yLT <= mousePosition.y && mousePosition.y <= yRB))
        return true;
    return false;
}