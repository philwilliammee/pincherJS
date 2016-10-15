/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//good examples https://stemkoski.github.io/Three.js/index.html

/* global THREE */

var Pincher = function(canvasContainer){
    //console.log($(canvasContainer).width(), $(canvasContainer).height());
    var width=$(canvasContainer).width();
    var height=$( window ).height()/1.5; //$(canvasContainer).height();
    //TWEEN
    var userOpts	= {
            range		: 800,
            duration	: 2500,
            delay		: 200,
            easing		: 'Elastic.EaseInOut'
    };
    
    var parent = this;
    var joints={};
    var parts ={
        b: new THREE.Object3D(),
        sRoll: new THREE.Object3D(),
        s: new THREE.Object3D(),
        e: new THREE.Object3D(),
        w: new THREE.Object3D()
    };
    parts.b.add(parts.sRoll);
    parts.sRoll.add(parts.s);
    parts.s.add(parts.e);
    parts.e.add(parts.w);

    this.renderer; 
    this.scene; 
    this.camera; 
    this.controls;
    this.doTest = false;
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

    parent.scene.add( gridHelper );
    parent.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);  
    parent.camera.position.z = 230;
    parent.camera.position.x = 0;
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
  }       
    function createShoulder( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.shoulder = new THREE.Mesh( geometry, material );
      parts.sRoll.add(joints.shoulder);
      //scene.add( joints.shoulder );
      parent.scene.add(parts.sRoll);
    }

    function createBicep( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.elbow = new THREE.Mesh( geometry, material );
      parts.s.add(joints.elbow);
      //joints.shoulder.add(joints.elbow);
    }

    function createWrist( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.wrist = new THREE.Mesh( geometry, material );
      //joints.elbow.add(joints.wrist);
      parts.e.add( joints.wrist );
    }

     function createGripper( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.gripper = new THREE.Mesh( geometry, material );
      joints.gripper.closing = true;
      joints.gripper.pos = 0;
      parts.w.add(joints.gripper);
    }

    function createGrail( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.grail = new THREE.Mesh( geometry, material );
      parts.w.add( joints.grail );
    }

     function createRG( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.RG = new THREE.Mesh( geometry, material );
      parts.w.add( joints.RG );
    }

     function createLG( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      joints.LG = new THREE.Mesh( geometry, material );
      parts.w.add( joints.LG );   
    }    
 };
 
  this.setShoulderRoll =function( rad ){
    parts.sRoll.rotation.y = rad;
    };

     this.setShoulder =function( rad ){
        parts.s.rotation.z = rad;
    };

    this.setElbow = function( rad ){
        parts.e.translateX( 106.7 );
        parts.e.rotation.z = rad;
        parts.e.translateX( -106.7 ); 
    };

    this.setWrist = function( rad ){
        parts.w.translateX( 213.2 );
        parts.w.rotation.z = rad;
        parts.w.translateX( -213.2  );    
    };

    function setLG( rad ){
        //need to convert degrees into distance
        joints.LG.position.z = +joints.gripper.pos;
    }

    function setRG( rad ){
        //need to convert degrees into distance
        joints.RG.position.z = -joints.gripper.pos;   
    }

    this.incShoulderRoll = function( rad ){
        parts.sRoll.rotation.y += rad;
    }; 

    this.incShoulder = function( rad ){
        parts.s.rotation.z += rad;
    };

    this.incElbow = function( rad ){
        parts.e.translateX( 106.7 );
        parts.e.rotation.z += rad;
        parts.e.translateX( -106.7 );
        };

    this.incWrist = function( rad ){
        parts.w.translateX( 213.2 );
        parts.w.rotation.z += rad;
        parts.w.translateX( -213.2  );    
    };

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

     this.setAngles = function(rads){
         this.setShoulderRoll(rads[0]);
         this.setShoulder(rads[1]);
         this.setElbow(rads[2]);
         this.setWrist(rads[3]);
     };

     this.getAngles =function(){
         return [ 
            parts.sRoll.rotation.y,
            parts.s.rotation.z,
            parts.e.rotation.z,
            parts.w.rotation.z
         ];

     };

    function animate() {
      requestAnimationFrame( animate );
      //console.log(parent.radsToMotors());
      parent.controls.update();
      render();
    }

    this.test = function(){
           if( joints.shoulder && joints.elbow && joints.wrist && joints.gripper && joints.LG && joints.RG ){
            parent.incShoulderRot( .002 );       
            parent.incShoulder( .002 );
            parent.incElbow( -.002 );
            parent.incWrist( .002 );
            incGripper ( .2 ); 
        }
    };

    $( window ).resize(function(){
        console.log("resized window");
        width=$(canvasContainer).width();
        height= $( window ).height()/1.5;
      parent.camera.aspect = width / height;
      parent.camera.updateProjectionMatrix();
      parent.renderer.setSize( width, height );
      render();
    });

     init();
     animate();

 };
