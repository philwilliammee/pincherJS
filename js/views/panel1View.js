/*! panel1View - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

//handles panel1 events and rendering
var GUI_View = function(){
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
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
    
    this.initialize();     
        
};
