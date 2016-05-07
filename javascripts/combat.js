"use strict";
let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let string = require('./string.js');

let disableCount = 0;

let damage = (player) => {
  let totalDamage = 0;
  totalDamage += player.minDamage;
  totalDamage += Math.floor(Math.random() * player.additionalDamageRange);
  return totalDamage;
};

let attack = (offensivePlayer, defensivePlayer) => {
  
  let dmgNumber = damage(offensivePlayer);

  defensivePlayer.health -= dmgNumber;
  string.robotsCombatText(offensivePlayer, defensivePlayer, dmgNumber);

  return defensivePlayer.health;
};

let evasion = (player) => {
  let evasionCheck = false;
  if (player.evasion >= Math.floor(Math.random() * 100)) {
    evasionCheck = true;
  }

  return evasionCheck;
};

let victoryCheck = (firstPlayer, secondPlayer) => {
  let victoryString = "";
  if (firstPlayer.health <= 0) 
    victoryString += `${secondPlayer} has defeated ${firstPlayer}!`; 
  if (secondPlayer.health <= 0)
    victoryString += `${firstPlayer} has defeated ${secondPlayer}!`; 
};


module.exports = {
  damage,
  attack,
  evasion,
  victoryCheck
};