/* runSequenceView.js- v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log, TWEEN */

//the runsequence panel working quite nicely
//@todo maybe add more tweenining options for testing like timedelta etc
//@TODO the tool path line should be updated with every new sequence start
var RunSequenceView = function (service) {
    this.service = service;
    var parent = this;
    this.initialize = function () {
        this.$el = $('<div/>');
        
        //play sequence buttons
        this.$el.on('click', '#button_play', buttonPlayPress);
        this.$el.on('click', '#button_stop', buttonStopPress);
        this.$el.on('click', '#button_fw', buttonForwardPress);
        
        //easing curve
        this.$el.on('change', '#selEasing', easingSelected);
    };
    
    //play Pose sequence controls
    var state = 'stop';

    //currently unimplemented
    function buttonBackPress() {
        console.log("button back invoked.");
    }
    //@todo this should play continuous sequences
    function buttonForwardPress() {
        console.log("button forward invoked.");
        log.info("button continous run unimplemented.");        
    }

    function buttonRewindPress() {
        console.log("button rewind invoked.");
    }
    
    function buttonFastforwardPress() {
        console.log("button fast forward invoked.");
    }
    
    //@todo this should only play one sequence 
    function buttonPlayPress() {
        var button = $("#button_play");
        if(state==='stop'){
          state='play';
          button.addClass('btn-success'); 
          button.addClass("fa-pause");  
          parent.service.playSequence();
        }
        else if(state==='play' || state==='resume'){
          state = 'pause';
          button.removeClass( "fa-pause").addClass( "fa-play"); 
          parent.service.stopSequence();
          
        }
        else if(state==='pause'){
          state = 'resume';
          button.addClass( "fa-pause");  
          parent.service.playSequence();
        }
        log.info("button play pressed, state is "+state);
    }

    function buttonStopPress(){
        state = 'stop';
        var button = $("#button_play").removeClass('btn-success');
        button.removeClass("fa-pause");
        button.addClass("fa-play");
        parent.service.stopSequence();
        console.log("button stop invoked.");    
    }
    
    function easingSelected(){
        var selected = ("TWEEN.Easing."+$(this).val());
        console.log(selected);
        service.tween.easing( eval(selected) );
    }
    
    this.render = function() {
        this.$el.html(this.template());//static element
        return this;
    };
   
    this.initialize();
  
};
