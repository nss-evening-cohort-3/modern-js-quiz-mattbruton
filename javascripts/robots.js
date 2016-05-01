"use strict";

let weapons = require('./weapons.js');
let mods = require('./mods.js');

let Robot = {};

  ///////////////////////
 //    Base Robot     //
///////////////////////


Robot.Player = function() {
  this.type = null;
  this.model = null;
  this.mods = null;
  this.weapon = "Empty Holster";
  this.name = "Malfunctioning Scrapbot";
  this.health = Math.floor(Math.random() * 20 + 80);
  this.shield = 0;
  this.dmgInc = 0;
  this.evasion = 0;
};


  ///////////////////////
 //        Types      //
///////////////////////


/* Drones serve the "Agility" type role in this version of Robot Battledome. Slightly lower base health, but heightened
   ability to avoid opponent attacks. They will also have the ability to do more damage as the rounds go on, exploiting
   flaws in their opponent's frame. */


Robot.Drone = function() {
  this.health -= 10;
  this.type = "Drone";
  this.evasion += 10;
};

Robot.Drone.prototype = new Robot.Player();


  ///////////////////////
 //   Drone Models    //
///////////////////////


Robot.ShadowStrike = function() {
  this.health += 5;
  this.model = "ShadowStrike";
  this.evasion += 10;
};

Robot.ShadowStrike.prototype = new Robot.Drone();

Robot.LittleBiter = function() {
  this.health -= 2;
  this.model = "LittleBiter";
  this.dmgInc += 5;
};

Robot.LittleBiter.prototype = new Robot.Drone();

Robot.BulletShooter = function() {
  this.health -= 5;
  this.model = "BulletShooter";
  this.evasion += 5;
};

Robot.BulletShooter.prototype = new Robot.Drone();


/* Tankbots have slightly higher health than the other two types. No Bonus to evasion since they have heavier and 
   sturdier frames than other types. */


Robot.Tankbot = function() {
  this.health += 10;
  this.type = "Tankbot";
};

Robot.Tankbot.prototype = new Robot.Player();


  ///////////////////////
 //  Tankbot Models   //
///////////////////////


Robot.Tobor = function() {
  this.health += 5;
  this.model = "T.O.B.O.R.";
  this.evasion += 5;
};

Robot.Tobor.prototype = new Robot.Tankbot();

Robot.RockBot = function() {
  this.health += 25;
  this.model = "RockBot";
  this.shield += 10;
};

Robot.RockBot.prototype = new Robot.Tankbot();

Robot.Tankbot2020 = function() {
  this.health += 10;
  this.model = "Tankbot2020";
  this.shield += 10;
};

Robot.Tankbot2020.prototype = new Robot.Tankbot();


/* Psybots will have stronger shields, take more damage as rounds increase due to their more fragile frames.
   Slight bonus to evading attacks based on their ability to calculate opponents next move. */


Robot.Psybot = function() {
  this.health -= 10;
  this.type = "Psybot";
  this.shield += Math.floor(Math.random() * 20 + 5);
  this.evasion += 5;
};

Robot.Psybot.prototype = new Robot.Player();


  ///////////////////////
 //   Psybot Models   //
///////////////////////


Robot.Mindmelter = function() {
  this.health -= 5;
  this.model = "Mindmelter";
  this.shield += 20;
};

Robot.Mindmelter.prototype = new Robot.Psybot();

Robot.Brainstorm = function() {
  this.health -= 5;
  this.model = "Brainstorm";
  this.shield += 15;
  this.evasion += 5;
};

Robot.Brainstorm.prototype = new Robot.Psybot();

Robot.Banshee = function() {
  this.health -= 10;
  this.model = "Banshee";
  this.shield += 25;
};

Robot.Banshee.prototype = new Robot.Psybot();


// remove testbot before doing pull request. for testing purposes. duh.

Robot.Player.prototype.setWeapon = function(newWeapon) {
  this.weapon = newWeapon;
};

Robot.Player.prototype.setMod = function(newMod) {
  this.mods = newMod;
};

let TestBot = new Robot.Banshee();

let testLink = () => console.log(TestBot);



module.exports = {
  Robot,
  testLink,
  TestBot
};
