/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Pose = function(pose_index){
    var newPose = {
        id: pose_index,
        name: ""+pose_index,
        m1: 512,
        m2: 512,
        m3: 512,
        m4: 512,
        m5: 512,
        get motors(){
            return [m1,m2,m3,m4,m5];
        },
        set motors (motors){
           
            //assert limits between o and 1024
            for (var i=0; i<motors.length; i++){
                /**
                if (!between(motors[i], 0, 1024)){
                    console.log("motor[{1}] = {0} is not between 0, 1024".format(motors[i], i));
                }
                **/
                assert(typeof motors[i] !== "string");
            }
            this.m1 = motors[0];
            this.m2 = motors[1];
            this.m3 = motors[2];
            this.m4 = motors[3];
            if (motors.length > 4){
                this.m5 = motors[4];
            }
        },
        get motorsD(){
            return {m1:this.m1,m2:this.m2,m3:this.m3,m4:this.m4,m5:this.m5};
        },
        set motorsD (mD){
            assert(typeof motors[0] !== "string");
            this.m1 = mD.m1;
            this.m2 = mD.m2;
            this.m3 = mD.m3;
            this.m4 = mD.m4;
            if (mD.m1 ){
                this.m5 = mD.m5;
            }
        },        
        rad1: Math.PI,
        rad2: Math.PI,
        rad3: Math.PI,
        rad4: Math.PI,
        rad5: Math.PI,
        get rads(){
            return [this.rad1,this.rad2,this.rad3,this.rad4,this.rad5];
        },
        set rads (rads){
            assert(typeof rads[0] === "number"); //remove asserts later
            this.rad1 = normalizeAngle(rads[0]); //probably will want to normalize all of the rads
            this.rad2 = (rads[1]);
            this.rad3 = (rads[2]);
            this.rad4 = (rads[3]);
            if (rads.length > 4){
                this.rad5 = (rads[4]);
            }
        },        
        tpX : 0,
        tpY : 0,
        tpZ : 323,   
        tpGA : 0,
        get TPA(){
            return [tpX,tpY,tpZ,tpGA];
        },
        set TPA (tps){//set TP by array
            assert(typeof tps[0] === "number");
            this.tpX = tps[0];
            this.tpY = tps[1];
            this.tpZ = tps[2];
            if (tps.length > 3 ){
                //console.trace("setting tp Arr {0}".format(tps[3]));
                this.tpGA = tps[3];
            }
        },
        get TPD(){
            return {x:tpX,y:tpY, tpZ:z, ga:tpGA};
        },
        set TPD (tps_d){//set TP by dictionary object
            assert(typeof tps_d.x === "number");
            this.tpX = tps_d.x;
            this.tpY = tps_d.y;
            this.tpZ = tps_d.z;
            if(tps_d.ga){
                console.log("setting TP dict {0}".format(tps_d.ga));
                this.tpGA = tps_d.ga;
            }
        },        
        active: "",
        error: false
    };
    //pose_index++; this must be set in the function that builds it ie Poses
    return newPose;
};