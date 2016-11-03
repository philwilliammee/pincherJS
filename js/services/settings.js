
/* global Service */

//Pincher specific settings
var settings = {
    links : [0.0, 105.0, 105.0, 113.0],
    motorLimits : [[0,1023], [0,1023], [0,1023], [0,1023], [0,1023]],
    offset : [ 0.5*Math.PI, 0.5*Math.PI, 0, 0, 0]// 
};

//align the zero point of the radians to the zero point of the motors
// by rotating base 90 so zero faces back of camera
// by rotating shoulder so zero is down of camera
// this is required because camera(GL), model(IK), and calculations(motors) must all align
// these prototypes may be different for different configurations or robots
Service.prototype.applyOffset = function(radArr){
    radArr[0] = radArr[0] - 1.5708;
    radArr[1] = radArr[1] + 1.5708;
    return radArr;   
};

Service.prototype.removeOffset = function(radArr){
    radArr[0] = radArr[0] - 1.5708;
    radArr[1] = radArr[1] + 1.5708;
    return radArr;
};