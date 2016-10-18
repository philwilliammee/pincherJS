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