"use strict";
var app = app || {};

app.Bullet_ = function()
{
    function Bullet_(current_player_weapon, x, y, rotation)
    {
        this.type = current_player_weapon;
        this.xpos = x;
        this.ypos = y;
        this.current_rotation = rotation;
        
        if(this.type == "multi-shot")
        {
            this.width = 7;
            this.height = 15;
            this.speed = 620;
        }
        if(this.type == "standard-shot")
        {
            this.width = 7;
            this.height = 35;
            this.speed = 420;
        }
        if(this.type == "gernade")
        {
            this.width = 25;
            this.height = 25;
            this.states = {
                0: "moving",
                1: "setting_explosion",
                2: "exploding"
            };
            this.current_state= this.states[0];
            
            this.origin_point_xpos = x;
            this.origin_point_ypos = y;
            
            this.lifespan = 0;
            this.explosion_timer = 2;
            this.current_explosion_timer = 2; //---in seconds
            this.max_explosion_radius = 120;
            
            this.current_explosion_radius = 0;
            this.explosion_lapse = 3; //---in secnds
        }
        if(this.type == "standard_enemy_laser")
        {
            this.width = 15,
            this.height = 15;
            this.speed = 620;
        }
        this.active = true;
    }
    var bullet_prototype = Bullet_.prototype;
    bullet_prototype.update_bullet = function(delta_time)
    {
        if(this.type == "multi-shot" || this.type == "standard-shot" || this.type == "standard_enemy_laser")
        {
            this.ypos -= (Math.cos(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
            this.xpos += (Math.sin(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
        }
        if(this.type == "gernade")
        {
            if(this.current_state == "moving")
            {
                this.ypos -= (Math.cos(this.current_rotation * (Math.PI/180)) * (200/10));
                this.xpos += (Math.sin(this.current_rotation * (Math.PI/180)) * (200/10));
                var delta_x = (Math.abs(this.origin_point_xpos - this.xpos));
                var delta_y = (Math.abs(this.origin_point_ypos - this.ypos));
                if(Math.ceil(Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2))) >= 200)
                {
                    this.current_state = "setting_explosion";
                }
            }
            if(this.current_state == "setting_explosion")
            {
                bullet_prototype.set_explosion(this.xpos, this.ypos, this.explosion_timer, this.current_explosion_timer, this.max_explosion_radius);
                this.current_explosion_timer -= (1/60);
                if(this.current_explosion_timer <= 0)
                {
                    this.current_state = "exploding";
                }
            }
            if(this.current_state == "exploding")
            {
                bullet_prototype.explode(this.xpos, this.ypos, this.current_explosion_radius);
                this.current_explosion_radius += ((this.max_explosion_radius/this.explosion_lapse)/60);
                if(this.current_explosion_radius >= this.max_explosion_radius)
                {
                    this.active = false;
                }
            }
        }
        if((this.xpos >= (canvas.width + 50)) || (this.xpos <= -50) || (this.ypos >= (canvas.height)) || (this.ypos <= -50))
        {
            //console.log("delete me");
            this.active = false;
        }
        
        //---render the bullet
        canvas_context.save();
        canvas_context.translate(this.xpos, this.ypos);
        canvas_context.rotate(this.current_rotation * (Math.PI/180));
        canvas_context.fillStyle = "cyan";
        canvas_context.fillRect(-(this.width/2),-(this.height/2),this.width,this.height);
        canvas_context.restore();
    };
    bullet_prototype.set_explosion = function(xpos, ypos, explosion_timer, current_explosion_timer, explosion_radius)
    {
        canvas_context.save();
        canvas_context.translate(xpos,ypos);
        canvas_context.rotate((-90) * Math.PI/180);
        canvas_context.strokeStyle = "black";
        canvas_context.beginPath();
        canvas_context.arc(0,0, explosion_radius, (0*Math.PI), ((2 * (1 - (current_explosion_timer/explosion_timer))) *Math.PI));
        canvas_context.stroke();
        canvas_context.restore();
    }
    bullet_prototype.explode = function(xpos, ypos, explosion_radius)
    {
        canvas_context.save();
        canvas_context.translate(xpos,ypos);
        canvas_context.fillStyle = "black";
        canvas_context.beginPath();
        canvas_context.arc(0,0, explosion_radius, (0*Math.PI), ((2 *Math.PI)));
        canvas_context.fill();
        canvas_context.restore();
    }
    
    
    
    bullet_prototype.explode______old = function(xpos, ypos, explosion_timer, current_explosion_timer, explosion_radius)
    {
        canvas_context.save();
        canvas_context.translate(xpos,ypos);
        canvas_context.rotate((-90) * Math.PI/180);
        canvas_context.strokeStyle = "black";
        canvas_context.beginPath();
        //console.log(current_explosion_timer);
        canvas_context.arc(xpos,ypos, explosion_radius, (0*Math.PI), ((2 * (1 - (current_explosion_timer/explosion_timer))) *Math.PI));
        canvas_context.stroke();
        canvas_context.restore();
    }
    
    
    return Bullet_;
}();