/* global ik */

var container = document.getElementById( 'myCanvas' );
var GUIcontainer = document.getElementById( 'myGUI' );
var canvasContainer = document.getElementById( 'jumbotron' );
var pincher = new Pincher(canvasContainer);
var gui = new GUI(pincher);
gui.gui.domElement.id = "gui";
$("#myGUI").html($("#gui"));
ik = new IK();
container.appendChild( pincher.renderer.domElement );

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
            var ret = ik.calc_positions( TP.x, TP.y , TP.z, GA);
            //console.log(ret.rads, ret.e);
            if (!ret.e){
                pincher.setAngles(ret.rads);
            }
        }
    };
    var iter = new iterator(inc, 10);
    iter.start();
}
