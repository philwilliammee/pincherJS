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
        newPose = {};
        $("form#editPoseForm :input").each(function(){
            var input = $(this); // This is the jquery object of the input, do what you will
            newPose[input.attr('id')] = input.val();
        });
        //TODO add some validation
        service.updatePose(newPose);
        parent.render();
    }    

    this.render = function() {
        this.$el.html(this.template(service.poses));
        $('.modal-content', this.$el).html(editPoseModalView.$el);
        return this;
    };
    
    this.getActive = function(){
        var myID = parseInt($(".active").find('th').text());
        return myID;
    };
    
    this.setActiveByID = function(myID){
        $(this).addClass('active').siblings().removeClass('active');
        for ( var i=0; i<service.poses.length; i++){
            if (myID === service.poses[i].id){
                service.poses[i].active = "active";
            }else{
                service.poses[i].active = "";
            }
        }   
        parent.render();
    };
    
    this.selectRow = function(event){
        $(this).addClass('active').siblings().removeClass('active');
        var myID = parseInt($(this).prop("id"));
        for ( var i=0; i<service.poses.length; i++){
            if (myID === service.poses[i].id){
                service.poses[i].active = "active";
            }else{
                service.poses[i].active = "";
            }
        }
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
