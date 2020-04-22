"use strict";
var app = app || {};
var canvas;
var canvas_context;

function getMouse(canvas, evt)
{
	var canvas_bounding_box = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - canvas_bounding_box.left,
        y: evt.clientY - canvas_bounding_box.top
    };
}

app.KEYBOARD = {
    "KEY_LEFT": 37,
    "KEY_UP": 38,
    "KEY_RIGHT": 39,
    "KEY_DOWN": 40,
    "KEY_SPACE": 32,
    "KEY_E": 69,
    "KEY_R": 82,
    "KEY_Q": 81
};
app.keydown = [];


window.onload = function()
{
    console.log("window has loaded");
    canvas = document.querySelector("#my_canvas");
    canvas_context = canvas.getContext('2d');
    
    
    canvas.width = 700;
    canvas.height = 700;
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    
    
    window.addEventListener("keydown", function(e)
	{
		app.keydown[e.keyCode] = true;
	});
	window.addEventListener("keyup",function(e)
	{
		app.keydown[e.keyCode] = false;
        app.Game_Class.previous_key = undefined;
	});
    
    app.Game_Class.init();
}