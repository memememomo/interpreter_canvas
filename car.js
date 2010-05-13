var Car = function(x, y, d) { 
    this.x = x;
    this.y = y;
    this.setDirection(d);
};


Car.direction = function(d) { 
    var direction_map = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3
    };
    return direction_map[d];
};

Car.prototype.setDirection = function(d) {
    this.d = Car.direction(d);
};

Car.prototype.rotate = function(r) {
    if (r == "left") {
	var new_r = this.d - 1;
	this.d = (new_r != -1) ? new_r : 3;
    } else if (r == "right") {
	this.d = (this.d + 1) % 4;
    }
};

Car.prototype.move = function() { 
    if (this.d == 0) {
	this.y -= 10;
    } else if (this.d == 1) {
	this.x += 10;
    } else if (this.d == 2) {
	this.y += 10;
    } else if (this.d == 3) {
	this.x -= 10;
    }
};