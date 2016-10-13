/* global ik */

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
            test();
        });         
        container.appendChild( pincherDom );
        
    });   
    
    function test(){
        inc = function(){
            var angles = service.pincher.getAngles();
            $(angles).each(function(i){
                angles[i] += .002;
            });
            angles[2] += -.004;
            if (service.pincher.doTest){
                service.pincher.setAngles(angles);
            }else{
                var ret = service.ik.calc_positions( service.TP.x, service.TP.y , service.TP.z, service.GA);
                //console.log(ret.rads, ret.e);
                if (!ret.e){
                    service.pincher.setAngles(ret.rads);
                }
            }
        };
        var iter = new iterator(inc, 10);
        iter.start();
    }    

}());

