/*! pincherService.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global poseID, settings, log */

//service function the main location for exchanging data between functions
//all setters and getters for all data objects should be in a service except dom objects
//@todo clean up organize and encapsulate also TP, Pose, and other functions should be more complete
// add some safety limits options
var Service = function () {
    var parent = this;
    //I really want to update this only with getters and setters make this local
    this.poses = new Poses();
    this.doCollisionDetect = false;
    this.doMotorLimits = false;
    

    //recieves the dom the robot goes in
    this.init = function (canvasContainer) {
        var deffered = new $.Deferred();
        this.pincher = new Pincher(canvasContainer, parent);
        this.ik = new IK();
        //promise to return the rendered pincher dom
        deffered.resolve(this.pincher.renderer.domElement);
        return deffered.promise();
    };

    this.getPoseByID = function (poseID) {
        
        return parent.poses.findById( poseID );

    };

    this.getActivePose = function(){
        //this actually should be name
        var poseID = parent.poseEditor.getActive();//initialized in sideBarView
        return parent.getPoseByID(poseID);
    };
    
    this.setPoseFromAxs = function(pose, ax_array){
        if (pose) {
            
            //set the AX values of the pose
            pose.motors = ax_array;
            
            //get then set the radian values of the pose
            var rad_array = parent.motorsToRads(ax_array);
            pose.rads = rad_array;
            
            //get then set the TP values of the pose this can be changed to links
            var ret = parent.rads_2_TP(rad_array, "addOffset");
            !ret.e ? pose.TPA = ret.tp : console.log("error");

            return pose;
        }else{
            console.log("ERROR: can not find an active pose");
        }
    };
    
    //this is called by MotorsGUI and rads
    this.setPoseByRads = function (pose, rad_array) {
        //console.log(pose);
        if (pose) {
            pose.rads = rad_array;
            var ax_array = parent.radsToMotors(rad_array);
            pose.motors = ax_array;
            //get the links
            var ret = parent.rads_2_TP(rad_array, "addOffset");
            //set the TP
            !ret.e ? pose.TPA = ret.tp : console.log("error");
            return pose;
        }
        return true;
    };    
    
        //this is called by MotorsGUI and rads
    this.setPoseByTP = function (pose, TPS ) {
        //tx,ty,tz,ga
        //console.log(pose);
        if (pose) {
            //set the tool points
            pose.TPA = TPS;
            var ret = parent.TP2Rads(TPS[0], TPS[1], TPS[2], TPS[3] );
            
            if (!ret.e){
                pose.rads = ret.rads;
                var ax_array = parent.radsToMotors(pose.rads);
                //console.log(ax_array);
                pose.motors = ax_array;
                return pose;                
            }else{
                //remove after debug this is usualy because tardeted position can not be reached
                console.log("error in TP2Rads");
            }
        }else{
            log.info("Please select a pose");
        }
        return false;
    }; 

    // error convertin rads to motors
    //@TODO fix this so it uses radians
    this.radsToMotors = function (radArray) {
        assert(radArray.length >= 4);
        var servoDegOffset = [180, 180, 180, 180];
        var ax_array = [];
        for (var i = 0; i < radArray.length; i++) {
            var deg = (rad_2_degree(radArray[i]));
            deg = (deg + servoDegOffset[i]);
            var ax = deg_2_ax(deg);
            //motors should be integer values
            ax = Math.round(ax);
            ax_array.push(ax);
        }
        
        return ax_array;
    };

    this.TP2Rads = function(tx,ty,tz,ga){
        var ret = parent.ik.calc_positions(tx,ty,tz,ga, "service.TP2Rads" ) ;
        ret.rads[0] = ret.rads[0] + 1.5708;
        ret.rads[1] = ret.rads[1] - 1.5708;
        return ret;
    };

    //converts motor position to radians and adds the offset
    //needs physical testing
    this.motorsToRads = function (motorArray) {
        //should assert length of motor array here
        //need to verify motors are turning in the correct direction
        // 512 ax = 180 degrees apply offset to set 512 ax to 0 deg.
        var servoRadOffset = [-3.14159, -3.14159, -3.14159, -3.14159];//the array can be removed and just apply value
        var radArray = [];
        for (var i = 0; i < motorArray.length; i++) {
            var rad = ((ax_2_rad(motorArray[i])));//may need modulo math.PI
            rad = (rad + servoRadOffset[i]);// apply offset may need modulo math.PI
            //rad=(rad+(2*Math.PI))%(2*Math.PI);
            //if (-3.14 > rad || rad > 3.18) {
            if (!between(rad, -Math.PI, Math.PI)) {
                console.log("error " + rad + " angle: "+i);
                rad = normalizeAngle(rad);
            }          

            radArray.push(rad);
        }

        return radArray;
    };

    //@todo encapsulate this in its own function
    this.timeDelta = 5000; //ms
    

    //start the tween sequence
    this.playSequence = function () {
        if (! parent.tween ){
            parent.tween = new Sequencer(this);
            parent.tween.chain(parent.tween);
            parent.tween.start();
        }else {
            parent.tween.start();
        }
        
    };
    //stop the tween sequence
    this.stopSequence = function () {
        parent.tween.stop();
        delete parent.tween;
        
    };
    
    this.pauseSequence = function(){
        parent.tween.stop();
    }

    this.sphereCollision = function () {
        var data = parent.pincher.getSpheresPos();
        var rad = parent.pincher.getSphereRadius(); //20
        var col = false;
        for (var i = 2; i < data.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (i !== j) {
                    col = simpleSphere(data[i], data[j], rad[i], rad[j]);
                    if (col) {
                        return {col: true, spheres: [i, j]};//return on first collision
                    }
                }
            }
        }
        return col;
    };
    
    

    this.setAngles = function (arr) {
        parent.pincher.setSpheresAngles( arr );
        var col = false;
        if ( parent.doCollisionDetect ){
            col = parent.sphereCollision();
        }
        
        if (col){
            //probably should delete the tween and make a new tween for smooth transitions
            // could use more error handling to find a position that works like rotate gripper to pick items close to body
            var warning = "Spere-{0} colided with Sphere-{1}".format(col.spheres[0],col.spheres[1]);
            log.warning(warning);
            return;
        }else{
            //apply any offsets before seting angles
            if (typeof parent.applyOffset === 'function') { 
              arr = parent.applyOffset(arr);
            }else{
                console.trace("warning you should apply offst in settings");
            }
            
            parent.pincher.setAngles(arr, "service.setAngles");
            
        }  
        
        if (parent.doMotorLimits){
            for (var rad in arr){
                ret = radLimits(arr[rad]);
                if (ret.e){
                    log.warning("error {0} {1}".format(ret.e, rad));
                    return;//
                }
                arr[rad] = ret.rad;
            }
        }               

    };
    
    this.getAngles = function(){
        return parent.pincher.getAngles("service.getAngles");
    };
    
    this.rads_2_TP = function(angles, caller){
        //if this is called from IK and rads do not add offset IS this correct?
        //if called from motors add offset
        if (caller === "addOffset" && typeof parent.removeOffset === 'function'){

            angles = parent.removeOffset( angles );
            
        }else{
            console.trace("no offset removed");
        }
        
        var res = parent.ik.rads_2_TP(angles, "service.Rads_2_TP");
        return res;
    };    
        
};
