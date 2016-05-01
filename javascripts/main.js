"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');



robots.testLink();
robots.TestBot.setWeapon(new weapons.WeaponCache.EmpRifle());
robots.TestBot.setMod(new mods.Armory.Nanobots());