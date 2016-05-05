"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let select = require('./select.js');



$(document).ready(function() {

  let playerCount = 0;
  let pickModel;

  $("#title-screen").show();


  $("#title-screen").click(function() {
    $("#title-screen").hide();
    $("#charSelect").show();
    $("#name_select").show();
  });


  $("#confirm").click(function() {
    console.log("you're clicking it");
    playerCount++;
    $("#charSelect").hide();
    $("#charSelect").show();
    $("#name_select").show();
  });

  // $("#confirm").click(function() {
  //   $("#playerTwo_charSelect").hide();
  //   $("#playerTwo_name_select").hide();
  // });

  $("#fightbtn").click(function() {
    console.log("clicking pt 2");
    $("#enter_battledome").hide();
    $("battledome").show();
  });
  

  $('#player-name').keyup(function(){
    if (playerCount < 1) {
      robots.PlayerOne.name = $(this).val();
    } else {
      robots.PlayerTwo.name = $(this).val();
    }
  });

  $('#model_select').click(function(e) {
    if (playerCount < 1) {
      // if (e.target == "Drone"){
        pickModel = e.target.id;
        robots.PlayerOne.setModel(pickModel);
        console.log(robots.PlayerOne);
      // }
      // robots.PlayerOne.setType(e.target.id());
    // }
    }
});
  /*
    When the next/confirm button is clicked, the user is taken to the next card in the character creation order. 
    If the user hasn't typed their name/selected the corresponding field, they will not be taken to the next 
    screen.
  */

  $(".card__link").click(function(e) {
    var nextCard = $(this).attr("next");
    var moveAlong = false;


    switch (nextCard) {
      case "card--name":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--type":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--model":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--weapon":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--modify":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--confirm":
        moveAlong = ($("#player-name").val() !== "");
        break;
      // case "card--nameP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--typeP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--modelP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--weaponP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--modifyP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--confirmP2":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--warning":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
      // case "card--battledome":
      //   moveAlong = ($("#player1-name").val() !== "");
      //   break;
    }

    if (moveAlong) {
      $(".card").hide();
      $("." + nextCard).show();
    }

  });

  /*
    When the back button clicked, move back a view
   */

  $(".card__back").click(function(e) {
    var previousCard = $(this).attr("previous");
    $(".card").hide();
    $("." + previousCard).show();
  });

});

robots.PlayerOne.setWeapon(new weapons.WeaponCache.ChaosGrenade());

robots.TestBot.setWeapon(new weapons.WeaponCache.ChaosGrenade());
robots.TestBot.setMod(new mods.Armory.Empathy());