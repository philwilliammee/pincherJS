/*! guiPanel - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global dat */
// requires dat.GUI

//The IK GUI gets the toolpint from the slider and 
//calls service update IK to calculate and update the pincher model
//@TODO if a pose editor element is selected it should update those values
GUI = function(service){
    
    this.gui = new dat.GUI();
    var parameters = {
            m1: 471, m2: 157, m3: 0, m4: 0, m5:0,
             x:0, y:0, z:0, g:0
    };    
    var xAxis = this.gui.add( parameters, 'x' ).min(-300).max(300).step(1).listen();
    var yAxis = this.gui.add( parameters, 'y' ).min(-300).max(300).step(1).listen();
    var zAxis = this.gui.add( parameters, 'z' ).min(-340).max(340).step(1).listen();
    var gAngle = this.gui.add( parameters, 'g' ).min(0).max(628).step(1).listen();    
    
    xAxis.onChange(function(val){
        service.TP.x = val;
        service.updateIK();
    });
    
    yAxis.onChange(function(val){
        service.TP.y = val;
        service.updateIK();
    });
    
    zAxis.onChange(function(val){
        service.TP.z = val;
        service.updateIK();
    });  
    
    //@TODO add functionality for grippers
    gAngle.onChange(function(val){
        service.GA = val/100;
        service.updateIK();
    });  

    this.gui.open();   
};
