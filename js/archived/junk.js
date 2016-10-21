/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

    //this should be called do IK
    function animateTest(){
        inc = function(){
            var angles = service.pincher.getAngles();
            $(angles).each(function(i){
                angles[i] += .002;
            });
            angles[2] += -.004;
            if (service.pincher.doTest){
                service.pincher.setAngles(angles);
            }
        };
        var iter = new iterator(inc, 10);
        iter.start();
    } 
    
        this.oldSetPoseByID = function(poseID, ax_array){
        if (poseID){
            parent.poses[poseID].m1 = parseInt(ax_array[0]);
            parent.poses[poseID].m2 = parseInt(ax_array[1]);
            parent.poses[poseID].m3 = parseInt(ax_array[2]);
            parent.poses[poseID].m4 = parseInt(ax_array[3]);
        } 
    };  
    
    /**
    parent.poses[poseID].m1 = parseInt(ax_array[0]);
    parent.poses[poseID].m2 = parseInt(ax_array[1]);
    parent.poses[poseID].m3 = parseInt(ax_array[2]);
    parent.poses[poseID].m4 = parseInt(ax_array[3]);
    //var rad_array = parent.pincher.getAngles();
    var rad_array = parent.motorsToRads(ax_array);
    parent.poses[poseID].rad1 = rad_array[0];
    parent.poses[poseID].rad2 = rad_array[1];
    parent.poses[poseID].rad3 = rad_array[2];
    parent.poses[poseID].rad4 = rad_array[3];  
    var ret = parent.ik.rads_2_TP(rad_array);
    if (ret.e){
        console.log("error");
        parent.poses[poseID].error = "targeted position can not be reached";
        parent.poses[poseID].tpX =  1;
        parent.poses[poseID].tpY =  1;
        parent.poses[poseID].tpZ =  1;
        parent.poses[poseID].tpGA =  1;            

    }else{
        parent.poses[poseID].tpX =  ret.tp[0];
        parent.poses[poseID].tpY =  ret.tp[1];
        parent.poses[poseID].tpZ =  ret.tp[2];
        parent.poses[poseID].tpGA =  ret.tp[3];
    }
    //console.log(parent.poses[poseID]);
    parent.poseEditor.render();
    return parent.poses[poseID];
    **/    
   
       //I really want to update this only with getters and setters make this local
    /**
    this.pose = function(){
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
                this.m1 = motors[0];
                this.m1 = motors[1];
                this.m1 = motors[2];
                this.m1 = motors[3];
                this.m1 = motors[4];
            }
            rad1: Math.PI,
            rad2: Math.PI,
            rad3: Math.PI,
            rad4: Math.PI,
            rad5: Math.PI,
            tpX : 0,
            tpY : 0,
            tpZ : 323,   
            tpGA : 0,
            active: "",
            error: false
        };
        pose_index++;
        return newPose;
    };
    **/

    
    /**
    this.updateIK = function(ik_array){
        // returns a ret object from IKEngine with e=error, 
        // rads = than joint angles in radians
        //this is aweful shouldnt have to set this here
        //var ret = this.ik.calc_positions( this.TP.x, this.TP.y , this.TP.z, this.GA);
        var ret = this.ik.calc_positions( ik_array[0], ik_array[1], ik_array[2], ik_array[3] );
        if (!ret.e){
            this.pincher.setAngles(ret.rads);//should you really set angles here?
            
        }else{
            console.log("targeted position can not be reached");
        }
    };
    **/
   
       this.TP = {
        x:0,
        y:0,
        z:0
    };
    this.GA = 0;
    
        /**
    //@TODO include TP, and rads
    this.updatePose = function(myPose){
        assert(typeof myPose.id === "integer");
        for (var i=0; i<parent.poses.length; i++){
            if (myPose.id === parent.poses[i].id){
                //parent.poses[i] = myPose;
                parent.poses[i].M
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
    **/