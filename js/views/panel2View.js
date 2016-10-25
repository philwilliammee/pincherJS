/*! panel2View - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log */

//panel2 events this needs much more backend work
// this is basically a placeholder for backend functions to control the physical pincher
var Panel2View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '#sphereInfoButton', logJsphere);
        this.$el.on('click', '#testCollision', testCollision);
        
        this.$el.on('click', '#infoButton', logAngle);
        this.$el.on('click', '#getTP', logTP);
    };
    
    function logJsphere(){
         var data = service.pincher.getSpheresPos();
         console.log(data);
         log.info(JSON.stringify(data));        
    }
    
    function testCollision(){
        var data = service.pincher.getSpheresPos();
        var rad = service.pincher.sphereRadius; //20
        var col = false;
        for (var i = 2; i<data.length; i++){
            for (var j = 0; j<data.length; j++){
                if ( i !== j){
                    col = simpleSphere(data[i], data[j], rad, rad );
                    if (col){
                        console.log("Spere-{0} colided with Sphere-{1}".format(i,j));
                        return col;//return on first collision
                    }
                }
            }
        }
        console.log("no collision {0}".format(JSON.stringify(data)));
        return col;
    }
    
    function logAngle(){
        //this needs update
         var data = service.radsToMotors();
         console.log(data);
         log.info(JSON.stringify(data));
    }
    
    function logTP(){
         var TP = service.radsToTP();
         var prettyTP = [];
         for (var i=0; i<TP.length; i++){
            prettyTP.push(Math.round(TP[i])); 
            //@TODO this rtounds gripper angles fix this
         }
         log.info(JSON.stringify( prettyTP ));
    }
    
    this.initialize();  
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
        
};
