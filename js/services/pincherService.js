/*! pincherService.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

//service function the main location for exchanging data between functions
//all setters and getters for all data objects should be in a service except dom objects
//@todo clean up organize and encapsulate also TP, Pose, and other functions should be more complete
// add some safety limits options
var Service = function(){
    var parent = this;
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
    this.pose = function(){
        var newPose = {
            id: pose_index,
            m1: 512,
            m2: 512,
            m3: 512,
            m4: 512,
            m5: 512,
            active: ""  
        };
        pose_index++;
        return newPose;
    };
    
    this.updateIK = function(){
        // returns a ret object from IKEngine with e=error, 
        // rads = than joint angles in radians
        var ret = this.ik.calc_positions( this.TP.x, this.TP.y , this.TP.z, this.GA);
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
    
    this.modifyActivePose = function(ax_array){
        var poseID = parent.poseEditor.getActive();//initialized in sideBarView
        console.log(poseID);
        if (poseID){
            parent.poses[poseID].m1 = parseInt(ax_array[0]);
            parent.poses[poseID].m2 = parseInt(ax_array[1]);
            parent.poses[poseID].m3 = parseInt(ax_array[2]);
            parent.poses[poseID].m4 = parseInt(ax_array[3]);
            parent.poseEditor.render();
        } 
    };
    
    this.setPoseByID = function(poseID, ax_array){
        if (poseID){
            parent.poses[poseID].m1 = parseInt(ax_array[0]);
            parent.poses[poseID].m2 = parseInt(ax_array[1]);
            parent.poses[poseID].m3 = parseInt(ax_array[2]);
            parent.poses[poseID].m4 = parseInt(ax_array[3]);
        } 
    };    
    
    // generate some random poses for testing 
    // this could be replaced by a nice algorithm
    function buildPosetest(){
        console.log("50 random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (i=0; i<50; i++){
            var newPose = new parent.pose();         
            parent.poses.push(newPose);
            var testArray=[Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  ];
            parent.setPoseByID(newPose.id, testArray);
        }
    }
    buildPosetest();
    
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
   
   //converts motor position to radians and adds the offset
   //needs physical testing
    this.motorsToRads =function(motorArray){
       //problem with modify active pose when running sequence
       //parent.modifyActivePose(motorArray);//if a pose is selected update it
       //
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
