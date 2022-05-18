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
    constructor(id, x, y, color, label){
        this.id = id;
        this.x = (x == null) ? randomFromTo(0, canvas.width) : x;
        this.y = (y == null) ? randomFromTo(0, canvas.height) : y;
        this.color = (color == null) ? "black" : color;
        this.label = (label == null) ? new NodeLabel() : label;
        this.isSelected = false;
        this.centerX = 0;
        this.centerY = 0;
    }

    draw(){
        context.strokeStyle = "black";
        if (this.isSelected) context.lineWidth = 5;
        else context.lineWidth = 1;
        context.stroke();
    }

    drag (mousePosition){
        this.centerX = mousePosition.x;
        this.centerY = mousePosition.y;
    }

    addlabel(){
        context.font = this.label.font;
        context.fillStyle = this.label.color;
        this.label.lenght = context.measureText(this.label.content).width;
        var labelPosition = this.getLabelPosition();
        context.fillText(this.label.content, labelPosition.x, labelPosition.y);
    }

    getLabelPosition(){
        var x = 0;
        var y = 0;
        switch (this.label.position){
            case "TopLeft":
                x = this.centerX - this.width / 2 - this.label.lenght - 5;
                y = this.centerY - this.height / 2 - 5;
                break;
            case "TopCenter":
                x = this.centerX - this.label.lenght / 2;
                y = this.centerY - this.height / 2 - 5;
                break;
            case "TopRight":
                x = this.centerX + this.width / 2 + 5;
                y = this.centerY - this.height / 2 - 5;
                break;
            case "CenterLeft":
                x = this.centerX - this.width / 2 - this.label.lenght - 5;
                y = this.centerY + 5;
                break;
            case "CenterRight":
                x = this.centerX + this.width / 2 + 5;
                y = this.centerY + 5;
                break;    
            case "BottomLeft":
                x = this.centerX - this.width / 2 - this.label.lenght - 5;
                y = this.centerY + this.height / 2 + 15;
                break;
            case "BottomCenter":
                x = this.centerX - this.label.lenght / 2;
                y = this.centerY + this.height / 2 + 15;
                break;
            case "BottomRight":
                x = this.centerX + this.width / 2 + 5;
                y = this.centerY + this.height / 2 + 15;
                break;    
            
        }
        return (x, y)       
    }
}

class Rectangle extends NodeFigure{
    constructor (id, x, y, width, height, color, label){
        super(id, x, y, color, label);
        this.width = (width == null) ? randomFromTo(20, 100) : width;
        this.height = (height == null) ? randomFromTo(20, 100) : height;
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;

    }

    draw(){
        context.beginPath()
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
        this.x = mousePosition.x - this.width / 2;
        this.y = mousePosition.y - this.height / 2;
    }

    isSelect(mousePosition){
        if ((this.x <= mousePosition.x && mousePosition.x <= (this.x + this.width))
        && (this.y <= mousePosition.y && mousePosition.y <= (this.y + this.height)))
            return true;
        return false
    }
}

class Circle extends NodeFigure{
    constructor (id, x, y, width, height, color, label){
        super(id, x, y, color, label);
        this.radius = (width == null || height == null) ? randomFromTo(5, 50) : Math.max(width , height) / 2;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.centerX = this.x;
        this.centerY = this.y;
        this.x = this.x - this.radius;
        this.y = this.y - this.radius
    }

    draw(){
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, 2*Math.PI);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition){
        super.drag(mousePosition);
        this.x = this.centerX - this.radius;
        this.y = this.centerY - this.radius;
    }

    isSelect(mousePosition){
        var distanceFromCenter = Math.sqrt(Math.pow(this.centerX - mousePosition.x, 2) + Math.pow(this.centerY - mousePosition.y, 2))
        if (distanceFromCenter <= this.radius)
            return true;
        return false
    }
}

class Triangle extends NodeFigure{
    constructor (id, x, y, width, height, color, label){
        super(id, x, y, color, label);
        this.width = (width == null) ? randomFromTo(20, 100) : width;
        this.height = (height == null) ? randomFromTo(20, 100) : height;
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
    }

    draw(){
        context.beginPath();
        context.moveTo(this.x + this.width / 2, this.y);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.lineTo(this.x, this.y + this.height);
        context.lineTo(this.x + this.width / 2, this.y);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();

    }

    drag(mousePosition){
        super.drag(mousePosition);
        this.x = mousePosition.x - this.width / 2;
        this.y = mousePosition.y - this.height / 2;
    }

    isSelect(mousePosition){
        var x1 = this.x + this.width / 2;
        var y1 = this.y;
        var x2 = this.x + this.width;
        var y2 = this.y + this.height;
        var x3 = this.x;
        var y3 = this.y + this.height;

        var a = (x1 - mousePosition.x) * (y2 - y1) - (x2 - x1) * (y1 - mousePosition.y);
        var b = (x3 - mousePosition.x) * (y3 - y2) - (x3 - x2) * (y2 - mousePosition.y);
        var c = (x3 - mousePosition.x) * (y1 - y3) - (x1 - x3) * (y3 - mousePosition.y);

        if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0))
            return true;
        return false
    }
}

class Rhomb extends NodeFigure{
    constructor (id, x, y, width, height, color, label){
        super(id, x, y, color, label);
        this.width = (width == null) ? randomFromTo(20, 100) : width;
        this.height = (height == null) ? randomFromTo(20, 100) : height;
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
    }

    draw(){
        context.beginPath();
        context.moveTo(this.x + this.width / 2, this.y);
        context.lineTo(this.x + this.width, this.y + this.height / 2);
        context.lineTo(this.x + this.width / 2, this.y + this.height);
        context.lineTo(this.x, this.y + this.height / 2);
        context.lineTo(this.x + this.width / 2, this.y);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();

    }

    drag(mousePosition){
        super.drag(mousePosition);
        this.x = mousePosition.x - this.width / 2;
        this.y = mousePosition.y - this.height / 2;
    }

    isSelect(mousePosition){
        if ((this.x <= mousePosition.x && mousePosition.x <= (this.x + this.width))
        && (this.y <= mousePosition.y && mousePosition.y <= (this.y + this.height)))
            return true;
        return false
    }
}

class Figures{
    constructor(){
        this.figures = []
    }

    newNode(shape, id, x, y, wight, height, color, label){
        if (this.figures.find(f => f.if == id)) return;
        var figure;
        switch (shape){
            case "Rectangle":
                figure = new Rectangle(id, x, y, wight, height, color, label)
                break;
            case "Circle":
                figure = new Circle(id, x, y, wight, height, color, label)
                break;
            case "Triangle":
                figure = new Triangle(id, x, y, wight, height, color, label)
                break;
            case "Rhomb":
                figure = new Rhomb(id, x, y, wight, height, color, label)
                break;
        }
        this.figures.push(figure);
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
        this.figures.filter(figure => figure.constructor.name == "Edge").forEach(fig => fig.draw());
        this.figures.filter(figure => figure.constructor.name != "Edge").forEach(fig => fig.draw());

    }

    isSelectedFugure(mousePos){
        var isSelectFigure = false;
        var figure;
        for (var i = this.figures.lenght-1; i >= 0; i--){
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

class Edge{
    constructor(id, from, to, width, color, shape, arrow, label, direction){
        this.id = id;
        this.from = from;
        this.to = to;
        this.width = (width == null) ? randomFromTo(3, 10) : width;
        this.color = (color == null) ? "grey" : color;
        this.shape = (shape == null) ? "straight" : color;
        this.arrow = (arrow == null) ? "none" : color;
        this.label = (label == null) ? null : label;
        this.direction = (direction == null) ? 1 : direction;
        this.isSelected = false;
    
    }

    draw(){
        switch (this.shape){
            case "straight":
                context.beginPath();
                context.moveTo(this.from.centerX, this.from.centerY);
                context.lineTo(this.to.centerX, this.to.centerY);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke;
                break;
            case "curve":
                context.beginPath();
                context.moveTo(this.from.centerX, this.from.centerY);
                var controlX = (this.from.centerX + this.to.centerX - 100 * this.direction) / 2;
                var controlY = (this.from.centerY + this.to.centerY - 100 * this.direction) / 2;
                context.quadraticCurveTo(controlX, controlY, this.to.centerX, this.to.centerY);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke;
                break;
            case "loop":
                context.beginPath();
                var radius;
                if (this.from.constructor.name == "Circle") radius = Math.min(this.from.width / 2, this.from.height / 2, this.from.radius / 1.5);
                else radius = Math.min(this.from.width / 2, this.from.height / 2);
                context.arc(this.from.x, this.from.y, radius, 0, 2 * Math.PI)
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke;
                break;
        }
    }
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}