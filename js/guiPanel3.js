/*! guiPanel3 - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global TP, dat */

radsGUI = function(service){
    var r = service.pincher;
    
    this.gui = new dat.GUI();
    
    //var this.gui = this.gui.addFolder('Move Axis');
    var parameters = {
            angle1: 471, angle2: 157, angle3: 0, angle4: 0, angle5:0
    };    
    var m1 = this.gui.add( parameters, 'angle1' ).min(0).max(628).step(1).listen();
    var m2 = this.gui.add( parameters, 'angle2' ).min(0).max(628).step(1).listen();
    var m3 = this.gui.add( parameters, 'angle3' ).min(0).max(628).step(1).listen();
    var m4 = this.gui.add( parameters, 'angle4' ).min(0).max(628).step(1).listen();
    var m5 = this.gui.add( parameters, 'angle5' ).min(0).max(628).step(1).listen();

    m1.onChange(function(value){   
        r.setShoulderRoll(value/100.0); 
       var ax_array = service.radsToMotors();
        service.modifyActivePose(ax_array);//if a pose is selected update it
    });
    m2.onChange(function(value){   
        r.setShoulder(value/100.0);  
        var ax_array = service.radsToMotors();
        service.modifyActivePose(ax_array);//if a pose is selected update it        
    });
    m3.onChange(function(value){   
        r.setElbow(value/100.0);   
       var ax_array = service.radsToMotors();
        service.modifyActivePose(ax_array);//if a pose is selected update it        
    });
    m4.onChange(function(value){   
        r.setWrist(value/100.0);  
       var ax_array = service.radsToMotors();
        service.modifyActivePose(ax_array);//if a pose is selected update it        
    });
    m5.onChange(function(value){   
        
    }); 
    
    this.gui.open();    
};
