/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// generate some random poses for testing 
// this could be replaced by a nice algorithm
functionalTest = function(service){
    
    service.buildMotortest = function () {
        var jLine = [];
        var numOfPoses = 10;
        console.log(numOfPoses+" random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (i = 0; i < numOfPoses ; i++) {
            /**
            var newPose = new Pose(pose_index); //new service.pose(); 
            pose_index++;
            service.poses.push(newPose);
            **/
           
            var newPose = service.poses.add();
            var testArray = [Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1, Math.floor(Math.random() * 1023) + 1];
            var pose = service.setPoseFromAxs(newPose, testArray);

            //Testing
            if (pose){
                //Testing
                jLine.push({x: pose.tpX, y: pose.tpY, z: pose.tpZ});
                
                //service.poses.push(newPose);
            }else{
                console.log("error setting pose");
            }

        }
        //update the pose editor
        service.poseEditor.render();
        //Testing: calculates linear path
        service.pincher.drawLine(jLine);
    };

    service.buildPosetest = function () {
        var jLine = [];
        var numOfPoses = 10;
        console.log(numOfPoses+" random test poses are created in pose editor panel to test the sequencer, and panel functions");
        for (var i = 0; i < numOfPoses; i++) {
            var newPose = service.poses.add(); //new service.pose(); 
            newPose.ga = 2;
            

            var testArray = [Math.floor(Math.random() * 230) - 115, Math.floor(Math.random() * 230) - 115, Math.floor(Math.random() * 230) - 115, 0];
            //convert TP to radians
            var pose = service.setPoseByTP(newPose, [testArray[0], testArray[1], testArray[2], 0]);
            //console.log(newPose);
            if (pose){
                //Testing
                jLine.push({x: pose.tpX, y: pose.tpY, z: pose.tpZ});
                
                //service.poses.push(newPose);
            }else{
                console.log("error setting pose");
            }


        }
        //update the pose editor
        service.poseEditor.render();
        //Testing: calculates linear path
        service.pincher.drawLine(jLine);
    };


};
