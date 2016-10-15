/*! main.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global ik, Handlebars, GUI_View, SideBarView, NavView, EditPoseMdalContentView, Panel2View */

var GUIcontainer = document.getElementById( 'myGUI' );
(function () {
    /* ---------------------------------- Local Variables ---------------------------------- */
    
    var service = new Service();
    //pass the service the dom the robot goes in "canvasContainer"
    service.init(document.getElementById( 'jumbotron' )).done(function(pincherDom){//returns the dom element with robot in it
        var container = document.getElementById( 'myCanvas' );
        //render the doms
        $("#navTemplate").load("./templates/nav.html", function(tmpl){
            NavView.prototype.template = Handlebars.compile($(tmpl).html());
            $("#navTemplate").html(new NavView().render().$el);
        }); 

        $("#sideBarTemplate").load("./templates/sideBar.html", function(tmpl){
            SideBarView.prototype.template = Handlebars.compile($("#sideBar-tpl").html());
            EditPoseMdalContentView.prototype.template = Handlebars.compile($("#editPoseModal-tpl").html());
            $("#sideBarTemplate").html(new SideBarView(service).render().$el);
        });  
        
        $("#panel1Template").load("./templates/panel1.html", function(tmpl){
            GUI_View.prototype.template = Handlebars.compile($(tmpl).html());
            $("#panel1Template").html(new GUI_View(service).render().$el);
            //@TODO this should get fixed
            this.gui = new GUI(service);
            this.gui.gui.domElement.id = "gui";
            $("#gui").detach().appendTo("#myGUI");  
            animateTest();
        });   
        
        $("#panel2Template").load("./templates/panel2.html", function(tmpl){
            Panel2View.prototype.template = Handlebars.compile($(tmpl).html());
            $("#panel2Template").html(new Panel2View(service).render().$el);
            //@TODO this should get fixed
            this.ax_gui = new ax_GUI(service);
            this.ax_gui.gui.domElement.id = "ax_gui";
            $("#ax_gui").detach().appendTo("#myGUI2");              
        });
        
        container.appendChild( pincherDom );
        
    });   
    
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

}());

