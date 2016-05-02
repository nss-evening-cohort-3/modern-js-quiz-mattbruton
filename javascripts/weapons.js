"use strict";

let WeaponCache = {};

  ///////////////////////
 //     Base Weapon   //
///////////////////////


WeaponCache.Weapon = function() {
  this.wepName = null;
  this.damage += 0;
  this.dmgInc += 0;
};


  ///////////////////////
 //  Modified Weapons //
///////////////////////


/* EMP Rifle has lower damage, but will add functionality on chance to disable the oppenent bot for a round. */


WeaponCache.EmpRifle = function() {
  this.wepName = "E.M.P. Rifle";
  this.damage = Math.floor(Math.random() * 3 + 5);
  this.empCheck = 1;
};

WeaponCache.EmpRifle.prototype = new WeaponCache.Weapon();


/* Megazapper is a fairly straight-forward weapon. Smaller range in randomness, but gives up highest
   possible top-end for consistency. */


WeaponCache.Megazapper = function() {
  this.wepName = "MegaZapper";
  this.damage = Math.floor(Math.random() * 3 + 10);
  this.empCheck = 0;
};

WeaponCache.Megazapper.prototype = new WeaponCache.Weapon();


/* Chaos Grenade has the highest top-end for damage, but could also leave you hitting like a wet noodle.
   If time permits, will tweak the damage numbers to come up with something balanced. */


WeaponCache.ChaosGrenade = function() {
  this.wepName = "Chaos Grenade";
  this.damage = (1 + Math.floor(Math.random() * 18));
  this.empCheck = 0;
};

WeaponCache.ChaosGrenade.prototype = new WeaponCache.Weapon();


/* Murder Knife is a place holder weapon. */

WeaponCache.MurderKnife = function() {
  this.wepName = "MurderKnife";
  this.damage += Math.floor(Math.random() * 3 + 7);
  this.empCheck = 0;
};

WeaponCache.MurderKnife.prototype = new WeaponCache.Weapon();


/* Micro Wave is a place holder weapon. */


WeaponCache.MicroWave = function() {
  this.wepName = "Micro Wave";
  this.damage += Math.floor(Math.random() * 2 + 2);
  this.empCheck = 0;
};

WeaponCache.MicroWave.prototype = new WeaponCache.Weapon();


/* Plastic Spork is a place holder weapon. */


WeaponCache.PlasticSpork = function() {
  this.wepName = "Plastic Spork";
  this.damage += Math.floor(Math.random() * 2 + 3);
  this.empCheck = 0;
};

WeaponCache.PlasticSpork.prototype = new WeaponCache.Weapon();

module.exports = {
  WeaponCache
};