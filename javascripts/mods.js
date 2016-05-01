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
  this.empCheck = false;
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
  this.empCheck = false;
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
  this.empCheck = false;
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
  this.empCheck = false;
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
  this.empCheck = false;
};

Armory.EnhShield.prototype = new Armory.Modification();


/* Empathy Virus slowly causes the opponent's Robot to lose urge to fight, dealing less damage with each attack
    as combat goes on.  */


Armory.Empathy = function() {
  this.modName = "Empathy Virus";
  this.nanoCheck = false;
  this.healthBonus = 0;
  this.damageBonus = 0;
  this.evasionBonus = 0;
  this.shieldBonus = 5;
  this.empCheck = true;
};

Armory.Empathy.prototype = new Armory.Modification();

module.exports = {
  Armory
};