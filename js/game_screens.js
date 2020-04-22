"use strict";
var app = app || {};

app.Game_Screens = {
    renderGameHUD: function(player, score)
    {
        this.renderHealthBarModule(26, 14, player);
        this.scoreContainer((canvas.width-100),20,score);
        this.weaponSelectionSection(canvas.width, canvas.height, player);
        //this.drawWeaponBubble(200 - 55 - ( 30* 1), 300 - 0 - (47.50 * (2 - 1)), 80, 50, 120);
        
        this.currentPickUpSection(player);
        this.drawBorders();
    },
    
    currentPickUpSection: function(player)
    {
        
        var pickup_icon = new Image();
        
        
        var pick_up_bubble_radius;
        if(player.current_powerup == "")
        {
            pick_up_bubble_radius = 20;
        }
        else
        {
            pick_up_bubble_radius = 35;
        }
        
        //case
        canvas_context.beginPath();
        canvas_context.arc((0 + 50), (canvas.height - 50), pick_up_bubble_radius, (0*Math.PI), (2 *Math.PI));
        //canvas_context.strokeStyle = "
        canvas_context.strokeStyle = "#E7EEE6";
        canvas_context.stroke();
        
        
        
        
        //grid_layer
        canvas_context.save();
        canvas_context.beginPath();
        canvas_context.arc((0 + 50), (canvas.height - 50), pick_up_bubble_radius, (0*Math.PI), (2 *Math.PI));
        canvas_context.fillStyle = "rgba(96, 95, 95, 0.7)";
        canvas_context.fill();
        canvas_context.restore();
        
        var num_of_segments = 6;
        for(var segments = 0; segments < num_of_segments; segments++)
        {
            //var xpos_ = (((0 + 50) - weapon_bubble_radius) + (((weapon_bubble_radius*2)/num_of_segments) * segments));
            var xpos_ = ((0 - pick_up_bubble_radius) + (((pick_up_bubble_radius*2)/num_of_segments) * segments));
            if(xpos_ == 0)
            {
                var height_ = pick_up_bubble_radius;
            }
            else
            {
                var height_ = ((Math.tan((Math.acos(xpos_/pick_up_bubble_radius)))) * xpos_);
            }
            var ypos_ = ((0 - pick_up_bubble_radius) + (((pick_up_bubble_radius*2)/num_of_segments) * segments));
            if(ypos_ == 0)
            {
                var width_ = pick_up_bubble_radius;
            }
            else
            {
                var width_ = (ypos_/(Math.tan(Math.asin(ypos_/pick_up_bubble_radius))));
            }
            
            canvas_context.save();
            canvas_context.translate((0 + 50), (canvas.height - 50));
            canvas_context.lineWidth = 0.5;
            canvas_context.beginPath();
            canvas_context.moveTo(xpos_, 0 - height_);
            canvas_context.lineTo(xpos_, height_ );
            canvas_context.stroke();
            canvas_context.beginPath();
            canvas_context.moveTo(0- width_, ypos_);
            canvas_context.lineTo(width_, ypos_ );
            canvas_context.strokeStyle = "#27E100";
            canvas_context.stroke();
            canvas_context.restore();
            
        }
        
        
        
        // icon layer
        //ICON LAYER
        canvas_context.save();
        canvas_context.fillStyle = "#27E100";
        canvas_context.font = "20px Arial";
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "start";
        canvas_context.fillText(player.current_powerup, (0 + 50) - pick_up_bubble_radius, (canvas.height - 50));
        canvas_context.restore();
        
        
        //glass layer`
        var glass_layer_image = new Image();
        glass_layer_image.src = "images/glass_layer.png";
        canvas_context.save();
        canvas_context.globalAlpha = 0.5;
        canvas_context.drawImage(glass_layer_image, (0 + 50) - pick_up_bubble_radius, (canvas.height - 50) - pick_up_bubble_radius, pick_up_bubble_radius * 2, pick_up_bubble_radius * 2);
        canvas_context.restore();
        
        
        
    },
    
    weaponSelectionSection: function(weapon_selection_section_xpos, weapon_selection_section_ypos, player)
    {
        var selected_weapon = player.current_weapon;
      //  for(var weapon = 0; weapon < Object.keys(player.weapons).length; weapon++)
        for(var weapon = 0; weapon < Object.keys(player.weapons).length; weapon++)
        {
            var player_weaopns_length = Object.keys(player.weapons).length;
            var max_cooldown_time = player.weapons[weapon].cooldown_time;
            var current_cooldown_time = player.weapons[weapon].current_cooldown_time;
            var player_weapon_type = player.weapons[weapon].type;
            var weapon_bubble_radius;
            canvas_context.save();
            if(weapon == selected_weapon)
            {
                weapon_bubble_radius = 30;
                //weapon_bubble_radius = 70;
                canvas_context.globalAlpha = 1;
            }
            else
            {
                weapon_bubble_radius = 20;
                //weapon_bubble_radius = 50;
                canvas_context.globalAlpha = 0.25;
            }
            //this.drawWeaponBubble(160 + (38 * 1.5 * weapon), canvas.height - 150 - (42.5 * 1.5 * weapon), weapon_bubble_radius, current_cooldown_time, max_cooldown_time);
            //this.drawWeaponBubble(200, 200, weapon_bubble_radius, current_cooldown_time, max_cooldown_time);
            
            this.drawWeaponBubble(weapon_selection_section_xpos - 40 - ( 30* weapon), weapon_selection_section_ypos + 10 - (47.50 * (player_weaopns_length - weapon)), weapon_bubble_radius, current_cooldown_time, max_cooldown_time, player_weapon_type);
            //this.drawWeaponBubble(weapon_selection_section_xpos - 55 - ( 30* weapon), weapon_selection_section_ypos - 0 - (47.50 * (player_weaopns_length - weapon)), weapon_bubble_radius, current_cooldown_time, max_cooldown_time);
            //this.drawWeaponBubble(200 - 55 - ( 30* weapon), 300 - 0 - (47.50 * (player_weaopns_length - weapon)), weapon_bubble_radius, current_cooldown_time, max_cooldown_time);
            canvas_context.restore();
        }
    },
    
    drawWeaponBubble: function(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, current_cooldown_time, max_cooldown_time, player_weapon_type)
    {
        
        
        var weapon_bubble_radius = weapon_bubble_radius;
        
        //case layer
        //var case_layer_radius = weapon_bubble_radius + (weapon_bubble_radius/10);
        var case_layer_radius = weapon_bubble_radius;
        var cooldown_guage_width = (weapon_bubble_radius/5) + (weapon_bubble_radius/10);
        var cooldown_guage_angle_height = 0.5750;
        var cooldown_guage_bottom_point_radians = (0.5 + (0.5 - (cooldown_guage_angle_height/2)));
        var cooldown_guage_top_point_radians = (cooldown_guage_bottom_point_radians + cooldown_guage_angle_height);
        //---these next two variables help find where the guage will belong
        var cooldown_guage_angle_opp_side_length = (Math.sin((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        var cooldown_guage_angle_adj_side_length = (Math.cos((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        
        canvas_context.save();
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, case_layer_radius, (0*Math.PI), (2 *Math.PI));
        //canvas_context.fillStyle = "#BBBBBB";
        //canvas_context.fill();
        canvas_context.strokeStyle = "#E7EEE6";
        canvas_context.stroke();
        //---next draw the outline to the weapon guage
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_bottom_point_radians * Math.PI), (cooldown_guage_top_point_radians * Math.PI));
        canvas_context.arc((weapon_bubble_xpos - cooldown_guage_width), weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_top_point_radians * Math.PI), (cooldown_guage_bottom_point_radians * Math.PI), true);
        canvas_context.lineTo(((weapon_bubble_xpos - cooldown_guage_width) - cooldown_guage_angle_adj_side_length + cooldown_guage_width), (weapon_bubble_ypos + cooldown_guage_angle_opp_side_length));
        canvas_context.fillStyle = "rgba(187, 187, 187, 0.65)";
        canvas_context.fill();
        canvas_context.strokeStyle = "#E7EEE6";
        canvas_context.stroke();
        canvas_context.restore();
        
        
        
        //grid_layer
        canvas_context.save();
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (0*Math.PI), (2 *Math.PI));
        canvas_context.fillStyle = "rgba(96, 95, 95, 0.7)";
        canvas_context.fill();
        canvas_context.restore();
        
        var num_of_segments = 6;
        for(var segments = 0; segments < num_of_segments; segments++)
        {
            //var xpos_ = ((weapon_bubble_xpos - weapon_bubble_radius) + (((weapon_bubble_radius*2)/num_of_segments) * segments));
            var xpos_ = ((0 - weapon_bubble_radius) + (((weapon_bubble_radius*2)/num_of_segments) * segments));
            if(xpos_ == 0)
            {
                var height_ = weapon_bubble_radius;
            }
            else
            {
                var height_ = ((Math.tan((Math.acos(xpos_/weapon_bubble_radius)))) * xpos_);
            }
            var ypos_ = ((0 - weapon_bubble_radius) + (((weapon_bubble_radius*2)/num_of_segments) * segments));
            if(ypos_ == 0)
            {
                var width_ = weapon_bubble_radius;
            }
            else
            {
                var width_ = (ypos_/(Math.tan(Math.asin(ypos_/weapon_bubble_radius))));
            }
            
            canvas_context.save();
            canvas_context.translate(weapon_bubble_xpos, weapon_bubble_ypos);
            canvas_context.lineWidth = 0.5;
            canvas_context.beginPath();
            canvas_context.moveTo(xpos_, 0 - height_);
            canvas_context.lineTo(xpos_, height_ );
            canvas_context.stroke();
            canvas_context.beginPath();
            canvas_context.moveTo(0- width_, ypos_);
            canvas_context.lineTo(width_, ypos_ );
            canvas_context.strokeStyle = "#27E100";
            canvas_context.stroke();
            canvas_context.restore();
            
        }
        
        
        
        //ICON LAYER
        canvas_context.save();
        canvas_context.fillStyle = "#27E100";
        canvas_context.font = "20px Arial";
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "start";
        canvas_context.fillText(player_weapon_type, weapon_bubble_xpos - weapon_bubble_radius, weapon_bubble_ypos);
        canvas_context.restore();
         
        
        
        //"glass" layer
        var glass_layer_image = new Image();
        glass_layer_image.src = "images/glass_layer.png";
        canvas_context.save();
        canvas_context.globalAlpha = 0.5;
        canvas_context.drawImage(glass_layer_image, weapon_bubble_xpos - weapon_bubble_radius, weapon_bubble_ypos - weapon_bubble_radius, weapon_bubble_radius * 2, weapon_bubble_radius * 2);
        canvas_context.restore();
        
        
        
        
        
        //---first draw the bubble containing the weapon icon
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (0*Math.PI), (2 *Math.PI));
       //canvas_context.stroke();
      //  canvas_context.fill();
        canvas_context.restore();
        
        var cooldown_guage_width = (weapon_bubble_radius/5);
        var cooldown_guage_angle_height = 0.50;
        var cooldown_guage_bottom_point_radians = (0.5 + (0.5 - (cooldown_guage_angle_height/2)));
        var cooldown_guage_top_point_radians = (cooldown_guage_bottom_point_radians + cooldown_guage_angle_height);
        //---these next two variables help find where the guage will belong
        var cooldown_guage_angle_opp_side_length = (Math.sin((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        var cooldown_guage_angle_adj_side_length = (Math.cos((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        var cooldown_fill_percentage = (current_cooldown_time/max_cooldown_time);
          canvas_context.fillStyle = "orange";       
      
        
        
        
        
        //---next draw the outline to the weapon guage
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_bottom_point_radians * Math.PI), (cooldown_guage_top_point_radians * Math.PI));
        canvas_context.arc((weapon_bubble_xpos - cooldown_guage_width), weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_top_point_radians * Math.PI), (cooldown_guage_bottom_point_radians * Math.PI), true);
        canvas_context.lineTo(((weapon_bubble_xpos - cooldown_guage_width) - cooldown_guage_angle_adj_side_length + cooldown_guage_width), (weapon_bubble_ypos + cooldown_guage_angle_opp_side_length));
        //canvas_context.stroke();
        canvas_context.fillStyle = "rgba(96, 95, 95, 0.65)";
        canvas_context.fill();
        
        //---now to fill in the guage from the bottom up depending on the weapon's current cooldown time
        //---the bottom points are gonna stay the same, it's the top point that really matters
        //---the weapon's current cooldown time has to be converted into a percentage of it's max time so we know how much of the guage to fill
        //    (esentially where the new top point is gonna be) 
        cooldown_guage_top_point_radians = (cooldown_guage_bottom_point_radians + (cooldown_guage_angle_height*cooldown_fill_percentage));
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_bottom_point_radians * Math.PI), (cooldown_guage_top_point_radians * Math.PI));
        canvas_context.arc((weapon_bubble_xpos - cooldown_guage_width), weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_top_point_radians * Math.PI), (cooldown_guage_bottom_point_radians * Math.PI), true);
        canvas_context.lineTo(((weapon_bubble_xpos - cooldown_guage_width) - cooldown_guage_angle_adj_side_length + cooldown_guage_width), (weapon_bubble_ypos + cooldown_guage_angle_opp_side_length));
        canvas_context.fillStyle = "orange";       
        canvas_context.fill();       
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    drawWeaponBubble: function(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, current_cooldown_time, max_cooldown_time)
    {
        var weapon_bubble_radius = weapon_bubble_radius;
        var cooldown_guage_width = 7;
        var cooldown_guage_angle_height = 0.50;
        var cooldown_guage_bottom_point_radians = (0.5 + (0.5 - (cooldown_guage_angle_height/2)));
        var cooldown_guage_top_point_radians = (cooldown_guage_bottom_point_radians + cooldown_guage_angle_height);
        //---these next two variables help find where the guage will belong
        var cooldown_guage_angle_opp_side_length = (Math.sin((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        var cooldown_guage_angle_adj_side_length = (Math.cos((cooldown_guage_angle_height * 90) * Math.PI/180) * weapon_bubble_radius);
        var cooldown_fill_percentage = (current_cooldown_time/max_cooldown_time);
        
        //---first draw the bubble containing the weapon icon
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (0*Math.PI), (2 *Math.PI));
        canvas_context.stroke();
        
        //---next draw the outline to the weapon guage
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_bottom_point_radians * Math.PI), (cooldown_guage_top_point_radians * Math.PI));
        canvas_context.arc((weapon_bubble_xpos - cooldown_guage_width), weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_top_point_radians * Math.PI), (cooldown_guage_bottom_point_radians * Math.PI), true);
        canvas_context.lineTo(((weapon_bubble_xpos - cooldown_guage_width) - cooldown_guage_angle_adj_side_length + cooldown_guage_width), (weapon_bubble_ypos + cooldown_guage_angle_opp_side_length));
        canvas_context.stroke();
        
        //---now to fill in the guage from the bottom up depending on the weapon's current cooldown time
        //---the bottom points are gonna stay the same, it's the top point that really matters
        //---the weapon's current cooldown time has to be converted into a percentage of it's max time so we know how much of the guage to fill
        //    (esentially where the new top point is gonna be) 
        cooldown_guage_top_point_radians = (cooldown_guage_bottom_point_radians + (cooldown_guage_angle_height*cooldown_fill_percentage));
        canvas_context.beginPath();
        canvas_context.arc(weapon_bubble_xpos, weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_bottom_point_radians * Math.PI), (cooldown_guage_top_point_radians * Math.PI));
        canvas_context.arc((weapon_bubble_xpos - cooldown_guage_width), weapon_bubble_ypos, weapon_bubble_radius, (cooldown_guage_top_point_radians * Math.PI), (cooldown_guage_bottom_point_radians * Math.PI), true);
        canvas_context.lineTo(((weapon_bubble_xpos - cooldown_guage_width) - cooldown_guage_angle_adj_side_length + cooldown_guage_width), (weapon_bubble_ypos + cooldown_guage_angle_opp_side_length));
        canvas_context.fillStyle = "orange";       
        canvas_context.fill();       
    },
   */ 
    renderHealthBarModule: function(health_bar_module_xpos, health_bar_module_ypos, player)
    {
        var player_max_health = player.max_health;
        var player_current_health = player.current_health;
        var player_max_armour = player.max_health;
        var player_current_armour = player.current_armour;
        var diagonal_offset = 10;
        var canvas_line_width = 2;
        var health_bar_width = 13;
        var health_bar_height = 18;
        var strike_health_bar_margin = 4; //---this is the space between the "strike" and the health bars
        var strike_width = ((diagonal_offset + (strike_health_bar_margin * 2)) + ((5 + health_bar_width)*player_max_health));
        var strike_height = ((canvas_line_width/2) + (health_bar_height) + (canvas_line_width) + strike_health_bar_margin); //---strike_health_bar_scale is the scale of health bar height to strike height (some height)
        var strike_health_bar_scale = (strike_height/health_bar_height);
        var strike_offset = (strike_health_bar_scale * (diagonal_offset * 2));
        
        var container_height = (health_bar_module_ypos + strike_height + (10*1.75));
        var container_to_health_bar_scale = (container_height/health_bar_height);
        var container_diagonal_offset = ((diagonal_offset * 2) * container_to_health_bar_scale);
        if(player.has_armour == true)
        {
            var container_bottom_width = (health_bar_module_xpos + (strike_width*2) + 10);
        }
        else
        {
            var container_bottom_width = (health_bar_module_xpos + strike_width);
        }
        var container_top_width = (container_bottom_width + container_diagonal_offset);
        
        
        canvas_context.lineWidth = canvas_line_width;
        
        canvas_context.save();
        canvas_context.beginPath();
        canvas_context.moveTo(0, container_height);
        canvas_context.lineTo(container_bottom_width, container_height);
        canvas_context.lineTo(container_top_width, 0);
        canvas_context.lineTo(0, 0);
        canvas_context.strokeStyle = "#27E100";
        canvas_context.stroke();
        canvas_context.globalAlpha = 0.5;
        canvas_context.fillStyle = "#E7EEE6";
        canvas_context.fill();
        canvas_context.restore();
        
        canvas_context.save();
        canvas_context.beginPath();
        canvas_context.moveTo(canvas.width, container_height);
        canvas_context.lineTo(canvas.width - container_bottom_width, container_height);
        canvas_context.lineTo(canvas.width - container_top_width, 0);
        canvas_context.lineTo(canvas.width, 0);
        canvas_context.strokeStyle = "#27E100";
        canvas_context.stroke();
        canvas_context.globalAlpha = 0.5;
        canvas_context.fillStyle = "#E7EEE6";
        canvas_context.fill();
        canvas_context.restore();
        
        
        canvas_context.save();
        canvas_context.translate(health_bar_module_xpos, health_bar_module_ypos);
        this.healthBarContent(0, 0, player_max_health, player_current_health, diagonal_offset, canvas_line_width, health_bar_width, health_bar_height, strike_health_bar_margin, strike_width, strike_height, strike_health_bar_scale, strike_offset, "HEALTH", "#27E100", "#7FC600");
        if(player.has_armour == true)
        {
            this.healthBarContent(strike_width + 10, 0, player_max_health, player_current_armour, diagonal_offset, canvas_line_width, health_bar_width, health_bar_height, strike_health_bar_margin, strike_width, strike_height, strike_health_bar_scale, strike_offset, "ARMOUR", "#DA2F9E", "#EBA0D1");
        }
        
        canvas_context.restore();
    },
    
    healthBarContent: function(health_bar_module_xpos, health_bar_module_ypos, player_max_health, player_current_health, diagonal_offset, canvas_line_width, health_bar_width, health_bar_height, strike_health_bar_margin, strike_width, strike_height, strike_health_bar_scale, strike_offset, title, stroke_color, fill_color)
    {
        canvas_context.lineWidth = canvas_line_width;
        canvas_context.save();
        canvas_context.translate(health_bar_module_xpos, health_bar_module_ypos);
        //---draw the bars
        for(var bar = 0; bar < player_max_health; bar++)
        {
            var xpos;
            var ypos;
            var bar_margin = 5;
            xpos = ((diagonal_offset + 10) + ((canvas_line_width/2) + bar_margin + (canvas_line_width/2) + (health_bar_width/2) + ((health_bar_width + canvas_line_width + bar_margin) * bar)));
            ypos = ((canvas_line_width/2) + (health_bar_height/2));
            canvas_context.save();
            canvas_context.beginPath();
            canvas_context.moveTo((xpos - (health_bar_width/2) + diagonal_offset), (ypos - (health_bar_height/2)));
            canvas_context.lineTo((xpos + (health_bar_width/2) + diagonal_offset), (ypos - (health_bar_height/2)));
            canvas_context.lineTo((xpos + (health_bar_width/2) - diagonal_offset), (ypos + (health_bar_height/2)));
            canvas_context.lineTo((xpos - (health_bar_width/2) - diagonal_offset), (ypos + (health_bar_height/2)));
            canvas_context.lineTo((xpos - (health_bar_width/2) + diagonal_offset), (ypos - (health_bar_height/2)));
            canvas_context.globalAlpha = 0.7;
            canvas_context.fillStyle = fill_color;
            if(bar < player_current_health)
            {
                canvas_context.fill();
            }
            canvas_context.strokeStyle = stroke_color;
            canvas_context.stroke();
            canvas_context.restore();
        }
        canvas_context.globalAlpha = 1;
        //---the "strike"
        canvas_context.beginPath();
        canvas_context.moveTo(strike_offset,0);
        canvas_context.lineTo(0, strike_height);
        canvas_context.lineTo(strike_width, strike_height);
        canvas_context.strokeStyle = stroke_color;
        canvas_context.stroke();
        //---add the text
        canvas_context.font = "italic 10px Arial";
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "start";
        canvas_context.fillStyle = stroke_color;
        canvas_context.fillText(title, diagonal_offset,(strike_height + (10/2) + (canvas_line_width/2) + strike_health_bar_margin));
        canvas_context.restore();
    },
    
    scoreContainer: function(score_container_xpos, score_container_ypos, score)
    {
        //---add the text
        canvas_context.save();
        canvas_context.translate(score_container_xpos, score_container_ypos);
        canvas_context.font = "italic 10px Arial";
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "start";
        canvas_context.fillStyle = "blue";
        canvas_context.fillText("SCORE",0,0);
        canvas_context.font = "italic 15px Arial";
        canvas_context.fillText(score,20,20);
        canvas_context.restore();
    },
    
    drawBorders: function()
    {
        var offscreen_portion = -10;
        var h = 10;
        var corner_radius = 10;
        this.drawCorner(0, 0, 0, offscreen_portion, h, corner_radius);
        this.drawCorner(canvas.width, 0, 90, offscreen_portion, h, corner_radius);
        this.drawCorner(canvas.width, canvas.height, 180, offscreen_portion, h, corner_radius);
        this.drawCorner(0, canvas.height, 270, offscreen_portion, h, corner_radius);
        
        var border_height = 12;
        canvas_context.fillStyle = "#27E100";
        canvas_context.fillRect((offscreen_portion + (h * 2) + (corner_radius *3)), offscreen_portion, (canvas.width - ((offscreen_portion + (h * 2) + (corner_radius *3)) * 2)), border_height);
        canvas_context.fillRect((offscreen_portion), (offscreen_portion + (h * 2) + (corner_radius *3)), border_height, (canvas.height - ((offscreen_portion + (h * 2) + (corner_radius *3)) * 2)));
        canvas_context.fillRect((offscreen_portion + (h * 2) + (corner_radius *3)), (canvas.height - border_height - offscreen_portion), (canvas.width - ((offscreen_portion + (h * 2) + (corner_radius *3)) * 2)), border_height);
        canvas_context.fillRect((canvas.width - border_height - offscreen_portion), (offscreen_portion + (h * 2) + (corner_radius *3)), border_height, (canvas.height - ((offscreen_portion + (h * 2) + (corner_radius *3)) * 2)));
    },
    
    drawCorner: function(corner_xpos, corner_ypos, corner_rotation, offscreen_portion, h, corner_radius)
    {
        canvas_context.save();
        canvas_context.translate(corner_xpos, corner_ypos);
        canvas_context.rotate(corner_rotation * (Math.PI/180));
        canvas_context.beginPath();
        canvas_context.moveTo(offscreen_portion, offscreen_portion);
        canvas_context.lineTo((offscreen_portion + (h * 2) + (corner_radius *3)), offscreen_portion);
        canvas_context.lineTo((offscreen_portion + (h * 2) + (corner_radius *3)), (offscreen_portion + (h)));
        canvas_context.arc((offscreen_portion + (h * 2) + (corner_radius *2)), (offscreen_portion + (h)), corner_radius, (0), ((0.5 * Math.PI)));
        canvas_context.lineTo((offscreen_portion + (h) + (corner_radius *2)), (offscreen_portion + (h) + corner_radius));
        canvas_context.arc((offscreen_portion + (h) + (corner_radius *2)), (offscreen_portion + (h) + (corner_radius * 2)), corner_radius, (1.5 * Math.PI), ((Math.PI)), true);
        canvas_context.lineTo((offscreen_portion + (h) + (corner_radius)), (offscreen_portion + (h * 2) + (corner_radius * 2)));
        canvas_context.arc((offscreen_portion + (h)), (offscreen_portion + (h*2) + (corner_radius * 2)), corner_radius, (0), ((0.5 * Math.PI)));
        canvas_context.lineTo((offscreen_portion), (offscreen_portion + (h*2) + (corner_radius * 3)));
        canvas_context.lineTo(offscreen_portion, offscreen_portion);
        canvas_context.fillStyle = "#99928E";
        canvas_context.strokeStyle = "#27E100";
        canvas_context.lineWidth = 4;
        canvas_context.stroke();
        canvas_context.fill();
        canvas_context.restore();
    }
}