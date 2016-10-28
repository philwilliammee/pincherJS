/*! panel2View - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log */

//panel2 events this needs much more backend work
// this is basically a placeholder for backend functions to control the physical pincher
var Panel2View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '#sphereInfoButton', logJsphere);
        this.$el.on('click', '#testCollision', testCollision);
        this.$el.on('click', '#testRadLimits', testRadLimits);
        
        this.$el.on('click', '#infoButton', logAngle);
        this.$el.on('click', '#getTP', logTP);
    };
    
    function testRadLimits(){
        var coords = service.pincher.getAngles();
        console.log(coords);
        for (var rad = 0; rad<coords.length; rad++){
            ret = radLimits(coords[rad]);
            //console.log(ret);
            if (ret.e){
                console.log("error {0} {1}".format(ret.e, rad));
            }
        }        
        
    }
    
    function logJsphere(){
         var data = service.pincher.getSpheresPos();
         console.log(data);
         log.info(JSON.stringify(data));        
    }
    
    function testCollision(){
        var col = service.sphereCollision();
        if (col){
            console.log("Spere-{0} colided with Sphere-{1}".format(col.spheres[0],col.spheres[1]));
        }else{
            console.log("no collision");
        }
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
