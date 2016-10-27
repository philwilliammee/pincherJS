/*! pincherTween.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */


/* global TWEEN, log */

//the sequencer animates the object for positions between the pose editor
// this should also be able to eventually output a command to the robot after n TWEEN.iterations
// or just at each pose iteration
// this needs a lot of clean up
//currently only using synchronous movement of joints @TODO add linear interpolation of TP

//THIS is all wrong need calculate sequence at start check for collisions ect and then iterate through the sequence
function sequencer( service ){
    //current sequence
    var sequence = 0;
    //tween stuff
    var curPose = [0, 0, 0, 0];
    if (service.pincher){
        curPose = service.pincher.getAngles();
    }
    //@todo properly initialize this and remove helper variables use pose objects and pincher objects
    var coords = { sroll: curPose[0], shoulder:curPose[1], elbow:curPose[2], wrist:curPose[3] };
    //var moveToCoord = { sroll: 1.57, shoulder:1.57, elbow:0, wrist:0};
    //set the tween as a service object
    service.tween = new TWEEN.Tween(coords)
            .to({ sroll: 1.57,//initial coordinates
                  shoulder:1.57,
                  elbow: 0,
                  wrist: 0
            }, service.timeDelta)
            //.delay(0)
            //.easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(update)
            .onComplete(function() { 
                //get the next sequence and run it
                var pose = service.poses[sequence];
                //move the scroll bar to keep the pose in view. this could be added to pose editor
                if (pose && service.poseEditor){
                    service.poseEditor.setActiveByID(pose.id);
                }else{
                    log.error("can not set active pose of "+pose.id);
                } 
                $("#sidebar").scrollTop(sequence*37);                
                
                //set the testing tool point to 
                service.pincher.toolPoint.position.set(pose.tpX, pose.tpZ, -pose.tpY);
                
                //get the current pose angles
                var rads_array = [pose.rad1, pose.rad2, pose.rad3, pose.rad4];//posibly save/build angles of every pose when its made

                service.tween.to({ sroll: rads_array[0],
                  shoulder: rads_array[1],
                  elbow: rads_array[2],
                  wrist: rads_array[3]
                }, service.timeDelta);
                
                //log.info("moving to "+  JSON.stringify([pose.m1, pose.m2, pose.m3, pose.m4]) + " seq: "+ (sequence)); 
                if (sequence < service.poses.length-1){
                    sequence++;
                }else{
                    sequence = 0;
                }                       

            });  

    
    function update(){//@TODO access properties directly
        //var curCoords = service.pincher.getAngles();
        service.pincher.setSpheresAngles([
            coords.sroll, coords.shoulder, coords.elbow, coords.wrist
        ]);
        //this is actually the last pos because the position has not been updated yet
        var col = service.sphereCollision();
        
        if (col){
            var warning = "Spere-{0} colided with Sphere-{1}".format(col.spheres[0],col.spheres[1])
            console.log(warning);    
            log.warning(warning);
        }else{
            service.pincher.setShoulderRoll(coords.sroll);
            service.pincher.setShoulder(coords.shoulder);
            service.pincher.setElbow(coords.elbow);
            service.pincher.setWrist(coords.wrist);
        }
        
    }
    
    service.tween.chain(service.tween);

} 