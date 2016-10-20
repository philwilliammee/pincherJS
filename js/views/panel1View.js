/*! panel1View - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

//handles panel1 events and rendering
var GUI_View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '#showIK', showIK);
        this.$el.on('click', '#showMotors', showMotors);
        this.$el.on('click', '#showRads', showRads);          
    };
    
    //@todo get the active pose and set it on pill click
    function showIK() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#radsGUI").hide();
        $("#motorsGUI").hide();
        $("#kinematicsGUI").show();
        var poseID = service.poseEditor.getActive();
        if (poseID >= 0){
            var pose = service.getPoseByID(poseID);
            service.gui.setIkSliders([ pose.tpX, pose.tpY, pose.tpZ, pose.tpGA ]);
        }
    }
    function showMotors() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#radsGUI").hide();
        $("#kinematicsGUI").hide();
        $("#motorsGUI").show();
        var poseID = service.poseEditor.getActive();
        if (poseID >= 0){
            var pose = service.getPoseByID(poseID);
            service.ax_gui.setMotorSliders([ pose.m1, pose.m2, pose.m3, pose.m4, pose.m5 ]);    
        }
    }
    function showRads() {
        $(".tabs").removeClass("active");
        $(this).addClass("active");
        $("#kinematicsGUI").hide();
        $("#motorsGUI").hide();
        $("#radsGUI").show();
        var poseID = service.poseEditor.getActive();
        if (poseID >= 0){
            var pose = service.getPoseByID(poseID);
            service.rads_gui.setRadsSliders([ pose.rad1, pose.rad2, pose.rad3, pose.rad4, pose.rad5 ]);  
        }
    }     
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
    
    this.initialize();     
        
};
