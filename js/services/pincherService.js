/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Array.prototype.last = function() {
    return this[this.length-1];
};

var Service = function(){
    var parent = this;
    this.poses = [];
    var pose_index = 0;
    //recieves the dom the robot goes in
    this.init = function(canvasContainer){
        var deffered = new $.Deferred();
        this.pincher = new Pincher(canvasContainer);
        //document.getElementById("myGUI").appendChild(gui);
        this.ik = new IK();
        //promise to return the rendered pincher dom
        deffered.resolve( this.pincher.renderer.domElement );

        return deffered.promise();
    };
    
    this.TP = {
        x:0,
        y:0,
        z:0
    };
    this.GA = 0;
    this.pose = function(){
        pose_index++;
        var newPose = {
            id: pose_index,
            m1: 512,
            m2: 512,
            m3: 512,
            m4: 512,
            m5: 512
        };
        return newPose;
    };
    
    this.getPoseByID = function(myID){
        for (var i=0; i<parent.poses.length; i++){
            if (myID === parent.poses[i].id){
                return parent.poses[i];
            }
        }

    };
    
    this.updatePose = function(myPose){
        for (var i=0; i<parent.poses.length; i++){
            if (parseInt(myPose.id) === parent.poses[i].id){
                //parent.poses[i] = myPose;
                parent.poses[i].m1 = parseInt(myPose.m1);
                parent.poses[i].m2 = parseInt(myPose.m2);
                parent.poses[i].m3 = parseInt(myPose.m3);
                parent.poses[i].m4 = parseInt(myPose.m4);
                parent.poses[i].m5 = parseInt(myPose.m5);
                return parent.poses[i];//testing
            }
        }
        return//not found
    };    
   
    
    function test(){
        for (i=0; i<50; i++){
            parent.poses.push(new parent.pose());
            
        }
    }
    test();
    
};
