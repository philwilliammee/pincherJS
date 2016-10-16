/*! panel2View - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log */

//panel2 events this needs much more backend work
// this is basically a placeholder for backend functions to control the physical pincher
var Panel2View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '#infoButton', logAngle);
    };
    
    function logAngle(){
         var data = service.radsToMotors();
         console.log(data);
         log.info(JSON.stringify(data));
    }
    this.initialize();  
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
        
};
