/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var HomeView = function (serviceData) {
//
//    this.initialize = function () {
//        this.$el = $('<div/>');
//    };
//
//    this.initialize();
//
//    this.render = function() {
//        this.$el.html(this.template());
//        return this;
//    };
//
//};
var GUI_View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '#showIK', showIK);
        this.$el.on('click', '#showMotors', showMotors);
        this.$el.on('click', '#showRads', showRads);
    };
    
    function showIK() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#radsGUI").hide();
        $("#motorsGUI").hide();
        $("#kinematicsGUI").show();
    }
    function showMotors() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#radsGUI").hide();
        $("#kinematicsGUI").hide();
        $("#motorsGUI").show();
    }
    function showRads() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#kinematicsGUI").hide();
        $("#motorsGUI").hide();
        $("#radsGUI").show();
    }    
    this.initialize();  
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
        
};
