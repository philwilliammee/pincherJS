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