/*! ikEngine.js - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */
// thanks to https://maquinapensante.com/2016/01/31/simplified-inverse-kinematics-model-for-a-5-degree-of-freedom-gripper-robotic-arm-2011/
// saved on wayback machine
//modified from pyPinher2 for 3d coordinates

/* global log, settings */

//could use some wrist orbital controls
var IK = function(){
    var self = this;
    this.l12 = 0.0;                      // hypotenuse belween a1 & a3
    this.a12 = 0.0;                      // inscribed angle between hypotenuse, w 
    this.l = settings.links;   // 98.0])// an array of actual measurements of segment length in mm
    this.w = [0.0, 0.0, 0.0, 0.0]; // horizontal coordinate
    this.z = [0.0, 0.0, 0.0, 0.0]; // vertical coordinate
    this.x = [0.0, 0.0, 0.0, 0.0]; // x axis components 
    this.y = [0.0, 0.0, 0.0, 0.0]; // y axis components
    this.a = [0.0, 0.0, 0.0, 0.0]; // angle for the link, reference is previous link
    //tool points
    this.tw = 0.0;
    this.tz = 0.0;
    this.tx = 0.0;
    
    this.gripper_angle = 0.0;
    
    function calc_p2(){//calculates position 2
        self.w[3] = self.tw;
        self.z[3] = self.tz;
        self.w[2] = self.tw-Math.cos(self.gripper_angle)*self.l[3];
        self.z[2] = self.tz-Math.sin(self.gripper_angle)*self.l[3];
        self.l12 = Math.sqrt(Math.pow(self.w[2], 2)+Math.pow(self.z[2], 2)) ;
    }

    function calc_p1(){//calculate position 1
        self.a12 = Math.atan2(self.z[2],self.w[2]);//return the appropriate quadrant  
        
        var numerator = Math.pow(self.l[1], 2)+Math.pow(self.l12, 2)-Math.pow(self.l[2], 2);
        var denomenator = 2*self.l[1]*self.l12;
        
        if (denomenator===0 || numerator ===0){
            self.a[1] = self.a12;
        }else{//
            self.a[1] = Math.acos(numerator/denomenator)+self.a12;
        }
        self.w[1] = Math.cos(self.a[1])*self.l[1];
        self.z[1] = Math.sin(self.a[1])*self.l[1];
    }
    
    function calc_angles(){ //calculate all of the motor angles see diagram
        //self.a[0] is set in calc positions  
        //self.a[1] is set in calc_p1
        //self.a[2] = Math.atan((self.z[2]-self.z[1])/(self.w[2]-self.w[1]))-self.a[1]
        if ((self.w[2]-self.w[1]) === 0){
            self.a[2] =-self.a[1];
        } else{
            self.a[2] = Math.atan2((self.z[2]-self.z[1]),(self.w[2]-self.w[1]))-self.a[1];
        }
        
        self.a[3]=(self.gripper_angle -self.a[1]-self.a[2]);
    }
    function calc_x_y(){//calc x_y of servoscoordinates 
        for (i=0; i<4; i++){//fixed number of segments
            self.x[i] = self.w[i]*Math.cos(self.a[0]);
            self.y[i] = self.w[i]*Math.sin(self.a[0]);
        }
    }
             
    this.calc_positions = function( t_x, t_y, t_z, g_a, caller ){
        if (!caller){console.trace("illegal caller");}
        var error = false;
        //recieves in radians, calculates in radians, returns in degrees 
        self.gripper_angle  = g_a;
        self.tz = t_z;
        self.tx = t_x;
        self.ty = t_y;

        if (t_x === 0){
           t_x =  0.00001;
        }
        self.a[0] = Math.atan2(t_y , t_x );//radians
        self.tw = Math.sqrt((t_x*t_x) + (t_y*t_y));
        
        calc_p2();
        calc_p1();
        calc_angles();    
        calc_x_y();
        
        if (self.l12 > (self.l[1]+self.l[2])){
            log.warning("target position can not be reached");
            error = true;
        }
        /*
        rotate backwards
        a_list =  [a*b for a,b in zip(a_list,direction)] 
        mod_a = [a%360 for a in a_list]
        */
        //self.a[0] = self.a[0]+ 1.5708;
        //self.a[1] = self.a[1]-1.5708;

        return  {e:error, rads: self.a} ;
    };
    
    this.rads_2_TP = function(angles, caller){ 
        if (!caller){console.trace("illegal caller");}
        var error = false;      
        var gripper_angle = ( angles[1]+angles[2]+angles[3] ) %(2*Math.PI);//Pluse the settings.offset for angle1
        var links = self.FK(angles);
        var tp = [links.xs.last(), links.ys.last(), links.zs.last(), gripper_angle];
        return {e:error, tp:tp }; 
    };        
    //forward kinematics
    // returns the location of each joint position 
    // accepts angles in radians return dictionary of arrays
    this.FK = function(angles){      
            var last_a = 0;
            var sum_real = 0;
            var sum_img = 0;
            var x=[], y=[], z = [];
            var a0 = angles.shift();
            angles.unshift(0);
            var links = self.l;
            var adja= [];
            //walk the links
            for (var i=0; i<angles.length; i++){
                var l = links[i];
                var ca = angles[i];
                a = ca + last_a ;
                ra = a;//Math.radians(a);
                sum_real += l*Math.cos(ra);
                sum_img += l*Math.sin(ra);
                x.push(sum_real*Math.cos(a0));
                y.push(sum_real*Math.sin(a0));
                z.push(sum_img);
                adja.push(a);
                last_a = a;
            }
            //print 'Tool_point', x[-1],y[-1],z[-1]
            return {xs:x, ys:y,zs:z};
            
        };

};
