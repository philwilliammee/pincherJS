/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

