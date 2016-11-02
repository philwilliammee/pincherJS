/*! common.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */
//GLOBAL functions
    
function radLimits(rad){
    var lowLimit = 0.523599-Math.PI;//0.523599 = 30deg
    var highLimit = Math.PI-0.523599;
    var e = false;
    if (highLimit>rad && rad > lowLimit){
        return {rad:rad, e:e};
    }else if (lowLimit>rad){
        return {rad:lowLimit, e:"low limit"};
    }else if (rad>highLimit){
        return {rad:highLimit, e:"high limit"};
    }else{
        console.log("RadianLimit error");
        log.error("RadianLimit error");
    }
}  
var TWO_PI = 2*Math.PI;
function normalizeAngle(angle) {
    
    return angle - TWO_PI * Math.floor((angle + Math.PI) / TWO_PI);
    //return Math.atan2(Math.sin(angle), Math.cos(angle));
}   

//helper functions for converting ax, degrees, radians, toolpoints(Kinematics)
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

/**
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
    **/
//End of motor helper functions 

//returns the last element in an array
 //used by pose editor
Array.prototype.last = function() {
    return this[this.length-1];
};

 //moves an array element from one position to another 
 //used by pose editor
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

//this could be put in navBar or moved to its own log.js file
function Log(){
    var parent = this;
    this.displayTime = 4000;
    this.message = "test";
    this.alertType = "Sucess:";
    this.alertClass = "alert-success";
    this.info = function(msg){
        this.message = msg;
        this.alertType = "Info:";
        this.alertClass = "alert-info"; 
        doAlert();
    };
    this.sucess=function(msg){
        this.message = msg;
        this.alertType = "Sucess:";
        this.alertClass = "alert-success";
        doAlert();
    };
    this.warning = function(msg){
        this.message = msg;
        this.alertType = "Warning:";
        this.alertClass = "alert-warning";
        doAlert();
    };
    this.error=function(msg){
        this.message = msg;
        this.alertType = "Error:";
        this.alertClass = "alert-danger";
        doAlert();
    };

    function doAlert(){
        var template='<div id="alertLog" class="alert '+parent.alertClass+'" role="alert">'+
                    '<strong id="alertType">'+parent.alertType+'</strong>&nbsp;<span id="alertText">'+parent.message+'</span>'+
                '</div>';            
        $("#alert").html(template);
        $("#alert").fadeTo(parent.displayTime, 500).slideUp(500, function(){
            $("#alert").slideUp(500);
        });
    }
}    
//add a log the global scope  
var log = new Log();

function strA2intA(strA){
    var intA = [];
    for (var i=0; i<strA.length; i++){
        intA.push(parseInt(strA[i]));
    }
    return intA;
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

//returns the distance between two points
function getDistance(p1,p2){
    var xd = p2.x-p1.x;
    var yd = p2.y-p1.y;
    var zd = p2.z-p1.z;
    var distance = Math.sqrt(xd*xd + yd*yd + zd*zd);
    return distance;
}

//simple sphere collison test
function simpleSphere(p1,p2,r1,r2){
    //a test two see if two spheres are overlapping
    var dist= getDistance(p1, p2);
    if (dist <= (r1+r2)){ return true;}
    return false;
    }
    
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};   

//the map function used by arduino
function ard_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min ;
}

function between(x, min, max) {
  return x >= min && x <= max;
}