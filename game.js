var stage;
var ctx;

var score = 0;

var io_state = {
    "+y": false,
    "-y": false,
    "+x": false,
    "-x": false
};

var key_map = {
    38: "+y",
    40: "-y",
    39: "+x",
    37: "-x"
};

var ship = {
    circle: null,
    x: 350,
    y: 350,
    Vx: 0,
    Vy: 0,
    ax: 0,
    ay: 0,
    draw: function () {
	ctx.beginPath();
	ctx.arc(this.x,this.y,40,0,2*Math.PI);
	ctx.stroke();
    },
    update: function (io) {
	if(io["+x"] && io["-x"] || !(io["+x"] && io["-x"])) {this.ax = 0;}
	if(io["+y"] && io["-y"] || !(io["+y"] && io["-y"])) {this.ay = 0;}	

	if(io["+x"]) {this.ax = 1;}
	if(io["-x"]) {this.ax = -1;}
	
	if(io["+y"]) {this.ay = -1;}
	if(io["-y"]) {this.ay = 1;}

	this.Vx += this.ax;
	this.Vy += this.ay;

	this.x += this.Vx;
	this.y += this.Vy;
	
	var gamma = Math.sqrt(
	    Math.max(
		1 - (Math.pow(this.Vx, 2) + Math.pow(this.Vy, 2))/400, 
	        .05
	    )
	);

	this.circle.x = this.x;
	this.circle.y = this.y;

	/*this.circle.scaleX = gamma;
	this.circle.scaleY = 1;

	this.circle.rotation = Math.atan(this.Vx / this.Vy) * 180 / Math.PI;*/
	//this.circle.transformMatrix = createjs.Matrix2D(a=2, d=2);
	$("#debug").html(io["+y"] + " " + true + " " + this.Vy + " " + this.y + " " + gamma);
    }   
};

var asteroid = {
    x: 150,
    y: 100,
    ore: 500,
    circle: null,
    update: function () {
	var gamma = Math.sqrt(
	    Math.max(
		1 - (Math.pow(ship.Vx, 2) + Math.pow(ship.Vy, 2))/400, 
	        .05
	    )
	);

	this.circle.x = this.x;
	this.circle.y = this.y;

	this.circle.scaleX = gamma;
	this.circle.scaleY = 1;

	this.circle.rotation = ((Math.atan(ship.Vx / -ship.Vy) * 180 / Math.PI)) + 90;

	this.ore -= this.ore * .001 / gamma; 

	this.circle.filters[0].blueMultiplier = (500.0-this.ore) / 500.0;
	this.circle.filters[0].redMultiplier = (500.0-this.ore) / 500.0;
	//this.cache(this.x, this.y, 20, 20);
	//this.updateCache();

	/*if (ndgmr.checkPixelCollision(this,ship,0,true)) {
	    alert("hit!");
	}*/

	if(Math.pow(this.x - ship.x, 2) + Math.pow(this.y - ship.y, 2) < 1300) {
	    this.x = Math.random() * 680 + 10;
	    this.y = Math.random() * 680 + 10;

	    score += this.ore;

	    this.ore = 500;
	}
    }
};

var objects = [ship];

function update() {
    ship.update(io_state);
    asteroid.update();
    //ship.draw(); 

    stage.update();
    $("#score").html(score);
    //update();
    /*for (obj in objs) {
	$("#debug").html(obj['x']);
	obj.update(io_state);
	obj.draw();	
    }*/
}

function onKeyDown(evt) {
    $("#debug").html("pressed " + evt.which);
    io_state[key_map[evt.which]] = true;

    if (evt.which == 32) {
	ship.x = 350;
	ship.y = 350;
	ship.Vx = 0;
	ship.Vy = 0;
    }
}

function onKeyUp(evt) {
    $("#debug").html("released " + evt.which);
    io_state[key_map[evt.which]] = false;
}

function tick() {
    ship.update(io_state);

    // update the stage:
    stage.update();
}

function init() {
    stage = new createjs.Stage("canvas");

    var background = new createjs.Bitmap("background.jpg");
    stage.addChild(background);

    ship.circle = new createjs.Shape();
    ship.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 30);
    stage.addChild(ship.circle);

    asteroid.circle = new createjs.Shape();
    asteroid.circle.graphics.beginFill("Brown").drawCircle(0, 0, 20);
    asteroid.circle.filters = [
	new createjs.ColorFilter(1,1,1,1, 0,0,0,0)
    ];
    stage.addChild(asteroid.circle);

    /*createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = false;
    // Best Framerate targeted (60 FPS)
    createjs.Ticker.setFPS(60);*/
}

$(document).ready(
    function () {
	$("#debug").html("I'm awake!");

	//ctx = 

	init();

	$("#debug").html("About to go!");

	window.setInterval(update, 50);
    }
);

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);