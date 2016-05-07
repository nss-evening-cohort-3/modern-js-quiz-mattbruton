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

  this.health = 70;
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
  this.type = "Drone";
  this.health += this.healthBonus = 0;
  this.shield += this.shieldBonus = 0;
  this.evasion += this.evasionBonus = 10;
};

Robot.Drone.prototype = new Robot.Player();


  ///////////////////////
 //   Drone Models    //
///////////////////////


Robot.ShadowStrike = function() {
  this.health += this.healthBonus = 5;
  this.model = "ShadowStrike";
  this.evasion += this.evasionBonus = 5;
};

Robot.ShadowStrike.prototype = new Robot.Drone();

Robot.LittleBiter = function() {
  this.healthBonus = 15;
  this.model = "LittleBiter";
  this.evasion += this.evasionBonus = 0;
};

Robot.LittleBiter.prototype = new Robot.Drone();

Robot.BulletShooter = function() {
  this.health += this.healthBonus = 0;
  this.model = "BulletShooter";
  this.evasion += this.evasionBonus = 10;
};

Robot.BulletShooter.prototype = new Robot.Drone();


/* Tankbots have slightly higher health than the other two types. No Bonus to evasion since they have heavier and 
   sturdier frames than other types. */


Robot.Tankbot = function() {
  this.type = "Tankbot";
  this.health += this.healthBonus = 40;
  this.shield += this.shieldBonus = 0;
  this.evasion += this.evasionBonus = 0;
};

Robot.Tankbot.prototype = new Robot.Player();


  ///////////////////////
 //  Tankbot Models   //
///////////////////////


Robot.Tobor = function() {
  this.health += this.healthBonus = 15;
  this.model = "T.O.B.O.R.";
  this.evasion += this.evasionBonus = 5;
};

Robot.Tobor.prototype = new Robot.Tankbot();

Robot.RockBot = function() {
  this.health += this.healthBonus = 25;
  this.model = "RockBot";
  this.shield += this.shieldBonus = 10;
};

Robot.RockBot.prototype = new Robot.Tankbot();

Robot.TankbotPlus = function() {
  this.health += this.healthBonus = 15;
  this.model = "TankbotPlus";
  this.shield += this.shieldBonus = 20;
};

Robot.TankbotPlus.prototype = new Robot.Tankbot();


/* Psybots will have stronger shields, take more damage as rounds increase due to their more fragile frames.
   Slight bonus to evading attacks based on their ability to calculate opponents next move. */


Robot.Psybot = function() {
  this.type = "Psybot";
  this.health += this.healthBonus = 10;
  this.shield += this.shieldBonus = Math.floor(Math.random() * 5 + 20);
  this.evasion += this.evasionBonus = 5;
};

Robot.Psybot.prototype = new Robot.Player();


  ///////////////////////
 //   Psybot Models   //
///////////////////////


Robot.Mindmelter = function() {
  this.health += this.healthBonus = 5;
  this.model = "Mindmelter";
  this.shield += this.shieldBonus = 20;
};

Robot.Mindmelter.prototype = new Robot.Psybot();

Robot.Brainstorm = function() {
  this.health += this.healthBonus = 5;
  this.model = "Brainstorm";
  this.shield += this.shieldBonus = 15;
  this.evasion += this.evasionBonus = 5;
};

Robot.Brainstorm.prototype = new Robot.Psybot();

Robot.Banshee = function() {
  this.health += this.healthBonus = 10;
  this.model = "Banshee";
  this.health += this.shieldBonus = 25;
};

Robot.Banshee.prototype = new Robot.Psybot();


/* Functions for setting weapons, modifications, types, and models to robot players */

Robot.Player.prototype.setWeapon = function(newWeapon) {
  this.weapon = newWeapon;

  this.empCheck = newWeapon.empCheck;
  this.minDamage = newWeapon.minDamage;
  this.additionalDamageRange = newWeapon.additionalDamageRange;
};

Robot.Player.prototype.setMod = function(newMod) {
  this.mods = newMod;

  this.additionalDamageRange += newMod.damageBonus;
  this.health += newMod.healthBonus;
  this.nanoCheck = newMod.nanoCheck;
  this.evasion += newMod.evasionBonus;
  this.shield += newMod.shieldBonus;
  this.empCheck += newMod.empCheck;
};

Robot.Player.prototype.setType = function(newType) {
  this.type = new Robot[newType];
  this.health += this.type.healthBonus;
  this.shield += this.type.shieldBonus;
  this.evasion += this.type.evasionBonus;

  return this.type;
};

Robot.Player.prototype.setModel = function(newModel) {
  this.model = new Robot[newModel];
  this.health += this.model.healthBonus;
  this.shield += this.model.shieldBonus;
  this.evasion += this.model.evasionBonus;

  return this.model;
};


/* Test Robots for dev use */

let PlayerOne = new Robot.Player();
let PlayerTwo = new Robot.Player();
// PlayerOne.setModel("");
// PlayerOne.setType("Drone");
// PlayerOne.setModel("LittleBiter");
// PlayerOne.setWeapon(new weapons.WeaponCache.MurderKnife());
// PlayerOne.setMod(new mods.Armory.Weakness())

console.log(PlayerOne.health);
console.log(PlayerTwo);
console.log(PlayerOne);

/* Export this business */

module.exports = {
  Robot,
  PlayerOne,
  PlayerTwo
};
