/*! guiPanel2 - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global dat */
// requires dat.GUI

//Motors GUI updates the pincher arm based on ax servo motor positioning 0-1024
ax_GUI = function(service){
    
    this.gui = new dat.GUI();
    
    var parameters = {
            m1: 512, m2: 512, m3: 512, m4: 512, m5:0
    };    
    var m1 = this.gui.add( parameters, 'm1' ).min(0).max(1024).step(1).listen();
    var m2 = this.gui.add( parameters, 'm2' ).min(0).max(1024).step(1).listen();
    var m3 = this.gui.add( parameters, 'm3' ).min(0).max(1024).step(1).listen();
    var m4 = this.gui.add( parameters, 'm4' ).min(0).max(1024).step(1).listen();
    var m5 = this.gui.add( parameters, 'm5' ).min(0).max(1024).step(1).listen();
    this.gui.open();    
    
    //on slider change updates the selected pose and 
    //redraws the robot with new  motorvalues
    m1.onChange(function(value){   
        var motors = getMotorSliders();
        service.modifyActivePose(motors);//if a pose is selected update it
        var rads= service.motorsToRads(motors);
        service.pincher.setAngles(rads);
    });
    m2.onChange(function(value){   
        var motors = getMotorSliders();
        service.modifyActivePose(motors);//if a pose is selected update it
        var rads= service.motorsToRads(motors);
        service.pincher.setAngles(rads);
    });
    m3.onChange(function(value){   
        var motors = getMotorSliders();
        service.modifyActivePose(motors);//if a pose is selected update it
        var rads= service.motorsToRads(motors);
        service.pincher.setAngles(rads); 
    });
    m4.onChange(function(value){   
        var motors = getMotorSliders();
        service.modifyActivePose(motors);//if a pose is selected update it
        var rads= service.motorsToRads(motors);
        service.pincher.setAngles(rads);
    });
    
    //@todo update the grippers position
    m5.onChange(function(value){   
        
    }); 
    
    //returns the current position values of the sliders
    function getMotorSliders(){
        return [parameters.m1, parameters.m2, parameters.m3, parameters.m4];
    }
    
    //sets the slider values @TODO this should be updated 
    //when a pose is selected the sliders should be set to that pose value
    this.setM1 = function(val){
        parameters.m1 = val;
        m1.updateDisplay();
    };
    
    this.gui.open();    
};
