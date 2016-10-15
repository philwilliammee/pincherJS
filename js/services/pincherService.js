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
    
    function buildPosetest(){
        for (i=0; i<50; i++){
            var newPose = new parent.pose();         
            parent.poses.push(newPose);
            var testArray=[Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  , Math.floor(Math.random() * 1023) + 1  ]
            parent.setPoseByID(newPose.id, testArray)
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
       //problem with modify active pose when running sequence
       return ax_array;
   };
   
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
   
    //this should be called do IK
    
    inc = function(){
        var angles = parent.pincher.getAngles();
        $(angles).each(function(i){
            angles[i] += .002;
        });
        angles[2] += -.004;
        parent.pincher.setAngles(angles);
    };
    
    function sequencer( iterate){
        var sequence = 0;
        this.iter = iterate;
        var tid;
        var iter = 0;
        var nextPose;
        var lastPose ;
        sequencer.start = function(){ 
            tid = setInterval(function(){
                if (iter >= 100){
                    var pose = parent.poses[sequence];
                    parent.poseEditor.setActiveByID(pose.id);

                    $("#sidebar").scrollTop(sequence*37);
                    console.log(sequence);
                    //var ax_array = [pose.m1, pose.m2, pose.m3, pose.m4];//should save angles of every pose when its made
                    //var rads_array = parent.motorsToRads(ax_array);
                    //console.log(JSON.stringify(rads_array));
                    //parent.pincher.setAngles(rads_array);               
                    if (sequence < parent.poses.length-1){
                        sequence++;
                    }else{
                        
                        sequence = 0;
                    }
                    iter = 0;
                    
                }else{//interpolate
                    var curPose = parent.pincher.getAngles();
                    //console.log(curPose);
                    if (!curPose){
                        curPose = [0,0,0,0];
                    }
                    var pose = parent.poses[sequence];
                    var ax_array = [pose.m1, pose.m2, pose.m3, pose.m4];//should save angles of every pose when its made
                    var rads_array = parent.motorsToRads(ax_array);
                    //console.log(rads_array);
                    var myLerp = [];
                    for (var i=0; i<rads_array.length; i++){
                        var l = lerp(curPose[i], rads_array[i], iter*.0008 );
                        myLerp.push(l);
                    }
                    //console.log(myLerp);
                    if (myLerp.length > 2){
                        parent.pincher.setAngles(myLerp);    
                    }
                    iter++;
                    
                }
            }, 100);
        };
        sequencer.stop = function() { // to be called when you want to stop the timer
          clearInterval(tid);
        };
    };     
    
    sequences = function(){
        //var angles = parent.pincher.getAngles();
        $(parent.poses).each(function(i, pose){
            pose.active="active";
            var ax_array = [pose.m1, pose.m2, pose.m3, pose.m4];//should save angles of every pose when its made
            
            parent.poseEditor.setActiveByID(pose.id);//initialized in sideBarView
            //@TODO FIX it not convert here
            var rads_array = parent.motorsToRads(ax_array);
            console.log(JSON.stringify(rads_array));
            parent.pincher.setAngles(rads_array);
            pose.active="";
        });

        //parent.pincher.setAngles(angles);
    }; 
    
    this.timeDelta = 1000;
    sequencer(this.timeDelta);
    this.playSequence = function(){
        sequencer.start();
    };

    this.stopSequence = function(){
        sequencer.stop(); //or do not: parent.pincher.setAngles(angles);
    };   
    
};
