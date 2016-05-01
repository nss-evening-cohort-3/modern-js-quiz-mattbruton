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
};

Armory.Nanobots.prototype = new Armory.Modification();


/* Armor plating will give the robot a slightly higher base health. */


Armory.Plating = function() {
  
};

Armory.Plating.prototype = new Armory.Modification();


/* Find Weakness will look for flaws in opponent's frame, slight % increase in damage. */


Armory.Weakness = function() {
  
};

Armory.Weakness.prototype = new Armory.Modification();


/* Updated Firmware resolves a bug which weakened the robot's attack anticipation calculations, increases 
   Robot's evasion total slightly. */


Armory.Firmware = function() {
  
};

Armory.Firmware.prototype = new Armory.Modification();


/* Enhance Shields grants the Robot a shield at the beginning of combat. */


Armory.EnhShield = function() {
  
};

Armory.EnhShield.prototype = new Armory.Modification();


/* Empathy Virus slowly causes the opponent's Robot to lose urge to fight, dealing less damage with each attack
    as combat goes on.  */


Armory.Empathy = function() {
  
};

Armory.Empathy.prototype = new Armory.Modification();

module.exports = {
  Armory
};