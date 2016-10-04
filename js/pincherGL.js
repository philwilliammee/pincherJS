/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//good examples https://stemkoski.github.io/Three.js/index.html

/* global THREE */

var Pincher = function(width, height){
if (!(width && height)){
    width=window.innerWidth;
    height=window.innerHeight;
}
var parent = this;
 // ElectronicArmory.com
var joints={};
var parts ={
    b: new THREE.Object3D(),
    s: new THREE.Object3D(),
    e: new THREE.Object3D(),
    w: new THREE.Object3D(),
    g: new THREE.Object3D()
};
parts.b.add(parts.s);
parts.s.add(parts.e);
parts.e.add(parts.w);
parts.w.add(parts.g);

var rads = [0,0,0,0];
var gPos = 0;
this.renderer; 
this.scene; 
this.camera; 
this.controls;
this.doTest = true;
this.gui = new dat.GUI({autoPlace : false});
//this.gui = new dat.GUI();
 function init(){
    parent.renderer = new THREE.WebGLRenderer( { antialias: false  } );
    parent.scene = new THREE.Scene();
    parent.scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );
    
    // H E L P E R S  --//
    var gridHelper = new THREE.GridHelper(400, 50);
    gridHelper.position.set( 0,-128,0 );
    
    var axes = new THREE.AxisHelper(250);
    axes.position.set(0,-128,0);
    parent.scene.add(axes);

    parameters = {
            m1: 0, m2: 0, m3: 0, m4: 0, m5:0,
            doTest: parent.doTest,
    };
        
    //gridHelper.position.z += -100;
    parent.scene.add( gridHelper );
    parent.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);  
    parent.camera.position.z = 230;
    parent.camera.position.x = 100;
    parent.camera.position.y = 0;   
    //parent.controls = new THREE.OrbitControls( parent.camera,  );
    parent.controls = new THREE.OrbitControls( parent.camera, parent.renderer.domElement );
    parent.controls.addEventListener( 'change', render );    

    // Setup the parent.renderer
    parent.renderer.setClearColor( parent.scene.fog.color, 1 );
    parent.renderer.setSize( width, height );
    
    // Add the lights
    var ambientLight = new THREE.AmbientLight(0xffffdd, .65);
    parent.scene.add(ambientLight);
    
    var light = new THREE.PointLight( 0xffffdd );
    light.position.set( 0, 100, -150 );
    parent.scene.add( light );
    
    var light2 = new THREE.DirectionalLight( 0xFFFFDD );
    light2.position.set( 0,100,150 );
    parent.scene.add( light2 );
    
    // Load the JSON files and provide callback functions (modelToScene
    var loader = new THREE.JSONLoader();
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/p2.json", createShoulder );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/p1.json", createBase );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/p3.json", createBicep );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/p4.json", createWrist );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/p5.json", createGripper );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/pRail.json", createGrail );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/pGR.json", createRG );
    loader.load( "https://cdn.rawgit.com/philwilliammee/pincherJS/ebe45e2dd8b6883c9b44578575278f2a8a1756e4/obj/pGL.json", createLG );
    
    // After loading JSON OBJ add it to the scene
    function createBase( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.base = new THREE.Mesh( geometry, material );
      parts.b.add(joints.base);
      //scene.add( joints.base );
      parent.scene.add( parts.b );
      
    var folder1 = parent.gui.addFolder('Move Axis');
    var m1 = folder1.add( parameters, 'm1' ).min(-314).max(314).step(1).listen();
    var m2 = folder1.add( parameters, 'm2' ).min(-314).max(314).step(1).listen();
    var m3 = folder1.add( parameters, 'm3' ).min(-314).max(314).step(1).listen();
    var m4 = folder1.add( parameters, 'm4' ).min(-314).max(314).step(1).listen();
    var m5 = folder1.add( parameters, 'm5' ).min(-314).max(314).step(1).listen();
    folder1.open();

    m1.onChange(function(value) 
    {   setBase(value/100.0);   });
    m2.onChange(function(value) 
    {   setShoulder(value/100.0);  });
    m3.onChange(function(value) 
    {   setElbow(value/100.0);   });
    m4.onChange(function(value) 
    {   setWrist(value/100.0);   });
    m5.onChange(function(value){   
        setLG(value/100.0);
        setRG(value/100.0);
    });    
    
    var cubeVisible =parent.gui.add( parameters, 'doTest' ).name('doTest?').listen();
    cubeVisible.onChange(function(value) 
    {   parent.doTest = value;    });
    
    parent.gui.open();       
    }

    function createShoulder( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.shoulder = new THREE.Mesh( geometry, material );
      parts.s.add(joints.shoulder);
      //scene.add( joints.shoulder );
      parent.scene.add(parts.s);
    }

    function createBicep( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.elbow = new THREE.Mesh( geometry, material );
      parts.e.add(joints.elbow);
      //joints.shoulder.add(joints.elbow);
    }

    function createWrist( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.wrist = new THREE.Mesh( geometry, material );
      //joints.elbow.add(joints.wrist);
      parts.w.add( joints.wrist );
    }

     function createGripper( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.gripper = new THREE.Mesh( geometry, material );
      joints.gripper.closing = true;
      joints.gripper.pos = 0;
      parts.g.add(joints.gripper);
    }

    function createGrail( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.grail = new THREE.Mesh( geometry, material );
      parts.g.add( joints.grail );
    }

     function createRG( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.RG = new THREE.Mesh( geometry, material );
      parts.g.add( joints.RG );
    }

     function createLG( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.LG = new THREE.Mesh( geometry, material );
      parts.g.add( joints.LG );   
    }    
 };
 
 function setBase( rad ){
    rads[0] = rad;
    parts.s.rotation.y = rads[0];
}

function setShoulder( rad ){
    rads[1] = rad;
    parts.e.rotation.z = rads[1];
}

function setElbow( rad ){
    rads[2] = rad;
    parts.w.translateX( 106.7 );
    parts.w.rotation.z = rads[2];
    parts.w.translateX( -106.7 ); 
}

function setWrist( rad ){
    rads[3] = rad;
    parts.g.translateX( 213.2 );
    parts.g.rotation.z = rads[3];
    parts.g.translateX( -213.2  );    
}

function setLG( rad ){
    //need to convert degrees into distance
    joints.LG.position.z = +joints.gripper.pos;
    
}

function setRG( rad ){
    //need to convert degrees into distance
    joints.RG.position.z = -joints.gripper.pos;   
}

function incBase( rad ){
    rads[0] += rad;
    setBase(rads[0]);
}

function incShoulder( rad ){
    rads[1] += rad;
    setShoulder( rads[1] );
}

function incElbow( rad ){
    rads[2] += rad;
    setElbow(rads[2]);
}

function incWrist( rad ){
    rads[3] -= rad;
    setWrist( rads[3] );
}

function incGripper( rad ){
    if (joints.gripper.closing){
        joints.gripper.pos -= rad;
        if (joints.gripper.pos <= -15){
            joints.gripper.closing = false;
        }
        
    }else{
        joints.gripper.pos += rad;
        if (joints.gripper.pos >= 0.0){
            joints.gripper.closing = true;
        }
    }
    joints.LG.position.z = +joints.gripper.pos;
    joints.RG.position.z = -joints.gripper.pos;
}

 var render = function () {
   parent.renderer.render(parent.scene, parent.camera);
 };
 
function animate() {
  requestAnimationFrame( animate );
   //should make sure grippers load also
   if( joints.shoulder && joints.elbow && joints.wrist && joints.gripper && joints.LG && joints.RG && parent.doTest ){
        incBase( .002 );
        incWrist( .002 );
        incElbow( -.002 );
        incShoulder( .002 );
        incGripper ( .2 ); 
    }  
  parent.controls.update();
  render();
}

function onWindowResize() {
  parent.camera.aspect = width / height;
  parent.camera.updateProjectionMatrix();
  parent.renderer.setSize( width, height );
  render();
}

 init();
 animate();
 
 };