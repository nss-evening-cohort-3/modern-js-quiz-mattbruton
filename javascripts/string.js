"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let combat = require('./combat.js');

let robotDodgeString = (offensivePlayer, defensivePlayer) => {
  let dodgeString = `<h5>${defensivePlayer.name} dodges ${offensivePlayer.name}'s attack!</h5>`;
  if ($('#combatText').children().length > 7) {
    $('#combatText').children('h5:first').remove();
  }
  $('#combatText').append(dodgeString);
};

let robotToCard = (player, playerElement) => {
  let playerString = "";
  playerString += `<h1>${player.name}</h1>`;
  playerString += `<h4>Health: ${player.health}</h4>`;
  playerString += `<h4>Shield: ${player.shield}</h4>`;
  playerString += `<h4>Type: ${player.type.type}</h4>`;
  playerString += `<h4>Model: ${player.model.model}</h4>`;
  $(playerElement).html(`${playerString}`);
};

let robotsCombatText = (offensivePlayer, defensivePlayer, damage) => {

  if ($('#combatText').children().length > 7) {
    $('#combatText').children('h5:first').remove();
  }
    $('#combatText').append(`<h5>${offensivePlayer.name} attacks ${defensivePlayer.name} with a ${offensivePlayer.weapon.wepName} for ${damage} damage!</h5>`);

  
};

module.exports = {
  robotToCard,
  robotsCombatText,
  robotDodgeString
};