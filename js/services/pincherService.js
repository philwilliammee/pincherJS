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
    
    this.getPoseByID = function(myID){
        for (var i=0; i<parent.poses.length; i++){
            if (myID === parent.poses[i].id){
                return parent.poses[i];
            }
        }
    };
    
    //this is called by MotorsGUI and rads
    this.modifyActivePose = function(ax_array){
        var poseID = parent.poseEditor.getActive();//initialized in sideBarView
        //console.log(poseID);
        if (poseID >= 0){
            return parent.setPoseByID(poseID, ax_array);
        }else{
            console.log("ERROR: can not find an active pose");
        }
    };

    //this is called by MotorsGUI and rads
    this.setPoseByID = function(poseID, ax_array){
        if (poseID >= 0){
            //set the AX values of the pose
            parent.poses[poseID].motors = ax_array;
            //get then set the radian values of the pose
            var rad_array = parent.motorsToRads(ax_array);
            parent.poses[poseID].rads = rad_array;
            //get then set the TP values of the pose this can be changed to links
            var ret = parent.ik.rads_2_TP(rad_array);
            parent.poses[poseID].TPA = ret.tp;
            //why render here
            //parent.poseEditor.render();

            return parent.poses[poseID];
        } 
    };   
    
    //this is called by MotorsGUI and rads
    this.setPoseByRads = function(pose, rad_array){
        //console.log(pose);
        if (pose){
            pose.rads= rad_array;
            var ax_array = parent.radsToMotors(rad_array);
            pose.motors = ax_array;
            //get the links
            var ret = parent.ik.rads_2_TP(rad_array);
            //set the TP
            !ret.e ? pose.TPA = ret.tp : console.log("error");

            return pose;
        }
        return true;
    };      
    
    // generate some random poses for testing 
    // this could be replaced by a nice algorithm
    
    this.buildMotortest =function(){
        var jLine = [];
        console.log("50 random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (i=0; i<10; i++){
            var newPose = new Pose(pose_index); //new parent.pose(); 
            pose_index++;
            parent.poses.push(newPose);
            var testArray=[Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  ];
            var pose = parent.setPoseByID(newPose.id, testArray);
            
            //Testing
            jLine.push({x:pose.tpX, y:pose.tpY, z:pose.tpZ});
            
           }
           //update the pose editor
           parent.poseEditor.render();
           //Testing: calculates linear path
           parent.pincher.drawLine( jLine );
    };
    
    this.buildPosetest =function(){
        var jLine = [];
        console.log("50 random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (var i=0; i<10; i++){
            var newPose = new Pose(pose_index); //new parent.pose(); 
            
            pose_index++;
            
            var testArray=[Math.floor(Math.random() * 230) - 115, Math.floor(Math.random() * 230) - 115  , Math.floor(Math.random() * 230) - 115, 0 ];
            //var testArray = [50.0, 10.0, 50.0, 0.0];
            var ret = parent.ik.calc_positions( testArray[0], testArray[1], testArray[2], testArray[3] );
            if (!ret.e){
                var pose = parent.setPoseByRads(newPose, ret.rads);

                //Testing
                jLine.push({x:pose.tpX, y:pose.tpY, z:pose.tpZ});
                parent.poses.push(newPose);
            }else{
                console.log("error calculating ",testArray);
            }
            
           }
        //update the pose editor
        parent.poseEditor.render();
        //Testing: calculates linear path
        parent.pincher.drawLine( jLine );
    };    
    
    //could this be moved to common? 
    //needs physical testing
    this.radsToMotors =function(radArray ){
        assert(radArray.length === 4);
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
