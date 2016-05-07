"use strict";
let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');

let disableCount = 0;

let damage = (player) => {
  let totalDamage = 0;
  totalDamage += player.minDamage;
  totalDamage += Math.floor(Math.random() * player.additionalDamageRange);
  return totalDamage;
};

let attack = (offensivePlayer, defensivePlayer) => {
  defensivePlayer.health -= damage(offensivePlayer);
  return defensivePlayer.health;
};

let evasion = () => {

};

let victoryCheck = (firstPlayer, secondPlayer) => {
  let victoryString = "";
  if (firstPlayer.health <= 0) 
    victoryString += `${secondPlayer} has defeated ${firstPlayer}!`; 
  if (secondPlayer.health <= 0)
    victoryString += `${firstPlayer} has defeated ${secondPlayer}!`; 
};

let playerToCard = (offensivePlayer, defensivePlayer) => {

};

module.exports = {
  damage,
  attack,
  evasion,
  victoryCheck,
  playerToCard
};