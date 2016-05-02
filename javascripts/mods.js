"use strict";

let Armory = {};

  ///////////////////////
 //     Base Mod      //
///////////////////////


Armory.Modification = function() {
  this.mods = null;

  return this.mods;
};


  ///////////////////////
 //    Specific  Mods //
///////////////////////


/* Restorative Nanobots will heal the robot for a small amount after each round of combat. */


Armory.Nanobots = function() {
  this.modName = "Restorative Nanobots";
  this.nanoCheck = true;
  this.healthBonus = 5;
  this.damageBonus = 0;
  this.evasionBonus = 0;
  this.shieldBonus = 5;
  this.empCheck = 0;
};

Armory.Nanobots.prototype = new Armory.Modification();


/* Reinforced plating will give the robot a slightly higher base health. */


Armory.Plating = function() {
  this.modName = "Reinforced Plating";
  this.nanoCheck = false;
  this.healthBonus = 25;
  this.damageBonus = 0;
  this.evasionBonus = 0;
  this.shieldBonus = 10;
  this.empCheck = 0;
};

Armory.Plating.prototype = new Armory.Modification();


/* Find Weakness will look for flaws in opponent's frame, slight % increase in damage. */


Armory.Weakness = function() {
  this.modName = "Find Weakness";
  this.nanoCheck = false;
  this.healthBonus = 0;
  this.damageBonus = 10;
  this.evasionBonus = 0;
  this.shieldBonus = 0;
  this.empCheck = 0;
};

Armory.Weakness.prototype = new Armory.Modification();


/* Updated Firmware resolves a bug which weakened the robot's attack anticipation calculations, increases 
   Robot's evasion total slightly. */


Armory.Firmware = function() {
  this.modName = "Updated Firmware";
  this.nanoCheck = false;
  this.healthBonus = 10;
  this.damageBonus = 0;
  this.evasionBonus = 5;
  this.shieldBonus = 0;
  this.empCheck = 0;
};

Armory.Firmware.prototype = new Armory.Modification();


/* Enhance Shields grants the Robot a shield at the beginning of combat. */


Armory.EnhShield = function() {
  this.modName = "Enhanced Shielding";
  this.nanoCheck = false;
  this.healthBonus = 0;
  this.damageBonus = 0;
  this.evasionBonus = 3;
  this.shieldBonus = 25;
  this.empCheck = 0;
};

Armory.EnhShield.prototype = new Armory.Modification();


/* Empathy Virus slowly causes the opponent's Robot to lose urge to fight, eventually stopping for a round.  */


Armory.Empathy = function() {
  this.modName = "Empathy Virus";
  this.nanoCheck = false;
  this.healthBonus = 0;
  this.damageBonus = 0;
  this.evasionBonus = 0;
  this.shieldBonus = 5;
  this.empCheck = 1;
};

Armory.Empathy.prototype = new Armory.Modification();

module.exports = {
  Armory
};