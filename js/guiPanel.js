/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global TP, dat */

GUI = function(r){
    this.gui = new dat.GUI();
    var folder1 = this.gui.addFolder('Move Axis');
    var folder2 = this.gui.addFolder('kinematics');
    var parameters = {
            m1: 0, m2: 0, m3: 0, m4: 0, m5:0,
            doTest: r.doTest, x:0, y:0, z:0, g:0
    };    
    var m1 = folder1.add( parameters, 'm1' ).min(-314).max(314).step(1).listen();
    var m2 = folder1.add( parameters, 'm2' ).min(-314).max(314).step(1).listen();
    var m3 = folder1.add( parameters, 'm3' ).min(-314).max(314).step(1).listen();
    var m4 = folder1.add( parameters, 'm4' ).min(-314).max(314).step(1).listen();
    var m5 = folder1.add( parameters, 'm5' ).min(-314).max(314).step(1).listen();
    
    var xAxis = folder2.add( parameters, 'x' ).min(-300).max(300).step(1).listen();
    var yAxis = folder2.add( parameters, 'y' ).min(-300).max(300).step(1).listen();
    var zAxis = folder2.add( parameters, 'z' ).min(-300).max(300).step(1).listen();
    var gAngle = folder2.add( parameters, 'g' ).min(-314).max(314).step(1).listen();
    folder2.open();    

    m1.onChange(function(value){   
        r.setShoulderRoll(value/100.0);   
    });
    m2.onChange(function(value){   
        r.setShoulder(value/100.0);  
    });
    m3.onChange(function(value){   
        r.setElbow(value/100.0);   
    });
    m4.onChange(function(value){   
        r.setWrist(value/100.0);   
    });
    m5.onChange(function(value){   
        
    }); 
    
    xAxis.onChange(function(val){
        TP.x = val;
    });
    
    yAxis.onChange(function(val){
        TP.y = val;
    });
    
    zAxis.onChange(function(val){
        TP.z = val;
    });  
    
    gAngle.onChange(function(val){
        GA = val/100;
    });    
    var cubeVisible =this.gui.add( parameters, 'doTest' ).name('doTest?').listen();
    cubeVisible.onChange(function(value){
        r.doTest = value;    
    });
    
    this.gui.open();    
};

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