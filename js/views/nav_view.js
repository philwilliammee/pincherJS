/*! nav_view - v0.0.1 - (c) 2016 Phil Williammee - licensed MIT */

//handles navigation bar events
// @TODO a lot of work has to be done here
// must import obj file, save sequence file, maybe show fullscreen
// show toolpath line, collision detection, safety limits
// add more todo here
var NavView = function () {

    this.initialize = function () {
        this.$el = $('<div/>');
    };

    this.initialize();

    this.render = function() {
        this.$el.html(this.template());
        return this;
    };
};


