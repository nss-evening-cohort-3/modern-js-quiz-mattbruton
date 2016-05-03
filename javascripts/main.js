"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let select = require('./select.js');


$(document).ready(function() {
  $("#title-screen").show();


  $("#title-screen").click(function() {
    $("#title-screen").hide();
    $("#playerOne_charSelect").show();
    $("#playerOne_name_select").show();
  });


  $("#p1confirm").click(function() {
    console.log("you're clicking it");
    $("#playerOne_charSelect").hide();
    $("#playerTwo_charSelect").show();
    $("#playerTwo_name_select").show();
  });

  $("#p2confirm").click(function() {
    $("#playerTwo_charSelect").hide();
    $("#playerTwo_name_select").hide();
  });

  $("#fightbtn").click(function() {
    console.log("clicking pt 2");
    $("#enter_battledome").hide();
    $("battledome").show();
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
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--typeP1":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--modelP1":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--weaponP1":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--modifyP1":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--confirmP1":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--nameP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--typeP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--modelP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--weaponP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--modifyP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--confirmP2":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--warning":
        moveAlong = ($("#player1-name").val() !== "");
        break;
      case "card--battledome":
        moveAlong = ($("#player1-name").val() !== "");
        break;
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

select.playerTest(select.PlayerOne);
select.playerTest(select.PlayerTwo);

robots.testLink();
robots.TestBot.setWeapon(new weapons.WeaponCache.ChaosGrenade());
robots.TestBot.setMod(new mods.Armory.Empathy());