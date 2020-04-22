"use strict";
var app = app || {};

app.Enemy_ = function()
{
    /*
        0: "standard-enemy",
        1: "bomber-enemy",
        2: "tank-enemy"
    */
    function Enemy_(xpos_, ypos_, enemy_type)
    {
        console.log(enemy_type);
        this.xpos = xpos_;
        this.ypos = ypos_;
        this.current_rotation = 0;
        this.type = enemy_type;
        this.active = true;
        this.lifespan = 0;
        this.target_xpos = undefined;
        this.target_ypos = undefined;
        
        if(this.type == "standard-enemy")
        {
            this.width = 45;
            this.height = 45;
            this.speed = 85;
            this.current_health = 2;
            this.score_yield = 100;
            this.states = {
                0: "moving",
                1: "aiming"
            };
            this.current_state = "moving";
            this.bullet_queue_length = undefined;
            this.cooldown_time = 40;
            this.current_cooldown_time = 0;
        }
        
        if(this.type == "bomber-enemy")
        {
            this.width = 32;
            this.height = 32;
            this.speed = 95;
            this.score_yield = 50;
            this.current_health = 2;
            this.reactive = false;
        }
        
        if(this.type == "tank-enemy")
        {
            this.width = 155;
            this.height = 45;
            this.speed = 45;
            this.score_yield = 1500;
            this.current_health = 40;
            this.states = {
                0: "moving",
                1: "aiming",
                2: "shooting"
            };
            this.current_state = "moving";
            this.bullet_queue_length = undefined;
            this.bullet_cooldown_time = 30;
            this.current_bullet_cooldown_time = 0;
            this.weapon_cooldown_time = 200;
            this.current_weapon_cooldown_time = 0;
        }
        
        /*
        
        this.width = 45;
        this.height = 45;
        this.active = true;
        this.current_health = 2;
        this.target_xpos = undefined;
        this.target_ypos = undefined;
        this.speed = 85;*/
    };
    var enemy_standard_prototype = Enemy_.prototype;
    
    enemy_standard_prototype.render_enemy = function(player_xpos, player_ypos, delta_time)
    {
        /*this.cool = "cool";
        console.log(this.cool);*/
        if(this.current_health <= 0)
        {
            this.active = false;
        }
        this.target_xpos = player_xpos;
        this.target_ypos = player_ypos;
        this.lifespan++;
        
        if(this.type == "standard-enemy")
        {
            if(this.current_state == "moving")
            {
                this.ypos -= (Math.cos(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
                this.xpos += (Math.sin(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
                if(this.lifespan%60 == 0)
                {
                    var chance_to_shoot = Math.random() * 50;
                    //console.log(chance_to_shoot);
                    if(chance_to_shoot <= 5)
                    {
                        console.log(chance_to_shoot);
                        console.log("taking my shot, takingmy chance.");
                        this.bullet_queue_length = Math.ceil(Math.random() * 3);
                        console.log(this.bullet_queue_length);
                        this.current_state = "aiming";
                    }
                }
            }
            if(this.current_state == "aiming")
            {
                this.ypos = this.ypos;
                this.xpos = this.xpos;
                this.current_cooldown_time--;
                if(this.current_cooldown_time <= 0)
                {
                    this.current_cooldown_time = 0;
                }
                if(this.lifespan%30 == 0 && this.current_cooldown_time <= 0)
                {
                   var take_a_shot = Math.random() * 50;
                    if(take_a_shot <= 5)
                    {
                        app.Game_Class.enemy_bullets_array.push(new app.Bullet_("standard_enemy_laser", this.xpos, this.ypos, this.current_rotation));
                        this.current_cooldown_time = this.cooldown_time;
                        console.log("shoot");
                        this.bullet_queue_length--;
                        if(this.bullet_queue_length <= 0)
                        {
                            this.current_state = "moving";
                        }
                    }
                }
            }
            
            //---render enemy
            canvas_context.save();
            canvas_context.translate(this.xpos, this.ypos);
            canvas_context.rotate(this.current_rotation * Math.PI/180);
            canvas_context.fillStyle = "green";
            canvas_context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
            canvas_context.restore();   
        }
        if(this.type == "bomber-enemy")
        {
            this.ypos -= (Math.cos(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
            this.xpos += (Math.sin(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
            if(this.reactive == false && this.lifespan%60 == 0)
            {
                var turn_reactive = Math.random() * 50;
                if(turn_reactive < 10)
                {
                    console.log("here i come");
                    this.reactive = true;
                    this.speed = 100;
                    this.score_yield = 100;
                    this.current_health = 1;
                }
            }
            
            //---render enemy
            canvas_context.save();
            canvas_context.translate(this.xpos, this.ypos);
            canvas_context.rotate(this.current_rotation * Math.PI/180);
            if(this.reactive == false)
            {
                canvas_context.fillStyle = "green";
            }
            else
            {
                canvas_context.fillStyle = "red";
            }
            canvas_context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
            canvas_context.restore();
        }
        
        if(this.type == "tank-enemy")
        {
            if(this.current_state == "moving")
            {
                this.ypos -= (Math.cos(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
                this.xpos += (Math.sin(this.current_rotation * (Math.PI/180)) * (this.speed * delta_time));
                if(this.lifespan%60 == 0)
                {
                    var chance_to_shoot = Math.random() * 50;
                    //console.log(chance_to_shoot);
                    if(chance_to_shoot <= 5)
                    {
                        console.log(chance_to_shoot);
                        console.log("taking my shot, takingmy chance.");
                        this.current_state = "aiming";
                    }
                }
            }
            if(this.current_state == "aiming")
            {
                this.ypos = this.ypos;
                this.xpos = this.xpos;
                this.current_weapon_cooldown_time--;
                if(this.current_weapon_cooldown_time <= 0)
                {
                    this.current_weapon_cooldown_time = 0;
                }
                if(this.lifespan%30 == 0 && this.current_weapon_cooldown_time <= 0)
                {
                   var take_a_shot = Math.random() * 50;
                    if(take_a_shot <= 5)
                    {
                        console.log("shooting");
                        this.bullet_queue_length = 15;
                        this.current_state = "shooting";
                    }
                }
            }
            if(this.current_state == "shooting")
            {
                if(this.bullet_queue_length <= 0)
                {
                    this.current_state = "moving";
                }
                this.current_bullet_cooldown_time--;
                if(this.current_bullet_cooldown_time <= 0)
                {
                    console.log("shoot");
                    app.Game_Class.enemy_bullets_array.push(new app.Bullet_("standard_enemy_laser", this.xpos, this.ypos, this.current_rotation));
                    this.current_bullet_cooldown_time = this.bullet_cooldown_time;
                    this.bullet_queue_length--;
                }
            }
            
            //---render enemy
            canvas_context.save();
            canvas_context.translate(this.xpos, this.ypos);
            canvas_context.rotate(this.current_rotation * Math.PI/180);
            canvas_context.fillStyle = "green";
            canvas_context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
            canvas_context.restore();   
        }
        //this.lifespan++;
    };
    
    
    enemy_standard_prototype.rotateEnemy = function(player_ypos, player_xpos)
    {
        var angle = Math.atan2(player_ypos - this.ypos, player_xpos - this.xpos) * (180/Math.PI);
        this.current_rotation = (angle + 90);
    }
    
    return Enemy_;
}();