/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//good examples https://stemkoski.github.io/Three.js/index.html

function old_sequencer( iterate){
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

    this.test = function(){
           if( joints.shoulder && joints.elbow && joints.wrist && joints.gripper && joints.LG && joints.RG ){
            parent.incShoulderRot( .002 );       
            parent.incShoulder( .002 );
            parent.incElbow( -.002 );
            parent.incWrist( .002 );
            incGripper ( .2 ); 
        }
    };
    
//cuurently unused changed this to TWEEN JS
//linear inerpolation aka LERP
var iterator = function(callback, iterate){
    this.iter = iterate;
    var tid;
    this.start = function(){ 
        tid = setInterval(callback, this.iter);
    };
    this.stop = function() { // to be called when you want to stop the timer
      clearInterval(tid);
    };
};

//currently unused linear interpolation replaced by tween
var lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};     

    //used for testing 
    inc = function(){
        var angles = parent.pincher.getAngles();
        $(angles).each(function(i){
            angles[i] += .002;
        });
        angles[2] += -.004;
        parent.pincher.setAngles(angles);
    };