/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var HomeView = function (serviceData) {
//
//    this.initialize = function () {
//        this.$el = $('<div/>');
//    };
//
//    this.initialize();
//
//    this.render = function() {
//        this.$el.html(this.template());
//        return this;
//    };
//
//};
var GUI_View = function(service){
    this.initialize = function () {
        this.$el = $('<div/>');
    };
    this.initialize();  
    
    this.render = function() {
        this.$el.html(this.template());       
        return this;
    };
        
};
