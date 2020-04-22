"use strict";
var app = app || {};

app.Player_Class = {
    //---Properties
    //---these xpos and ypos values are the midpoints of the player object
    xpos: undefined,
    ypos: undefined,
    width: 50,
    height: 50,
    current_rotation: undefined,
    max_health: 3,
    current_health: undefined,
    speed: 250,
    turret_position: {
        x: undefined,
        y: undefined
    },
    
    
    weapons: {
        0: {
            type: "multi-shot",
            cooldown_time: 30,
            current_cooldown_time: 0,
            damage: 1
        },
        1: {
            type: "standard-shot",
            cooldown_time: 20,
            current_cooldown_time: 0,
            damage: 1
        },
        2: {
            type: "gernade",
            cooldown_time: 600,
            current_cooldown_time: 0,
            damage: 1
        }
    },
    current_weapon: undefined,
    
    moving_up: false,
    moving_right: true,
    moving_down: false,
    moving_left: false,
    
    
    taking_damage: undefined,
    aa: 0, 
    mercy_timer: 0,
    damage_location: undefined,
    
    
    current_powerup: "",
    
    has_armour: false,
    current_armour: 2,
    max_armour: 3,
    
    super_cooldown_active: false,
    super_cooldown_max_timer: 7,
    super_cooldown_current_timer: undefined,
    
    scout_ship_image: undefined,
    scout_blaster_image: undefined,
    scout_blaster_width: 35,
    scout_blaster_height: (35 * 1.91429),
    scout_blaster_current_rotation: undefined,
    
    //---Methods
    init: function()
    {
        console.log("player has inited");
        console.log(Object.keys(this.weapons).length);
        this.xpos = this.ypos = 100;
        this.current_rotation = 0;
        this.turret_position.x = (0 - 10);
        this.turret_position.y = (0 - (this.height/2));
        
        this.current_health = this.max_health;
        console.log(this.current_health);
        this.taking_damage = false;
        this.current_weapon = 1;
        
        this.scout_ship_image = new Image();
        this.scout_ship_image.src = "images/space_scout_ship.png";
        
        this.scout_blaster_image = new Image();
        this.scout_blaster_image.src = "images/scout_blaster.png";
    },
    
    renderPlayer: function(mouse_xpos, mouse_ypos)
    {
        this.updateCooldown();
        if(this.taking_damage == true)
        {
            var recoil_distance = 150;
            var recoil_time = 10;
            var mercy_time = (60*3);
            
            if(this.aa < recoil_time)
            {
                this.ypos -= (Math.cos(this.damage_location * (Math.PI/180)) * (recoil_distance/recoil_time));
                this.xpos += (Math.sin(this.damage_location * (Math.PI/180)) * (recoil_distance/recoil_time));
            }
            this.aa++;
            if(this.aa >= mercy_time)
            {
                this.taking_damage = false;
                this.aa = 0;
            }
        }
        this.rotatePlayer();
        this.rotateBlaster(mouse_ypos, mouse_xpos);
        canvas_context.save();
            canvas_context.translate(this.xpos, this.ypos);
            canvas_context.rotate(this.current_rotation * Math.PI/180);
            canvas_context.fillStyle = "black";
            canvas_context.fillRect((0 - (this.width/2)), (0 - (this.height/2)), this.width, this.height);
            canvas_context.fillStyle = "green";
            //canvas_context.fillRect(this.turret_position.x, 0 - (this.height/2), 20, 20);
            //canvas_context.drawImage(this.scout_ship_image, -(this.width/2), -(this.height/2), this.width, this.height);
            canvas_context.save();
                canvas_context.translate(0, 0);
                //canvas_context.translate(-(this.scout_blaster_width/2), (-(this.scout_blaster_height/2) + 15));
                canvas_context.rotate(this.scout_blaster_current_rotation * Math.PI/180);
                //canvas_context.drawImage(this.scout_blaster_image, -(this.scout_blaster_width/2), (-(this.scout_blaster_height/2)), this.scout_blaster_width, this.scout_blaster_height);
            canvas_context.restore();
        canvas_context.restore();
        
        
        
    },
    
    moveLeft: function(delta_time)
    {
        this.xpos -= this.speed * delta_time;
    },
    moveUp: function(delta_time)
    { 
        this.ypos -= this.speed * delta_time;
        this.moving_up = true;
    },
    moveRight: function(delta_time)
    {
        this.xpos += this.speed * delta_time;
    },
    moveDown: function(delta_time)
    {
        this.ypos += this.speed * delta_time;
    },
    
    rotatePlayer: function()
    {
        
    }, 
    
    
    rotateBlaster: function(mouse_ypos,mouse_xpos)
    {
        var angle = Math.atan2(mouse_ypos - this.ypos, mouse_xpos - this.xpos) * (180/Math.PI);
        this.scout_blaster_current_rotation  = (angle + 90);
    },
    
    updateCooldown: function()
    {
        for(var weapon = 0; weapon < Object.keys(this.weapons).length; weapon++)
        {
            if(this.weapons[weapon].current_cooldown_time > 0)
            {
                if(this.super_cooldown_active == true)
                {
                    this.weapons[weapon].current_cooldown_time--;
                }
                this.weapons[weapon].current_cooldown_time--;
            }
        }
        if(this.super_cooldown_active == true)
        {
            this.super_cooldown_current_timer -= (1/60);
            if(this.super_cooldown_current_timer <= 0)
            {
                this.super_cooldown_active = false;
            }
        }
    }
};