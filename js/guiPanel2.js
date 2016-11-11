/*! guiPanel2 - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global dat, log */
// requires dat.GUI

//Motors GUI updates the pincher arm based on ax servo motor positioning 0-1024
//This can be removed because motors are shown in Pose Editor
ax_GUI = function (service) {
    var self = this;
    this.gui = new dat.GUI();

    var parameters = {
        m1: 512, m2: 512, m3: 512, m4: 512, m5: 0
    };
    var m1 = this.gui.add(parameters, 'm1').min(0).max(1024).step(1).listen();
    var m2 = this.gui.add(parameters, 'm2').min(0).max(1024).step(1).listen();
    var m3 = this.gui.add(parameters, 'm3').min(0).max(1024).step(1).listen();
    var m4 = this.gui.add(parameters, 'm4').min(0).max(1024).step(1).listen();
    var m5 = this.gui.add(parameters, 'm5').min(0).max(1024).step(1).listen();
    this.gui.open();

    //on slider change updates the selected pose and 
    //redraws the robot with new  motorvalues
    m1.onChange(function (value) {
        poseWorker();
    });
    m2.onChange(function (value) {
        poseWorker();
    });
    m3.onChange(function (value) {
        poseWorker();
    });
    m4.onChange(function (value) {
        poseWorker();
    });

    //@todo update the grippers position
    m5.onChange(function (value) {

    });

    function poseWorker() {
        //get the slider positions
        var axArray = self.getMotorSliders();
        //update the pose with all values
        var pose = service.getActivePose();
        //var updatedPose = service.modifyActivePose(poseID);//if a pose is selected update it may want to change this to typical getpose by ID
        var updatedPose = service.setPoseFromAxs(pose, axArray);
        if (updatedPose) {
            //var rads = [updatedPose.rad1, updatedPose.rad2, updatedPose.rad3, updatedPose.rad4, updatedPose.rad5 ];

            //set the ball for testing
            service.pincher.toolPoint.position.set(updatedPose.tpX, updatedPose.tpZ, -updatedPose.tpY);

            //update the robots angles based on updated pose
            service.setAngles(updatedPose.rads);

            service.poseEditor.render();
            sendSocketData(axArray);

        } else {
            log.warning("Please select a pose");
        }

    }

    function sendSocketData(arr) {
        //$(this).parent().find("output").val($(this).val());
        if (typeof socket !== "undefined") {
            socket.send(JSON.stringify({
                "stream": "intval",
                "payload": {
                    "pk": 1, //$(this).parent().attr("data-value-id"),
                    "action": "update",
                    "data": {
                        "value": arr
                    }
                }
            }));
        }

    }

    //returns the current position values of the sliders
    this.getMotorSliders = function () {
        //convert motor sliders to TP and draw ball
        return [parameters.m1, parameters.m2, parameters.m3, parameters.m4];
    };

    //sets the slider values @TODO this should be updated 
    //when a pose is selected the sliders should be set to that pose value
    this.setMotorSliders = function (slider_array) {
        parameters.m1 = slider_array[0];
        parameters.m2 = slider_array[1];
        parameters.m3 = slider_array[2];
        parameters.m4 = slider_array[3];
        parameters.m5 = slider_array[4];
        self.gui.updateDisplay();
        //m1.updateDisplay();
    };

    this.gui.open();
};
