/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global log */

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
