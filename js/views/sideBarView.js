/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 //move this to common
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};


var SideBarView = function (service) {
    this.service = service;
    var parent = this;
    var editPoseModalView;
    this.initialize = function () {
        editPoseModalView = new EditPoseMdalContentView(service);
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
        console.log(newPose);
        service.updatePose(newPose);
        parent.render();
    }    

    this.render = function() {
        this.$el.html(this.template(service.poses));
        $('.modal-content', this.$el).html(editPoseModalView.$el);
        return this;
    };
    
    this.selectRow = function(event){
        $(this).addClass('active').siblings().removeClass('active');
        return false;
    };
    
    function addBtnClicked(event){
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
        $(service.poses).each(function(i, el){
            console.log(el);
            if (i<service.poses.length-1 && el.id === myID){
               service.poses.move(i, ++i);
               parent.render();
               return false;
            }else{
                console.log("cant move element");
            }
        });
        
        return false;
    };  
    
    this.editRow=function(){
        var myID = parseInt($(".active").find('th').text());
        var data = service.getPoseByID(myID);
        editPoseModalView.setModalData(data);
        $('#editModal').modal('show');
    };
    
    this.initialize();
    
};

var EditPoseMdalContentView = function(sideBarParent) {
    
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
