"use strict";
var app = app || {};

app.Power_Up_ = function()
{
    function Power_Up_(x, y, rotation)
    {
        this.xpos = x;
        this.ypos = y;
        this.radius = 30;
        this.types = {
            0: "armour",
            1: "super_cooldown",
            2: "score_multiplier",
            3: "mega_scout_laser",
            4: "health_pick_up"
        };
        
        
        this.active = true;
    }
    var power_up_prototype = Power_Up_.prototype;
    power_up_prototype.update_power_up = function(delta_time)
    {
        //---render power up
        canvas_context.save();
        canvas_context.translate(this.xpos, this.ypos);
        canvas_context.fillStyle = "rgb(0,0,0)";
        canvas_context.beginPath();
        canvas_context.arc(0,0, this.radius, (0*Math.PI), ((2 *Math.PI)));
        canvas_context.fill();
        canvas_context.restore();
    };
    
    
    return Power_Up_;
}();