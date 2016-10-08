/* global ik */

var container = document.getElementById( 'myCanvas' );
var pincher = new Pincher();
var gui = new GUI(pincher);
ik = new IK();
container.appendChild( pincher.renderer.domElement );
gui.gui.domElement.id = "myGui";

var TP = {
    x:0,
    y:0,
    z:0
};
var GA = 0;

test();
function test(){
    inc = function(){
        var angles = pincher.getAngles();
        $(angles).each(function(i){
            angles[i] += .002;
        });
        angles[2] += -.004;
        if (pincher.doTest){
            pincher.setAngles(angles);
        }else{
            var ret = ik.calc_positions( TP.x, TP.y , TP.z, GA, "TP");
            //console.log(ret.rads, ret.e);
            if (!ret.e){
                pincher.setAngles(ret.rads);
            }
        }
    };
    var iter = new iterator(inc, 10);
    iter.start();
}
