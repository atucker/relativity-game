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

var gamma = 1.0;
var c = 20.0;

function contract(x, y) {
	// we need to use the ship's frame
	var xp = x - ship.x;
	var yp = y - ship.y;

	var Bx = ship.Vx / c;
	var By = ship.Vy / c;
	var B = Math.sqrt(Bx * Bx + By * By);

	var a11 = 1 + ((gamma - 1) * Bx * Bx / (B * B));
	var ad =      ((gamma - 1) * Bx * By / (B * B));
	var a22 = 1 + ((gamma - 1) * By * By / (B * B));

	var r = (x * By + y * Bx) / (B * c);
        if(B < .001) {
		a11 = 1;
		a22 = 1;
		ad = 0;

		r = 0;
	}

	//var reg = 1;// / (a11 * a22 - ad * ad);
	var coords = {
		x:  (-gamma * Bx * c + a11 * xp +  ad * yp) + ship.x,// - (1-gamma) * r / ship.Vx,//
		y:  (-gamma * By * c +  ad * xp + a22 * yp) + ship.y// - (1-gamma) * r / ship.Vy//// + ship.x,//(-gamma * c * By +  ad * xp + a22 * yp)// + ship.y
	};

	
	//$("#debug").html(Bx + ", " + By + ": " + B +  "<br />" + a11 + "," + ad + "<br />" + ad + "," + a22 + "<br/>" + "(" + xp + ", " + yp + ") --(" + gamma + ")-> (" + coords.x + ", " + coords.y + ")");

	return coords;
}

var ship = {
    circle: null,
    x: 350.0,
    y: 350.0,
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

	gamma = 1 / Math.sqrt(1 -
			      (
				      (Math.pow(this.Vx, 2) +
				       Math.pow(this.Vy, 2)) / (c * c)
			      )
			     );
	this.Vx += this.ax / gamma;
	this.Vy += this.ay / gamma;
	    

	var V = Math.sqrt(this.Vx ^ 2 + this.Vy ^ 2);
	if(V > c * .95) {
		this.Vx = c * .95 * (V / this.Vx);
		this.Vy = c * .95 * (V / this.Vy);
	}

	$("#debug").html(this.Vx);

	this.x += this.Vx;
	this.y += this.Vy;

	//var coords = contract(this.x, this.y);
	this.circle.x = this.x;
	this.circle.y = this.y;

	/*this.circle.scaleX = gamma;
	this.circle.scaleY = 1;

	this.circle.rotation = Math.atan(this.Vx / this.Vy) * 180 / Math.PI;*/
	//this.circle.transformMatrix = createjs.Matrix2D(a=2, d=2);
	//$("#debug").html(io["+y"] + " " + true + " " + this.Vy + " " + this.y + " " + gamma);
    }   
};

var asteroid1 = {
    x: 1000.0,
    y: 300.0,
    ore: 500,
    circle: null,
    update: function () {

	var coords = contract(this.x, this.y);

	//this.circle.x = coords.x;
	//this.circle.y = coords.y;

	this.circle.scaleX = 1/gamma;
	this.circle.scaleY = 1;

	this.circle.rotation = ((Math.atan(ship.Vx / -ship.Vy) * 180 / Math.PI)) + 90;

	this.ore -= this.ore * .0085 / gamma; 

	this.circle.filters[0].blueMultiplier = (500.0-this.ore) / 500.0;
	this.circle.filters[0].redMultiplier = (500.0-this.ore) / 500.0;
	//this.circle.filters[0].greenOffset = this.ore / 2;
	
	this.circle.updateCache();

	/*if (ndgmr.checkPixelCollision(this,ship,0,true)) {
	    alert("hit!");
	}*/

	if(Math.pow(this.circle.x - ship.x, 2) + Math.pow(this.circle.y - ship.y, 2) < 1300) {
	    this.x = Math.random() * 300 + 200;
	    this.y = Math.random() * 300 + 200;

	    score += this.ore;

	    this.ore = 500;
	}
    }
};

var asteroid2 = {
    x: 500.0,
    y: 400.0,
    ore: 500,
    circle: null,
    update: function () {

	var coords = contract(this.x, this.y);

	this.circle.x = coords.x;
	this.circle.y = coords.y;

	this.circle.scaleX = 1/gamma;
	this.circle.scaleY = 1;

	this.circle.rotation = ((Math.atan(ship.Vx / -ship.Vy) * 180 / Math.PI)) + 90;

	this.ore -= this.ore * .0085 / gamma; 

	this.circle.filters[0].blueMultiplier = (500.0-this.ore) / 500.0;
	this.circle.filters[0].redMultiplier = (500.0-this.ore) / 500.0;
	//this.circle.filters[0].greenOffset = this.ore / 2;
	
	this.circle.updateCache();

	if(Math.pow(this.circle.x - ship.x, 2) + Math.pow(this.circle.y - ship.y, 2) < 1300) {
	    this.x = Math.random() * 300 + 200;
	    this.y = Math.random() * 300 + 200;

	    score += this.ore;

	    this.ore = 500;
	}
    }
};

var objects = [ship];

function update() {
    ship.update(io_state);
    //asteroid1.update();
    asteroid2.update();

    //asteroid2.update();
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

    //asteroid.circle = new createjs.Bitmap("asteroid.jpg");
    /*asteroid1.circle = new createjs.Shape();
    asteroid1.circle.graphics.beginFill("#996600").drawCircle(0, 0, 20);
    asteroid1.circle.filters = [
	new createjs.ColorFilter(.1,.5,.1,1, 0,0,0,0)
    ];
    asteroid1.circle.cache(-20, -20, 100, 100);
    stage.addChild(asteroid1.circle);*/

    asteroid2.circle = new createjs.Shape();
    asteroid2.circle.graphics.beginFill("#996600").drawCircle(0, 0, 20);
    asteroid2.circle.filters = [
	new createjs.ColorFilter(.1,.5,.1,1, 0,0,0,0)
    ];
    asteroid2.circle.cache(-20, -20, 100, 100);
    stage.addChild(asteroid2.circle);

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