"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let select = require('./select.js');

let nextPlayer = () => {
  $('#model_select').hide();
  $('#weapon_select').hide();
  $('#mod_select').hide();
  $('#droneModels').hide();
  $('#tankbotModels').hide();
  $('#psybotModels').hide();
  $('#type_select').show();
}

let playerCount = 0;
let player;

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


  nextPlayer();

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
    console.log("2", robots.PlayerTwo);
    console.log("1", robots.PlayerOne)
    nextPlayer();
    playerCount++;

    if (playerCount >= 0) {
    $("h1.first").replaceWith('<h1>Player Two</h1>');
    }

    robotCheck();

    if (playerCount == 2) {
      $('#robot_creation').hide();
      $('#playerHeader').hide();
    }
    console.log(playerCount);
  });

});