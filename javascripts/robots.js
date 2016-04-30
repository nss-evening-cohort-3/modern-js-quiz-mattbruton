"use strict";

let Robot = {};

Robot.Player = function(name) {
  this.type = null;
  this.model = null;
  this.weapon = null;
  this.name = name || "Malfunctioning Scrapbot";
  this.health = Math.floor(Math.random() * 15 + 60);
  this.shield = null;
  this.dmgInc = null;
  this.evasion = null;
};

let TestBot = new Robot.Player();


let testLink = () => console.log(TestBot);

module.exports = {
  Robot,
  TestBot,
  testLink
};
