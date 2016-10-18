/*! pincherTween.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */


/* global TWEEN, log */

//the sequencer animates the object for positions between the pose editor
// this should also be able to eventually output a command to the robot after n TWEEN.iterations
// or just at each pose iteration
// this needs a lot of clean up
function sequencer( service ){
    var sequence = 0;
    var rads_array = [0,0,0,0];
    //tween stuff
    var curPose = [0, 0, 0, 0];
    if (service.pincher){
        curPose = service.pincher.getAngles();
    }
    //@todo properly initialize this and remove helper variables use pose objects and pincher objects
    var coords = { sroll: curPose[0], shoulder:curPose[1], elbow:curPose[2], wrist:curPose[3] };
    var moveToCoord = { sroll: 1.57, shoulder:1.57, elbow:0, wrist:0};
    //set the tween as a service object
    service.tween = new TWEEN.Tween(coords)
            .to({ sroll: moveToCoord.sroll,
                  shoulder: moveToCoord.shoulder,
                  elbow: moveToCoord.elbow,
                  wrist: moveToCoord.wrist
            }, service.timeDelta)
            //.delay(0)
            //.easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(update)
            .onComplete(function() { 
                //get the next sequence and run it
                var pose = service.poses[sequence];
                //testing
                //console.log(pose.tpX +" "+pose.tpY +" "+pose.tpZ);
                service.pincher.toolPoint.position.set(pose.tpX, pose.tpZ, -pose.tpY);
                
                var ax_array = [pose.m1, pose.m2, pose.m3, pose.m4];//should save angles of every pose when its made
                rads_array = service.motorsToRads(ax_array);//this could be rounded
                if (pose && service.poseEditor){
                    service.poseEditor.setActiveByID(pose.id);
                }else{
                    log.error("can not set active pose of "+pose.id);
                } 
                $("#sidebar").scrollTop(sequence*37);

                moveToCoord.sroll= rads_array[0];
                moveToCoord.shoulder=rads_array[1]; 
                moveToCoord.elbow=rads_array[2];
                moveToCoord.wrist=rads_array[3];

                service.tween.to({ sroll: moveToCoord.sroll,
                  shoulder: moveToCoord.shoulder,
                  elbow: moveToCoord.elbow,
                  wrist: moveToCoord.wrist
                }, service.timeDelta);
                //coords = { y: rads_array[0] };
                log.info("moving to "+  JSON.stringify(ax_array) + " seq: "+ (sequence)); 
                if (sequence < service.poses.length-1){
                    sequence++;
                }else{
                    sequence = 0;
                }                       

            });  

    function update(){//@TODO access properties directly
        service.pincher.setShoulderRoll(coords.sroll);
        service.pincher.setShoulder(coords.shoulder);
        service.pincher.setElbow(coords.elbow);
        service.pincher.setWrist(coords.wrist);
    }
    
    service.tween.chain(service.tween);

} 