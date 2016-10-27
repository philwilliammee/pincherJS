/*! pincherGL - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global THREE, TWEEN */
//requires TWEEN.js THREE.js and pincher arm components.JSON

//canvasContainer is the dom to render canvas in
//pincher renders the object on the screen and add setters and getters
//@TODO fix lighting
var Pincher = function(canvasContainer){
    var width=$(canvasContainer).width();
    var height=$( window ).height()/1.5; //$(canvasContainer).height();
    this.sphereRadius = 20;
    var parent = this;
    //parts and joints names should be swaped for clarity parts are really joints
    var joints={};
    
    //@ todo encapsulate this and make pretty
    // create a skeleton and spheres to mimic the robot
    // the spheres can move through collisions but the robot can not
    var jSpheres = {};
    
    var jParts = {        
        b: new THREE.Object3D(),
        sRoll: new THREE.Object3D(),
        s: new THREE.Object3D(),
        e: new THREE.Object3D(),
        w: new THREE.Object3D()
    };
    //set up linkeage
    jParts.b.add(jParts.sRoll);
    jParts.sRoll.add(jParts.s);
    jParts.s.add(jParts.e);
    jParts.e.add(jParts.w);
    
    //@todo clean up and encapsulate
    var parts ={
        b: new THREE.Object3D(),
        sRoll: new THREE.Object3D(),
        s: new THREE.Object3D(),
        e: new THREE.Object3D(),
        w: new THREE.Object3D()
    };
    //set up linkeage
    parts.b.add(parts.sRoll);
    parts.sRoll.add(parts.s);
    parts.s.add(parts.e);
    parts.e.add(parts.w);
    
    //probably can encapsulate thes in function as var
    this.renderer; 
    this.scene; 
    this.camera; 
    this.controls;
    
    //initialize the canvas
    function init(){
       var blueMaterial = new THREE.MeshLambertMaterial( { color: 0x0000ff});//, wireframe: true } );
       parent.renderer = new THREE.WebGLRenderer( { antialias: false  } );
       parent.scene = new THREE.Scene();
       parent.scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );
       parent.scene.updateMatrixWorld(true);

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
       loader.load( "./obj/p2.json", createShoulder );
       loader.load( "./obj/p1.json", createBase );
       loader.load( "./obj/p3.json", createBicep );
       loader.load( "./obj/p4.json", createWrist );
       loader.load( "./obj/p5.json", createGripper );
       loader.load( "./obj/pRail.json", createGrail );
       loader.load( "./obj/pGR.json", createRG );
       loader.load( "./obj/pGL.json", createLG );

        // After loading JSON OBJ add it to the scene
        // add the part to the joint
       function createBase( geometry, materials ) {
         var material = new THREE.MeshFaceMaterial(materials);
         joints.base = new THREE.Mesh( geometry, material );
         parts.b.add(joints.base);
         parent.scene.add( parts.b );
     }       
       function createShoulder( geometry, materials ) {
         var material = new THREE.MeshFaceMaterial(materials);
         joints.shoulder = new THREE.Mesh( geometry, material );
         
         jSpheres.sRoll = new THREE.Mesh( new THREE.SphereGeometry( parent.sphereRadius,parent.sphereRadius,parent.sphereRadius ), blueMaterial );
         jSpheres.sRoll.position.set( 0, 0, 0 );  
         jParts.sRoll.add(jSpheres.sRoll);
         parts.sRoll.add(joints.shoulder);
         //scene.add( joints.shoulder );
         parent.scene.add(parts.sRoll);
         parent.scene.add(jParts.sRoll);
       }

       function createBicep( geometry, materials ) {
         var material = new THREE.MeshFaceMaterial(materials);
         joints.elbow = new THREE.Mesh( geometry, material );
         jSpheres.e = new THREE.Mesh( new THREE.SphereGeometry( parent.sphereRadius,parent.sphereRadius,parent.sphereRadius ), blueMaterial );
         jSpheres.e.position.set( 106.7, 0, 0 );
         jParts.s.add(jSpheres.e);
         parts.s.add(joints.elbow);
       }

       function createWrist( geometry, materials ) {
         var material = new THREE.MeshFaceMaterial(materials);
         joints.wrist = new THREE.Mesh( geometry, material );
         jSpheres.w = new THREE.Mesh( new THREE.SphereGeometry( parent.sphereRadius,parent.sphereRadius,parent.sphereRadius ), blueMaterial );
         jSpheres.w.position.set( 213.2, 0, 0 );
         jParts.e.add( jSpheres.w );
         parts.e.add( joints.wrist );
       }

        function createGripper( geometry, materials ) {
         var material = new THREE.MeshFaceMaterial(materials);
         joints.gripper = new THREE.Mesh( geometry, material );
         jSpheres.tp = new THREE.Mesh( new THREE.SphereGeometry( parent.sphereRadius,parent.sphereRadius,parent.sphereRadius ), blueMaterial );
         jSpheres.tp.position.set( 323, 0, 0 );
         jParts.w.add(jSpheres.tp);
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
       
        
        parent.toolPoint = new THREE.Mesh( new THREE.SphereGeometry( 10, 10, 10 ), blueMaterial );
        parent.toolPoint.position.set( 0, 323, 0 );
        parent.scene.add( parent.toolPoint );    
        
        //parent.drawLine();
    };//end of init
    
    //angle setters
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
    
    //angle incrementers NOT USED they can be removed
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
    
    //@TODO create the proper function to convert radians into gripper distance
    //look at pyPincher2 for calculations
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
    
    //sets the joint angles by an array
     this.setAngles = function(rads){
         this.setShoulderRoll(rads[0]);
         this.setShoulder(rads[1]);
         this.setElbow(rads[2]);
         this.setWrist(rads[3]);
     };
     
     //returns an array of the current angles
     this.getAngles =function(){
         return [ 
            parts.sRoll.rotation.y,
            parts.s.rotation.z,
            parts.e.rotation.z,
            parts.w.rotation.z
         ];

     };
     
    //angle setters
    this.setSphereShoulderRoll =function( rad ){
        jParts.sRoll.rotation.y = rad;
    };

    this.setSphereShoulder =function( rad ){
        jParts.s.rotation.z = rad;
    };

    this.setSphereElbow = function( rad ){
        jParts.e.translateX( 106.7 );
        jParts.e.rotation.z = rad;
        jParts.e.translateX( -106.7 ); 
    };

    this.setSphereWrist = function( rad ){
        jParts.w.translateX( 213.2 );
        jParts.w.rotation.z = rad;
        jParts.w.translateX( -213.2  );    
    };     
     
     
     this.getSpheresPos = function(){
        //solution from http://stackoverflow.com/questions/14211627/three-js-how-to-get-position-of-a-mesh
        var spheres = [jSpheres.sRoll, jSpheres.e, jSpheres.w, jSpheres.tp];
        var retI = [];
        var retF = [];
        for (var i=0; i<spheres.length; i++){
            var position = new THREE.Vector3();
            position.setFromMatrixPosition( spheres[i].matrixWorld );
            //maybe should rotate whole sceen to align y and z
            retF.push({x:position.x, y:position.z, z:-position.y});
            retI.push({x:Math.round(position.x), y:-Math.round(position.z), z:Math.round(position.y) });
        }     
         return (retI);
     };
     
     this.setSpheresAngles = function(rads){
         this.setSphereShoulderRoll(rads[0]);
         this.setSphereShoulder(rads[1]);
         this.setSphereElbow(rads[2]);
         this.setSphereWrist(rads[3]);         
         
     };
     
     var render = function () {
       parent.renderer.render(parent.scene, parent.camera);
     };     
     
     this.drawLine = function(jLine){//json array [{x:0,y:0,z:0},...]
        //var jLine = [{x:-1000,y:0,z:0},{x:0,y:1000,z:0},{x:1000,y:0,z:0}];
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        var geometry = new THREE.Geometry();
        $(jLine).each(function(i, el){
            geometry.vertices.push(new THREE.Vector3(el.x, el.z, -el.y));
        });
        parent.line = new THREE.Line(geometry, material);
        parent.scene.add(parent.line);

     };
     
     this.hideLine = function(){
         parent.line.visable = false;
     };
     
     this.showLine = function(){
         parent.line.visable = true;
     };     
     
     
     
     //update canvas
    function animate(time) {
      requestAnimationFrame( animate );
      TWEEN.update(time);
      parent.controls.update();
      render();
    }
    
    //when the widow is resized update and render the canvas
    $( window ).resize(function(){
        //console.log("resized window");
        width=$(canvasContainer).width();
        height= $( window ).height()/1.5;//keeps the window 66% of VH to if jumbotron css changes change this also
        parent.camera.aspect = width / height;
        parent.camera.updateProjectionMatrix();
        parent.renderer.setSize( width, height );
        render();
    });

     init();
     animate();

 };
