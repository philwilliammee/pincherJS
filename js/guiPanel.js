/*! guiPanel - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global dat */
// requires dat.GUI

//The IK GUI gets the toolpint from the slider and 
//calls service update IK to calculate and update the pincher model
//@TODO if a pose editor element is selected it should update those values
GUI = function(service){
    var self = this;
    this.gui = new dat.GUI();
    var parameters = {
            m1: 471, m2: 157, m3: 0, m4: 0, m5:0,
             x:0, y:0, z:0, g:0
    };    
    var xAxis = this.gui.add( parameters, 'x' ).min(-300).max(300).step(1).listen();
    var yAxis = this.gui.add( parameters, 'y' ).min(-300).max(300).step(1).listen();
    var zAxis = this.gui.add( parameters, 'z' ).min(-340).max(340).step(1).listen();
    var gAngle = this.gui.add( parameters, 'g' ).min(-6.28).max(6.28).step(.001).listen();    
    
    xAxis.onChange(function(val){
        poseWorker();
    });
    
    yAxis.onChange(function(val){
        poseWorker();
    });
    
    zAxis.onChange(function(val){
        poseWorker();
    });  
    
    //@TODO add functionality for grippers
    gAngle.onChange(function(val){
        poseWorker();
    });  
    
    function poseWorker(){
        
        //get the IK and TP
        var ik_array = self.getIKSliders();
        var pose = service.getActivePose();
        // set the pose by IK
        var updated_pose = service.setPoseByTP( pose, ik_array  );
        if (updated_pose){
            //update the pincher arm
            service.setAngles(updated_pose.rads);

            //set the ball for testing using FK
            service.pincher.toolPoint.position.set(updated_pose.tpX, updated_pose.tpZ, -updated_pose.tpY);              
            //@todo for comparison actual TP

            //update the poseditor with new data
            service.poseEditor.render();
        }
        
    }    
    
        //returns the current position values of the sliders
    this.getIKSliders = function () {
        //set the ball to the toolpoint
        return [parameters.x, parameters.y, parameters.z, parameters.g];
    };
    
    //sets the slider values @TODO this should be updated 
    //when a pose is selected the sliders should be set to that pose value
    this.setIkSliders = function (slider_array) {
        parameters.x = slider_array[0];
        parameters.y = slider_array[1];
        parameters.z = slider_array[2];
        parameters.g = (slider_array[3]);
        self.gui.updateDisplay();
    };    

    this.gui.open();   
};
