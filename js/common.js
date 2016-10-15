/*! common.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

Array.prototype.last = function() {
    return this[this.length-1];
};

 //move this to common
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function ard_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min ;
    }
    
function IK_2_servo(ax_list){
    //convert a list of servos to degrees
    var deg_list = $(ax_list).each(function(i, ax){
                        return ax_2_deg(ax);
                    });
    return deg_list;   
}

function rad_2_degree(rad){
    return rad*180/Math.PI;
}

function degree_2_rad(deg){
    return deg*Math.PI/180;
}

function ax_2_rad(ax){
    return (((ax) * 0.00511326171875)+0.523598775598) ;//convert to rads and add 30 degrees
}

function ax_2_deg(ax){
    return (((ax) * 0.29296875)+30) ;
}

function deg_2_ax(deg){;
    var ax = ((deg-30)/0.29296875);
    return ax;  
}

function servo_2_angle_offset(coord_ang){//adjust servo angles to match starting position
    //This is needed because the calculations for the IK engine give the angles in a different direction
    //and the starting values are different the gl graphics are set to mid point of servos
    new_angle = [];
    new_angle.push((coord_ang[0]-270)%360);
    new_angle.push((-coord_ang[1]-90)%360);
    new_angle.push((-coord_ang[2]-180)%360);
    new_angle.push((-coord_ang[3]-180)%360);
    new_angle.push(coord_ang[4]);
    return new_angle;
    }

//change this to TWEEN JS
//linear inerpolation aka LERP
var iterator = function(callback, iterate){
    this.iter = iterate;
    var tid;
    this.start = function(){ 
        tid = setInterval(callback, this.iter);
    };
    this.stop = function() { // to be called when you want to stop the timer
      clearInterval(tid);
    };
};

var lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};    