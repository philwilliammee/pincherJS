/*! pincherService.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

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
    
    this.updateIK = function(){
        var ret = this.ik.calc_positions( this.TP.x, this.TP.y , this.TP.z, this.GA);
        //console.log(ret.rads, ret.e);
        if (!ret.e){
            this.pincher.setAngles(ret.rads);
        }
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
        return;//not found
    };    
    
    function buildPosetest(){
        for (i=0; i<50; i++){
            parent.poses.push(new parent.pose());
            
        }
    }
    buildPosetest();
    
    this.radsToMotors =function(){
       var radArray = this.pincher.getAngles();
       //should assert length of radArray here
       var servoDegOffset = [270, 90, 180, 180];
       var ax_array = [];
       for (var i=0; i<radArray.length; i++){
           var deg = ((rad_2_degree(radArray[i]))%360);
           deg = (deg + servoDegOffset[i])%360;
           var ax = deg_2_ax(deg);
           //motors should be integer values
           ax = Math.round(ax);
           ax_array.push(ax);
       };
       //console.log(ax_array); 
       //var ax_array = servo_2_angle_offset(ax_array);
       return ax_array;
   };
   
       this.motorsToRads =function(motorArray){
       //should assert length of motor array here
       //need to verify motors are turning in the correct direction
       var servoRadOffset = [-4.71239, -1.5708, -3.14159, -3.14159];
       var radArray = [];
       for (var i=0; i<motorArray.length; i++){
           var rad = ((ax_2_rad(motorArray[i])));//may need modulo math.PI
           rad = (rad + servoRadOffset[i]);// apply offset may need modulo math.PI
           radArray.push(rad);
       };
       //console.log(ax_array); 
       //var ax_array = servo_2_angle_offset(ax_array);
       return radArray;
   };
    
};
