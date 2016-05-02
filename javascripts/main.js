"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');

$(document).ready(function() {
 $("#title-screen").show();

 $("#title-screen").click(function(e) {
  $("#title-screen").hide();
  $("#playerOne_charSelect").show();
  $("#playerOne_name_select").show();
 });

 $(".card__link").click(function(e) {
    var nextCard = $(this).attr("next");
    console.log("next", nextCard );
    var moveAlong = false;


    switch (nextCard) {
      case "card--class":
        moveAlong = ($("#player-name").val() !== "");
        console.log("cardClass", moveAlong );
        break;
      case "card--typeP1":
        moveAlong = ($("#player-name").val() !== "");
        console.log("cardWeapon", moveAlong );
        break;
      case "card--modelP1":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--weaponP1":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--modifyP1":
        moveAlong = ($("#player-name").val() !== "");
        break;
      case "card--confirmP1":
        moveAlong = ($("#player-name").val() !== "");
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

// });

});



robots.testLink();
robots.TestBot.setWeapon(new weapons.WeaponCache.ChaosGrenade());
robots.TestBot.setMod(new mods.Armory.Empathy());