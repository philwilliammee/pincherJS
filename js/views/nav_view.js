/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var NavView = function () {

    this.initialize = function () {
        this.$el = $('<div/>');
    };

    this.initialize();

    this.render = function() {
        this.$el.html(this.template());
        return this;
    };
};

function Log(){
    var parent = this;
    this.displayTime = 4000;
    this.message = "test";
    this.alertType = "Sucess:";
    this.alertClass = "alert-success";
    this.info = function(msg){
        this.message = msg;
        this.alertType = "Info:";
        this.alertClass = "alert-info"; 
        doAlert();
    };
    this.sucess=function(msg){
        this.message = msg;
        this.alertType = "Sucess:";
        this.alertClass = "alert-success";
        doAlert();
    };
    this.warning = function(msg){
        this.message = msg;
        this.alertType = "Warning:";
        this.alertClass = "alert-warning";
        doAlert();
    };
    this.error=function(msg){
        this.message = msg;
        this.alertType = "Error:";
        this.alertClass = "alert-danger";
        doAlert();
    };

    function doAlert(){
        var template='<div id="alertLog" class="alert '+parent.alertClass+'" role="alert">'+
                    '<strong id="alertType">'+parent.alertType+'</strong>&nbsp;<span id="alertText">'+parent.message+'</span>'+
                '</div>';            
        $("#alert").html(template);
        $("#alert").fadeTo(parent.displayTime, 500).slideUp(500, function(){
            $("#alert").slideUp(500);
        });   
           

    }

    this.test = function(){
        parent.warning("Test");
    };
}    
    
var log = new Log();

