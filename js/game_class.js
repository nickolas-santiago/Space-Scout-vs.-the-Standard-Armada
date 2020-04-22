"use strict";
var app = app || {};

app.Game_Class = {
    //---Properties
    player: undefined,
    score: 0,
    delta_time: (1/60),
    player_bullets_array: [],
    mouse_pos: {
        x: 0,
        y: 0
    },
    mousedown: undefined,
    
    enemy_list: [],
    
    cooldown: 0,
    fire_rate: 2,
    
    previous_key: undefined,
    
    enemies: {
        0: "standard-enemy",
        1: "bomber-enemy",
        2: "tank-enemy"
    },
    enemy_bullets_array: [],
    
    
    pickup_array: [],
    score_multiplier_active: false,
    score_multiplier_current_timer: undefined,
    score_multiplier_max_timer: 7, 
    
    
    
    //---Methods
    init: function()
    {
        
        this.player = app.Player_Class.init();
        var self = this;
        this.mousedown = false;
        canvas.addEventListener('mousemove', function(evt)
        {
            self.mouse_pos = getMouse(canvas, evt);
        });
        canvas.addEventListener('mousedown',function(evt)
        {
            self.mousedown = true;
        });
        canvas.addEventListener('mouseup',function(evt)
        {
            self.mousedown = false;
        });
        
        this.pickup_array.push(new app.PickUp(300, 100));
        console.log(this.pickup_array);
        
        this.update();
    },
    update: function()
    {
        
		requestAnimationFrame(this.update.bind(this));
        
        //if(this.cooldown < 0) this.cooldown = 0;
        
        canvas_context.fillStyle= "red";
        //canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        this.updateBackground();
        
        
        this.keyboardEvents();
        //app.Player_Class.rotatePlayer(this.mouse_pos.y, this.mouse_pos.x);
        app.Player_Class.renderPlayer(this.mouse_pos.x, this.mouse_pos.y);
        if(this.enemy_list.length < 1)
        {
            this.spawnEnemy();
        }
        for(var x = 0; x < this.enemy_list.length; x++)
        {
            this.enemy_list[x].rotateEnemy(app.Player_Class.ypos, app.Player_Class.xpos);
            this.enemy_list[x].render_enemy(app.Player_Class.xpos, app.Player_Class.ypos, this.delta_time);
        }
       this.enemy_list = this.enemy_list.filter(function(enemy)
        {
            if(enemy.active == true)
            {
                return enemy;
            }
        });
        
        if((this.mousedown == true) && (app.Player_Class.weapons[app.Player_Class.current_weapon].current_cooldown_time <=0))
        {
            this.shoot();
        }
        for(var x = 0; x < this.player_bullets_array.length; x++)
        {
            this.player_bullets_array[x].update_bullet(this.delta_time);
        }
        this.player_bullets_array = this.player_bullets_array.filter(function(bullet)
        {
            if(bullet.active == true)
            {
                return bullet;
            }
        });
        
        
        /*enemy_bullets_array*/
        for(var x = 0; x < this.enemy_bullets_array.length; x++)
        {
            this.enemy_bullets_array[x].update_bullet(this.delta_time);
        }
        this.enemy_bullets_array = this.enemy_bullets_array.filter(function(bullet)
        {
            if(bullet.active == true)
            {
                return bullet;
            }
        });
        
        /*pickup_array*/
        for(var x = 0; x < this.pickup_array.length; x++)
        {
             this.pickup_array[x].render_pickup();
        }
        this.pickup_array = this.pickup_array.filter(function(pickup)
        {
            if(pickup.active == true)
            {
                return pickup;
            }
        });
        if(this.score_multiplier_active == true)
        {
            this.score_multiplier_current_timer -= (1/60);
            console.log(this.score_multiplier_current_timer);
            if(this.score_multiplier_current_timer <= 0)
            {
                this.score_multiplier_active = false;
            }
        }
        
        
        this.checkForCollisions();
        
        //app.Game_Screens.renderGameHUD();
        app.Game_Screens.renderGameHUD(app.Player_Class, this.score);
        
        canvas_context.strokeStyle = "cyan";
        canvas_context.beginPath();
        canvas_context.moveTo(app.Player_Class.xpos, app.Player_Class.ypos);
        canvas_context.lineTo(this.mouse_pos.x,this.mouse_pos.y);
        canvas_context.stroke();
    },
    
    
    
    keyboardEvents: function()
    {
        //---Events for moving the player character 
        if(app.keydown[app.KEYBOARD.KEY_LEFT])
        {
            app.Player_Class.moveLeft(this.delta_time);
        }
        if(app.keydown[app.KEYBOARD.KEY_UP])
        {
            app.Player_Class.moveUp(this.delta_time);
        }
        if(app.keydown[app.KEYBOARD.KEY_RIGHT])
        {
            app.Player_Class.moveRight(this.delta_time);
        }
        if(app.keydown[app.KEYBOARD.KEY_DOWN])
        {
            app.Player_Class.moveDown(this.delta_time);
        }
        
        //---switching weapons
        if(app.keydown[app.KEYBOARD.KEY_E])
        {
            if(this.previous_key != app.keydown)
            {
                app.Player_Class.current_weapon--;
                if(app.Player_Class.current_weapon < 0)
                {
                    app.Player_Class.current_weapon = (Object.keys(app.Player_Class.weapons).length - 1);
                }
            }
            this.previous_key = app.keydown;
        }
        if(app.keydown[app.KEYBOARD.KEY_R])
        {
            if(this.previous_key != app.keydown)
            {
                app.Player_Class.current_weapon++;
                if(app.Player_Class.current_weapon > (Object.keys(app.Player_Class.weapons).length - 1))
                {
                    app.Player_Class.current_weapon = 0;
                }
            }
            this.previous_key = app.keydown;
        }
        
        //---using a powerup
        if(app.keydown[app.KEYBOARD.KEY_Q] && app.Player_Class.current_powerup != "")
        {
            if(app.Player_Class.current_powerup == "score_multiplier")
            {
                this.score_multiplier_active = true;
                this.score_multiplier_current_timer = this.score_multiplier_max_timer;
            }
            if(app.Player_Class.current_powerup == "armour_power_up")
            {
                if(app.Player_Class.has_armour == false)
                {
                    app.Player_Class.has_armour = true;
                }
                app.Player_Class.current_armour = app.Player_Class.max_armour;
            }
            if(app.Player_Class.current_powerup == "super_cooldown")
            {
                app.Player_Class.super_cooldown_active = true;
                app.Player_Class.super_cooldown_current_timer = app.Player_Class.super_cooldown_max_timer;
            }
            app.Player_Class.current_powerup = "";
        }
    },
    
    shoot: function()
    {
        var current_player_weapon = app.Player_Class.weapons[app.Player_Class.current_weapon];
        current_player_weapon.current_cooldown_time = current_player_weapon.cooldown_time;
        if(current_player_weapon.type == "multi-shot")
        {
            var shot_angle = 45;
            for(var shot = 0; shot < 3; shot++)
            {
                
            this.player_bullets_array.push(new app.Bullet_(current_player_weapon.type, app.Player_Class.xpos, app.Player_Class.ypos, ((app.Player_Class.scout_blaster_current_rotation - shot_angle) + (shot_angle * shot))));
            //this.player_bullets_array.push(new app.Bullet_(current_player_weapon.type, app.Player_Class.xpos, (app.Player_Class.ypos - (app.Player_Class.scout_blaster_height/2)), ((app.Player_Class.scout_blaster_current_rotation - shot_angle) + (shot_angle * shot))));
            }
        }
        else
        {
            this.player_bullets_array.push(new app.Bullet_(current_player_weapon.type, app.Player_Class.xpos, app.Player_Class.ypos, app.Player_Class.scout_blaster_current_rotation));
            
            //console.log(this.player_bullets_array[0].xpos);
        }
    },
    
    spawnEnemy: function()
    {
        var chance_of_enemy = Math.random();
        var spawn_xpos_padding = 100;
        var spawn_xpos = ((Math.random() * (canvas.width + spawn_xpos_padding)) - (spawn_xpos_padding/2));
        var spawn_ypos;
        if(spawn_xpos <= 0 || spawn_xpos > canvas.width)
        {
            spawn_ypos = ((Math.random() * (canvas.height + spawn_xpos_padding/2)) - (spawn_xpos_padding/2));
        }
        else
        {
            spawn_ypos = ((Math.random() * -(spawn_xpos_padding/2)));
        }
        if(chance_of_enemy < 1/120)
        {
            //console.log("make a friend");
            this.enemy_list.push(new app.Enemy_(spawn_xpos, spawn_ypos, this.enemies[0]));
            //this.enemy_list.push(new app.Enemy_(spawn_xpos, spawn_ypos, this.enemies[1]));
            //this.enemy_list.push(new app.Enemy_(spawn_xpos, spawn_ypos, this.enemies[2]));
        }
    },
    
    
    checkForCollisions: function()
    {
        var self = this;
        for(var bullet = 0; bullet < this.player_bullets_array.length; bullet++)
        {
            for(var enemy = 0; enemy < this.enemy_list.length; enemy++)
            {
                if(this.collision(this.player_bullets_array[bullet], this.enemy_list[enemy]))
                {
                    this.player_bullets_array[bullet].active = false;
                    this.enemy_list[enemy].current_health--;
                    if(this.enemy_list[enemy].current_health <= 0)
                    {
                        this.updateScore(this.enemy_list[enemy].score_yield);
                    }
                    break;
                }
            }
        }
        
        var player = app.Player_Class;
        if(player.taking_damage == false)
        {
            for(var enemy = 0; enemy < this.enemy_list.length; enemy++)
            {
                if(this.collision(this.enemy_list[enemy], player))
                {
                    player.damage_location = this.enemy_list[enemy].current_rotation;
                    /*player.current_health--;
                    player.taking_damage = true;*/
                    
                    if(player.has_armour == true)
                    {
                        player.current_armour--;
                        if(player.current_armour <= 0)
                        {
                            player.has_armour = false;
                            console.log("boosh");
                        }
                    }
                    else
                    {
                        player.current_health--;
                    }
                    player.taking_damage = true;
                    if(this.enemy_list[enemy].type == "bomber-enemy")
                    {
                        this.enemy_list[enemy].active = false;
                    }
                }
            }
            for(var enemy_bullet = 0; enemy_bullet < this.enemy_bullets_array.length; enemy_bullet++)
            {
                if(this.collision(this.enemy_bullets_array[enemy_bullet], player))
                {
                    console.log(player.has_armour);
                    player.damage_location = this.enemy_bullets_array[enemy_bullet].current_rotation;
                    if(player.has_armour == true)
                    {
                        player.current_armour--;
                        if(player.current_armour <= 0)
                        {
                            player.has_armour = false;
                            console.log("boosh");
                        }
                    }
                    else
                    {
                        player.current_health--;
                    }
                    console.log(player.current_health);
                    player.taking_damage = true;
                    this.enemy_bullets_array[enemy_bullet].active = false;   
                }
            }
        }
        for(var pickup = 0; pickup < this.pickup_array.length; pickup++)
        {
            if(this.rectCircleCollidingtwo(this.pickup_array[pickup], player))
            {
                this.pickup_array[pickup].active = false;
                console.log(this.pickup_array[pickup].score_yield);
                this.updateScore(this.pickup_array[pickup].score_yield);
                if(this.pickup_array[pickup].type == "health_pickup")
                {
                    if(player.has_armour == true)
                    {
                        if(player.current_armour < player.max_armour)
                        {
                            player.current_armour++;
                        }
                    }
                    else
                    {
                        if(player.current_health < player.max_health)
                        {
                            player.current_health++;
                        }
                    }
                }
                else
                {
                    player.current_powerup = this.pickup_array[pickup].type;
                }
            }
        }
        
        //---explosions and enemies
        //   http://jsfiddle.net/m1erickson/n6U8D/
        
    },
    collision: function(a, b)
    {
        return ((a.xpos < (b.xpos + b.width/2)) &&
               (a.xpos > (b.xpos - b.width/2)) &&
               (a.ypos < (b.ypos + b.height/2)) &&
               (a.ypos > (b.ypos - b.height/2)));
               
    },
    
    
    rectCircleColliding: function(circle, rect)
    {
        var distX = Math.abs(circle.x - rect.x - rect.w / 2);
        var distY = Math.abs(circle.y - rect.y - rect.h / 2);

        if (distX > (rect.w / 2 + circle.r))
        {
            return false;
        }
        if (distY > (rect.h / 2 + circle.r))
        {
            return false;
        }

        if (distX <= (rect.w / 2))
        {
            return true;
        }
        if (distY <= (rect.h / 2))
        {
            return true;
        }

        var dx = distX - rect.w / 2;
        var dy = distY - rect.h / 2;
        return (dx * dx + dy * dy <= (circle.r * circle.r));
    },
    rectCircleCollidingtwo: function(circle, rect)
    {
        var distX = Math.abs(circle.xpos - rect.xpos - rect.width / 2);
        var distY = Math.abs(circle.ypos - rect.ypos - rect.height / 2);

        if (distX > (rect.width / 2 + circle.pickup_radius))
        {
            return false;
        }
        if (distY > (rect.height / 2 + circle.pickup_radius))
        {
            return false;
        }

        if (distX <= (rect.width / 2))
        {
            return true;
        }
        if (distY <= (rect.height / 2))
        {
            return true;
        }

        var dx = distX - rect.width / 2;
        var dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.pickup_radius * circle.pickup_radius));
    },
    
    updateScore: function(score_yield)
    {
        if(this.score_multiplier_active == true)
        {
            this.score = this.score + (score_yield * 2);
        }
        else
        {
            this.score = this.score + score_yield;
        }
    },
    
    updateBackground: function()
    {
        canvas_context.save();
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0,0,canvas.width,canvas.height);
        canvas_context.restore();
    }
};