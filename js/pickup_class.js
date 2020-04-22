"use strict";
var app = app || {};

app.PickUp = function()
{
    function PickUp(xpos, ypos)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.pickup_radius = 24;
        this.timer_radius   = 36;
        this.current_timer = this.pickup_timer = 20;
        this.active = true;
        this.type = "armour_power_up";
        
        //---types: health_pickup, armour_power_up, score_multiplier, super_cooldown, and the mega_scout_laser
        //---now the mega scout laser is technically a weapon, so belongs in the bullet class?
        
        
        this.score_yield = 25;
        
        
        
        this.pickup_image = new Image();
        if(this.type == "armour_power_up")
        {
            this.pickup_image.src = "images/armor_pickup_icon.png";
        }
        if(this.type == "super_cooldown")
        {
            this.pickup_image.src = "images/super_cooldown_icon.png";
        }
        if(this.type == "score_multiplier")
        {
            this.pickup_image.src = "images/score_multiplier_icon.png";
        }
    }
    var pickup_prototype = PickUp.prototype;
    pickup_prototype.render_pickup = function()
    {
        this.current_timer -= (1/60);
        if(this.current_timer <= 0)
        {
            this.active = false;
        }
        pickup_prototype.update_timer(this.xpos, this.ypos, this.timer_radius, this.current_timer, this.pickup_timer);
        
        
        
        
        canvas_context.drawImage(this.pickup_image, this.xpos -(this.pickup_radius), this.ypos + (-(this.pickup_radius)), (this.pickup_radius * 2), (this.pickup_radius * 2));
        
        
        
        /*
        if(this.type == "armour_power_up")
        {
            canvas_context.drawImage(this.pickup_image, this.xpos -(this.pickup_radius), this.ypos + (-(this.pickup_radius)), (this.pickup_radius * 2), (this.pickup_radius * 2));
        }
        else
        {
        canvas_context.beginPath();
        canvas_context.arc(this.xpos, this.ypos, this.pickup_radius, 0, (2 * Math.PI));
        canvas_context.fillStyle = "#03eea2";
        canvas_context.fill();
        }
        */
    }
    pickup_prototype.update_timer = function(xpos, ypos, timer_radius, current_timer, pickup_timer)
    {
        canvas_context.save();
        canvas_context.translate(xpos,ypos);
        canvas_context.rotate((-90) * Math.PI/180);
        canvas_context.beginPath();
        canvas_context.arc(0, 0, timer_radius, 0, ((2 * (1 - (current_timer/pickup_timer))) *Math.PI));
        canvas_context.strokeStyle = "#03eea2";
        canvas_context.stroke();
        canvas_context.restore();
    }
    
    return PickUp;
}();