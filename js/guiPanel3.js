/*! guiPanel3 - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global dat */
// requires dat.GUI

// Radian angle controller GUI
// similaiar to motors controller
// except it uses rotation of axis in radians
radsGUI = function (service) {
    var r = service.pincher;
    var self = this;
    this.gui = new dat.GUI();
    //define parameters
    var parameters = {
        angle1: 0, angle2: 0, angle3: 0, angle4: 0, angle5: 0
    };
    var m1 = this.gui.add(parameters, 'angle1').min(-3.14).max(3.14).step(.01).listen();
    var m2 = this.gui.add(parameters, 'angle2').min(-3.14).max(3.14).step(.01).listen();
    var m3 = this.gui.add(parameters, 'angle3').min(-3.14).max(3.14).step(.01).listen();
    var m4 = this.gui.add(parameters, 'angle4').min(-3.14).max(3.14).step(.01).listen();
    var m5 = this.gui.add(parameters, 'angle5').min(-3.14).max(3.14).step(.01).listen();

    m1.onChange(function (value) {
        
        poseWorker();
        
    });
    m2.onChange(function (value) {
        
        poseWorker();
        
    });
    m3.onChange(function (value) {
        
        poseWorker();
        
    });
    m4.onChange(function (value) {
        
        poseWorker();
        
    });

    //@TODO add grippers functionality
    m5.onChange(function (value) {

    });
    
    //editor should call set sliders first
    function poseWorker(){
        //get all of the slider values
        var rad_array = self.getRadsSliders();
        //update the robots angles based on sliders
        r.setAngles(rad_array);
        //get the curent active pose id
        var poseID = service.poseEditor.getActive();
        //get the pose by ID
        var pose = service.poses[poseID];
        //update th pose data
        var updated_pose = service.setPoseByRads(pose, rad_array);
        //set the ball for testing
        service.pincher.toolPoint.position.set(updated_pose.tpX, updated_pose.tpZ, -updated_pose.tpY);  
        
        service.poseEditor.render();
    }

    this.getRadsSliders = function () {
        return [parameters.angle1, parameters.angle2, parameters.angle3, parameters.angle4];
    };

    //sets the slider values @TODO this should be updated 
    //when a pose is selected the sliders should be set to that pose value
    this.setRadsSliders = function (slider_array) {
        parameters.angle1 = slider_array[0];
        parameters.angle2 = slider_array[1];
        parameters.angle3 = slider_array[2];
        parameters.angle4 = slider_array[3];
        //parameters.angle4 = slider_array[4];
        self.gui.updateDisplay();
        //m1.updateDisplay();
    };

    this.gui.open();
};
