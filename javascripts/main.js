"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');



robots.testLink();
robots.TestBot.setWeapon(new weapons.WeaponCache.EmpRifle());