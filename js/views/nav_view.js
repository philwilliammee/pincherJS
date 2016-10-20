/*! nav_view - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log */

//handles navigation bar events
// @TODO a lot of work has to be done here
// must import obj file, save sequence file, maybe show fullscreen
// show toolpath line, collision detection, safety limits
// add more todo here
var NavView = function () {

    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on("click", "#settingsCB1", cb1Clicked);
        this.$el.on("click", "#settingsCB2", cb2Clicked);
        this.$el.on("click", "#settingsCB3", cb3Clicked);
        this.$el.on("click", "#settingsCB4", cb4Clicked);
        this.$el.on("click", "#settingsCB5", cb5Clicked);
        this.$el.on("click", "#settingsCB6", cb6Clicked);
        this.$el.on("click", "#settingsCB7", cb7Clicked);
        
    };
    
    function cb1Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb1Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
        
    }
    function cb2Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb2Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }
    function cb3Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb3Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }
    function cb4Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb4Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }
    function cb5Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb5Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }   
    function cb6Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb6Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }   
    function cb7Clicked(val){
        var myChecked= $(this).is(':checked');
        
        if (myChecked){
            log.info("cb7Clicked Checked not implemented");
        }else{
            log.info("unchecked");
        }
    }   
    

    this.initialize();

    this.render = function() {
        this.$el.html(this.template());
        return this;
    };
};


