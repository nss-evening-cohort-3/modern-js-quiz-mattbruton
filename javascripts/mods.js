"use strict";

let Armory = {};

  ///////////////////////
 //     Base Mod      //
///////////////////////


Armory.Modification = function() {
  this.modName = null;
  this.nanoCheck = null;
  this.healthBonus = 0;
  this.damageBonus = 0;
  this.evasionBonus = 0;
  this.shieldBonus = 0;
  this.empCheck = 0;

  return this.modName;
};


  ///////////////////////
 //    Specific  Mods //
///////////////////////


/* Restorative Nanobots will heal the robot for a small amount after each round of combat. */


Armory.Nanobots = function() {
  this.modName = "Restorative Nanobots";

  this.nanoCheck += 1;
  this.healthBonus += 5;
  this.damageBonus += 0;
  this.evasionBonus += 0;
  this.shieldBonus += 5;
  this.empCheck += 0;
};

Armory.Nanobots.prototype = new Armory.Modification();


/* Reinforced plating will give the robot a slightly higher base health, minor shield. */


Armory.Plating = function() {
  this.modName = "Reinforced Plating";

  this.nanoCheck += 0;
  this.healthBonus += 25;
  this.damageBonus += 0;
  this.evasionBonus += 0;
  this.shieldBonus += 10;
  this.empCheck += 0;
};

Armory.Plating.prototype = new Armory.Modification();


/* Find Weakness will look for flaws in opponent's frame, slight increase in random damage. */


Armory.Weakness = function() {
  this.modName = "Find Weakness";

  this.nanoCheck += 0;
  this.healthBonus += 0;
  this.damageBonus += 4;
  this.evasionBonus += 0;
  this.shieldBonus += 0;
  this.empCheck += 0;
};

Armory.Weakness.prototype = new Armory.Modification();


/* Updated Firmware resolves a bug which weakened the robot's attack anticipation calculations, increases 
   Robot's evasion total slightly, minor health. */


Armory.Firmware = function() {
  this.modName = "Updated Firmware";

  this.nanoCheck += 0;
  this.healthBonus += 10;
  this.damageBonus += 0;
  this.evasionBonus += 5;
  this.shieldBonus += 0;
  this.empCheck += 0;
};

Armory.Firmware.prototype = new Armory.Modification();


/* Enhance Shields grants the Robot a shield at the beginning of combat, minor evasion. */


Armory.EnhShield = function() {
  this.modName = "Enhanced Shielding";

  this.nanoCheck += 0;
  this.healthBonus += 0;
  this.damageBonus += 0;
  this.evasionBonus += 3;
  this.shieldBonus += 25;
  this.empCheck += 0;
};

Armory.EnhShield.prototype = new Armory.Modification();


/* Empathy Virus slowly causes the opponent's Robot to lose urge to fight, eventually stopping for a round, minor shield.  */


Armory.Empathy = function() {
  this.modName = "Empathy Virus";

  this.nanoCheck += 0;
  this.healthBonus += 0;
  this.damageBonus += 0;
  this.evasionBonus += 0;
  this.shieldBonus += 5;
  this.empCheck += 1;
};

Armory.Empathy.prototype = new Armory.Modification();

module.exports = {
  Armory
};