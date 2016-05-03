"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');

let PlayerOne = new robots.Robot.Player();
let PlayerTwo = new robots.Robot.Player();

let playerTest = (player) => console.log(player);

// let setFrame = (player) => player 

module.exports = {
  PlayerOne,
  PlayerTwo,
  playerTest
};