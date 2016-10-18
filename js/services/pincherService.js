/*! pincherService.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global poseID */

//service function the main location for exchanging data between functions
//all setters and getters for all data objects should be in a service except dom objects
//@todo clean up organize and encapsulate also TP, Pose, and other functions should be more complete
// add some safety limits options
var Service = function(){
    var parent = this;
    //I really want to update this only with getters and setters make this local
    this.poses = [];
    var pose_index = 0;
    
    //recieves the dom the robot goes in
    this.init = function(canvasContainer){
        var deffered = new $.Deferred();
        this.pincher = new Pincher(canvasContainer);
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
    
    //I really want to update this only with getters and setters make this local
    this.pose = function(){
        var newPose = {
            id: pose_index,
            name: ""+pose_index,
            m1: 512,
            m2: 512,
            m3: 512,
            m4: 512,
            m5: 512,
            rad1:Math.PI,
            rad2:Math.PI,
            rad3:Math.PI,
            rad4:Math.PI,
            rad5:Math.PI,
            tpX : 0,
            tpY : 0,
            tpZ : 323,   
            tpGA : 0,
            active: "",
            error: false
        };
        pose_index++;
        return newPose;
    };
    
    /**
    this.updateIK = function(ik_array){
        // returns a ret object from IKEngine with e=error, 
        // rads = than joint angles in radians
        //this is aweful shouldnt have to set this here
        //var ret = this.ik.calc_positions( this.TP.x, this.TP.y , this.TP.z, this.GA);
        var ret = this.ik.calc_positions( ik_array[0], ik_array[1], ik_array[2], ik_array[3] );
        if (!ret.e){
            this.pincher.setAngles(ret.rads);//should you really set angles here?
            
        }else{
            console.log("targeted position can not be reached");
        }
    };
    **/
    
    this.getPoseByID = function(myID){
        for (var i=0; i<parent.poses.length; i++){
            if (myID === parent.poses[i].id){
                return parent.poses[i];
            }
        }
    };
    
    //@TODO include TP, and rads
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
    
    //this is called by MotorsGUI and rads
    this.modifyActivePose = function(ax_array){
        var poseID = parent.poseEditor.getActive();//initialized in sideBarView
        //console.log(poseID);
        if (poseID !== null || poseID != ""){
            return parent.setPoseByID(poseID, ax_array);
        }else{
            console.log("ERROR: can not find an active pose");
        }
    };

    //this is called by MotorsGUI and rads
    this.setPoseByID = function(poseID, ax_array){
        if (poseID !== null || poseID != ""){
            parent.poses[poseID].m1 = parseInt(ax_array[0]);
            parent.poses[poseID].m2 = parseInt(ax_array[1]);
            parent.poses[poseID].m3 = parseInt(ax_array[2]);
            parent.poses[poseID].m4 = parseInt(ax_array[3]);
            parent.poses[poseID].m5 = 512;
            //var rad_array = parent.pincher.getAngles();
            var rad_array = parent.motorsToRads(ax_array);
            parent.poses[poseID].rad1 = rad_array[0];
            parent.poses[poseID].rad2 = rad_array[1];
            parent.poses[poseID].rad3 = rad_array[2];
            parent.poses[poseID].rad4 = rad_array[3];  
            parent.poses[poseID].rad5 = 3.14;
            //there is an error here maybe offset needs to be reapplied!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var ret = parent.ik.rads_2_TP(rad_array);
            parent.poses[poseID].tpX =  ret.tp[0];
            parent.poses[poseID].tpY =  ret.tp[1];
            parent.poses[poseID].tpZ =  ret.tp[2];
            parent.poses[poseID].tpGA =  ret.tp[3];
            //console.log(parent.poses[poseID]);
            parent.poseEditor.render();

            return parent.poses[poseID];
        } 
    };   
    
    //this is called by MotorsGUI and rads
    this.setPoseByRads = function(pose, rad_array){
        //console.log(pose);
        if (pose !== null || pose != ""){
            pose.rad1 = rad_array[0];
            pose.rad2 = rad_array[1];
            pose.rad3 = rad_array[2];
            pose.rad4 = rad_array[3];  
            pose.rad5 = 3.14;
            var ax_array = parent.radsToMotors(rad_array);
            pose.m1 = ax_array[0];
            pose.m2 = parseInt(ax_array[1]);
            pose.m3 = parseInt(ax_array[2]);
            pose.m4 = parseInt(ax_array[3]);
            pose.m5 = 512;        
            //get the links
            var ret = parent.ik.rads_2_TP(rad_array);
            pose.tpX =  ret.tp[0];
            pose.tpY =  ret.tp[1];
            pose.tpZ =  ret.tp[2];
            pose.tpGA =  ret.tp[3];
            //console.log(pose);
            parent.poseEditor.render();

            return pose;
        }
        return true;
    };      
    
    // generate some random poses for testing 
    // this could be replaced by a nice algorithm
    this.buildPosetest =function(){
        console.log("50 random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (i=0; i<30; i++){
            var newPose = new parent.pose();         
            parent.poses.push(newPose);
            var testArray=[Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  ];
            parent.setPoseByID(newPose.id, testArray);
           }
    };
    
    //could this be moved to common? pass a rad array and return motors
    //needs physical testing
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
       //problem with modify active pose when running sequence
       return ax_array;
   };
   
    //could this be moved to common? pass a rad array and return motors
    //needs physical testing
    this.radsToTP =function(){
       var radArray = this.pincher.getAngles();
       //var servoDegOffset = [270, 90, 180, 180];
        var ret = this.ik.rads_2_TP( radArray);
        //console.log( ret );
       return ret.tp;
   };   
   
   //converts motor position to radians and adds the offset
   //needs physical testing
    this.motorsToRads =function(motorArray){
       //problem with modify active pose when running sequence
       //parent.modifyActivePose(motorArray);//if a pose is selected update it
       //
       //should assert length of motor array here
       //need to verify motors are turning in the correct direction
       
       //error here maybe this should only return positive radians
       //var servoRadOffset = [-4.71239, -1.5708, -3.14159, -3.14159];
       var servoRadOffset = [-4.71239, -1.5708, -3.14159, -3.14159];
       
       var radArray = [];
       for (var i=0; i<motorArray.length; i++){
           var rad = ((ax_2_rad(motorArray[i])));//may need modulo math.PI
           rad = (rad + servoRadOffset[i]);// apply offset may need modulo math.PI
           //rad=(rad+(2*Math.PI))%(2*Math.PI);
           
           if (0>rad>6.28){
               console.log("error "+rad);
               rad=rad%(2*Math.PI);
           }
           
           radArray.push(rad);
       };

       return radArray;
   };
    
    //@todo encapsulate this in its own function
    this.timeDelta = 5000; //ms
    sequencer( this );
    
    //start the tween sequence
    this.playSequence = function(){
        parent.tween.start();  
    };
    //stop the tween sequence
    this.stopSequence = function(){
        parent.tween.stop();  
    };  
    
};
