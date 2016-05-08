"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let combat = require('./combat.js');
let string = require('./string.js');

/* characterCreationView sets which elements are visable on load and upon switching between Player One and 
Player Two in the creation process */

let characterCreationView = () => {
    $('#model_select').hide();
    $('#weapon_select').hide();
    $('#mod_select').hide();
    $('#droneModels').hide();
    $('#tankbotModels').hide();
    $('#psybotModels').hide();
    $('#battledome').hide();
    $('#type_select').show();
};

/* playerCount is used by robotCheck function for switching which Player is being augmented and which 
header is displayed when the user clicks a button in the modify_select element */

let playerCount = 0;

/* player variable changes in the robotCheck function based on previous variable playerCount's value */

let player;

/* conditional statement that is run at the end of the first character creation process to begin storing values
for next player */

let robotCheck = () => {
    if (playerCount <= 0) {
        player = robots.PlayerOne;
    } else {
        player = robots.PlayerTwo;
    }
};

robotCheck();

$(document).ready(function() {


    console.log(player);


    characterCreationView();

    /* When a type button is clicked, the user's type selection is stored in their Player object, the type view is hidden,
    and based on the ID of the clicked button, models for that type are displayed in the next view. */
    $('.typebtn').click(function(event) {

        $('#type_select').hide();
        player.setType(event.target.id);

        $('#model_select').show();
        $('#model_buttons').show();

        if (event.target.id == "Drone") {
            $('#droneModels').show();
        } else if (event.target.id == "Tankbot") {
            $('#tankbotModels').show();
        } else {
            $('#psybotModels').show();
        }
    });


    /* When a model button is clicked, the user's model selection is stored in their Player object, the model view
    is hidden, and the weapon selection screen is shown. */
    $('.modelbtn').click(function(event) {

        $('#model_select').hide();
        player.setModel(event.target.id);
        $('#weapon_select').show();
    });



    $('.wepbtn').click(function(event) {
        $('#weapon_select').hide();
        player.setWeapon(new weapons.WeaponCache[event.target.id]());

        $('#mod_select').show();
    });

    $('.modbtn').click(function(event) {
        player.setMod(new mods.Armory[event.target.id]());


        console.log("1", robots.PlayerOne);
        characterCreationView();
        playerCount++;

        if (playerCount >= 0) {
            $("h1.first").replaceWith('<h1>Player Two</h1>');
        }

        robotCheck();

        if (playerCount == 2) {
            $('#robot_creation').hide();
            $('#playerHeader').hide();
            $('#battledome').show();
            string.robotToCard(robots.PlayerOne, "#playerOneCard");
            string.robotToCard(robots.PlayerTwo, "#playerTwoCard");
        }
        console.log(playerCount);

    });


    $('#battleStartBtn').click(function() {
        console.log("2", robots.PlayerTwo);
        combat.attack(robots.PlayerOne, robots.PlayerTwo);
        combat.attack(robots.PlayerTwo, robots.PlayerOne);
        combat.shieldCheck(robots.PlayerOne);
        combat.shieldCheck(robots.PlayerTwo);
        string.robotToCard(robots.PlayerOne, "#playerOneCard");
        string.robotToCard(robots.PlayerTwo, "#playerTwoCard");
        combat.victoryCheck(robots.PlayerOne, robots.PlayerTwo);
        console.log("p2 evasion", combat.evasion(robots.PlayerTwo));
    });

});