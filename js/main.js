/*! main.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

/* global ik, Handlebars, GUI_View, SideBarView, NavView, EditPoseMdalContentView, Panel2View, RunSequenceView */

//build all of the panel elements in the main html page
(function () {
    /* ---------------------------------- Local Variables ---------------------------------- */ 
    var service = new Service();
    //pass the service the dom the robot goes in "canvasContainer"
    //service returns the dom element with robot in it "pincherDom"
    service.init(document.getElementById( 'jumbotron' )).done(function(pincherDom){
        
        var container = document.getElementById( 'myCanvas' );
        container.appendChild( pincherDom );
        //render the doms
        $("#navTemplate").load("./templates/nav.html", function(tmpl){
            NavView.prototype.template = Handlebars.compile($("#navbar-tpl").html());
            $("#navTemplate").html(new NavView().render().$el);
        }); 

        $("#sideBarTemplate").load("./templates/sideBar.html", function(tmpl){
            SideBarView.prototype.template = Handlebars.compile($("#sideBar-tpl").html());
            EditPoseMdalContentView.prototype.template = Handlebars.compile($("#editPoseModal-tpl").html());
            $("#sideBarTemplate").html(new SideBarView(service).render().$el);
        });  
        
        $("#runSequenceTemplate").load("./templates/runSequencePanel.html", function(tmpl){
            RunSequenceView.prototype.template = Handlebars.compile($("#runSequence-tpl").html());
            $("#runSequenceTemplate").html(new RunSequenceView(service).render().$el);
        });         
        
        $("#panel1Template").load("./templates/panel1.html", function(tmpl){
            GUI_View.prototype.template = Handlebars.compile($("#panel1-tpl").html());
            $("#panel1Template").html(new GUI_View(service).render().$el);
            //@ todo render GUI inside panel1View 
            //build and attach the IK controller GUI
            this.gui = new GUI(service);
            this.gui.gui.domElement.id = "gui";
            $("#gui").addClass("gui");
            $("#gui").detach().appendTo("#kinematicsGUI");  
            //build and attach the Motors controller GUI 
            this.ax_gui = new ax_GUI(service);
            this.ax_gui.gui.domElement.id = "ax_gui";
            $("#ax_gui").addClass("gui");
            $("#ax_gui").detach().appendTo("#motorsGUI");    
            //build and attach the Radian controller GUI
            this.rads_gui = new radsGUI(service);
            this.rads_gui.gui.domElement.id = "rads_gui";
            $("#rads_gui").addClass("gui");
            $("#rads_gui").detach().appendTo("#radsGUI");   

        });   
        
        $("#panel2Template").load("./templates/panel2.html", function(tmpl){
            Panel2View.prototype.template = Handlebars.compile($("#panel2-tpl").html());
            $("#panel2Template").html(new Panel2View(service).render().$el);        
        });
        
    });    

}());

