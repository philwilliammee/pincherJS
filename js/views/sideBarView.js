/* sideBarView.js- v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global log, TWEEN */

//handles the pose editor events
var SideBarView = function (service) {
    this.service = service;
    var parent = this;
    var editPoseModalView;
    this.initialize = function () {
        editPoseModalView = new EditPoseMdalContentView(service);
        service.poseEditor = parent;//add this to pose editor so service can update this may want to change this
        this.$el = $('<div/>');
        this.$el.on('click', '.clickable-row', this.selectRow);
        this.$el.on('dblclick', '.clickable-row', this.editRow);
        this.$el.on('click', '#add-btn', addBtnClicked);
        this.$el.on('click', '#remove-btn', removeBtnClicked);
        this.$el.on('click', '#up-btn', upBtnClicked);
        this.$el.on('click', '#down-btn', downBtnClicked);
        this.$el.on('click', '#saveModal', saveModal);
    };
    
    function saveModal(){
        console.log("save modal");
        var np = {};
        $("form#editPoseForm :input").each(function(){
            var input = $(this); 
            np[input.attr('id')] = parseInt(input.val());
        });
        //TODO add some validation
        
        console.log(np);
        service.setPoseByID(np.id, [np.m1, np.m2, np.m3, np.m4, np.m5]);
        
        //@TODO should move the robot to the active pose by setting sliders

        parent.render();
    }    

    this.render = function() {
        //this is interesting not sure why I did it like this just gets all poses and renders them
        this.$el.html(this.template( service.poses.all() ));
        $('.modal-content', this.$el).html(editPoseModalView.$el);
        return this;
    };
    
    this.getActive = function(){
        var myID = parseInt($(".active").find('th').text());
        return myID;
    };
    
    this.setActiveByID = function(myID){
        $(this).addClass('active').siblings().removeClass('active');
        $.each( service.poses.all(), function(key, val){
            var pose = val[key];
            //console.log(this);
            if (pose.id === myID){
                pose.active = "active";
            }else{
                pose.active = "";
            }
        });
        parent.render();
    };
    
    //@todo this should update the GUI when it is selected or the GUI should update this pose
    this.selectRow = function(event){
        //set the row to active
        var myPose;
        $(this).addClass('active').siblings().removeClass('active');
        var myID = parseInt($(this).prop("id"));
        //var pose = service.getPoseByID(myID);
        $.each( service.poses.all(), function(key, val){
            var pose = val[key];
            //console.log(this);
            if (pose.id === myID){
                console.log("hit "+pose.id);
                pose.active = "active";
                myPose = pose;
            }else{
                pose.active = "";
            }
        });
        /**
        if (pose){
            pose.active = "active";
            myPose = pose;
        }
        //seems like there has to be a better way to do this
        /**
        for ( var i=0; i<service.poses.length(); i++){
            if (myID === service.poses[i].id){
                service.poses[i].active = "active";
                myPose = service.poses[i];
            }else{
                service.poses[i].active = "";
            }
        }
        **/
        //get the current controller
        var ax_array = [myPose.m1, myPose.m2, myPose.m3, myPose.m4];
        var rads_array = [myPose.rad1, myPose.rad2, myPose.rad3, myPose.rad4];
        //var ik_array = service.ik.rads_2_TP(rads_array);
        var ik_array = [myPose.tpX, myPose.tpY, myPose.tpZ, myPose.tpGA];
        if ($('#gui').is(":visible")){//IK
            //update kinematics
            service.gui.setIkSliders(ik_array);
        }else if($('#ax_gui').is(":visible")){//Motors
            service.ax_gui.setMotorSliders(ax_array);
        }else if($('#rads_gui').is(":visible")){//radians   
            service.rads_gui.setRadsSliders(rads_array);
        }else{
            log.error("no GUI panels are selected");
        }
        service.setAngles(rads_array);
        
        //service.setPoseByID(myID, ax_array);
        service.pincher.toolPoint.position.set(myPose.tpX, myPose.tpZ, -myPose.tpY);
       
        
        return false;
    };
    
    function addBtnClicked(event){
        log.info("added a new pose");
        service.poses.push(new service.pose());
        parent.render();
        return false;
    };
    
    function removeBtnClicked(event){
        var myID = parseInt($(".active").find('th').text());
        service.poses = service.poses.filter(function( obj ) {
            return obj.id !== myID;
        });
        
        console.log("remove");
        parent.render();
        //this.remove();
        return false;
    };
    
    function upBtnClicked(event){
        console.log("up");
        var myID = parseInt($(".active").find('th').text());
        $(service.poses).each(function(i, el){
            if (el.id === myID){
               service.poses.move(i, --i);
               parent.render();
               return false;
            }
        });
        
        return false;
    };  
    
    function downBtnClicked(event){
        var myID = parseInt($(".active").find('th').text());
        //replace with for loop
        $(service.poses).each(function(i, el){
            if (i<service.poses.length-1 && el.id === myID){
               service.poses.move(i, ++i);
               parent.render();
            }else{
                console.log("cant move element");
            }
        });
    };  
    
    this.editRow=function(){
        var myID = parseInt($(".active").find('th').text());
        var data = service.getPoseByID(myID);
        editPoseModalView.setModalData(data);
        $('#editModal').modal('show');
    };
    
    this.initialize();
  
};

// a model to edit the json objects
//@todo add more inputs time delta ect..
var EditPoseMdalContentView = function() {
    var poseData;
    this.render = function() {
        this.$el.html(this.template(poseData));
        return this;
    };
 
    this.setModalData = function(data) {
        poseData = data;
        this.render();
    };
    
    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };
    this.initialize();

};
