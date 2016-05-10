(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let string = require('./string.js');

/* checks to see if the player has selected the restorative nanobot modification for use in later function */

let nanobotCheck = (player) => {
    let nanoChecker = false;
    if (player.nanoCheck > 0) {
        nanoChecker = true;
    }
    return nanoChecker;
};

/* if player has selected restorative nanobots, they are healed for the amount randomly generated within this function */

let nanoHeal = () => {
    let nanoHealAmount = Math.floor(Math.random() * 5);

    return nanoHealAmount;
};

/* this is the function for calculating player damage. it takes the minimum damage stat from a weapon and adds
a random number in the additional damage range to the minimum. */

let damage = (player) => {
    let totalDamage = 0;
    totalDamage += player.minDamage;
    totalDamage += Math.floor(Math.random() * player.additionalDamageRange);
    return totalDamage;
};

/* checks if the shield is less than zero and sets it to zero */

let shieldCheck = (player) => {
    if (player.shield < 0) {
        player.shield = 0;
    }
    return player;
};

/* give the player a 1 in 8 chance to cause opponent to not deal damage in a round of combat. */

let empathyCheck = (player) => {
    let empathy = false;
    if (player.empCheck > Math.floor(Math.random() * 8)) {
        empathy = true;
    }
    return empathy;
};

/* function that calls the other combat functions depending on conditions. checks if player has restorative nanobots,
 empathy virus mod, evasion, or a shield before deducting health based on their opponent's attack. */

let attack = (offensivePlayer, defensivePlayer) => {

    let dmgNumber = damage(offensivePlayer);
    let healNumber = nanoHeal(defensivePlayer);

    if (nanobotCheck(defensivePlayer) === true) {
        defensivePlayer.health += nanoHeal();
        string.robotNanobotHealString(defensivePlayer, nanoHeal);
    }

    if (empathyCheck(defensivePlayer) === true) {
        string.robotEmpathyString(offensivePlayer, defensivePlayer);
    } else if (evasion(defensivePlayer) === true) {
        string.robotDodgeString(offensivePlayer, defensivePlayer);
    } else if (defensivePlayer.shield > 0) {
        defensivePlayer.shield -= dmgNumber;
        string.robotsCombatText(offensivePlayer, defensivePlayer, dmgNumber);
    } else {
        defensivePlayer.health -= dmgNumber;
        string.robotsCombatText(offensivePlayer, defensivePlayer, dmgNumber);
    }
};

/* used in the attack function to determine if a robot avoids an attack. It generates a random number between
1 and 100, and if the robot's evasion stat is greater than or equal to that number, they take no damage that round. */

let evasion = (player) => {
    let evasionCheck = false;
    if (player.evasion >= Math.floor(Math.random() * 100)) {
        evasionCheck = true;
    }

    return evasionCheck;
};

/* Used in victory check function to hide player cards, the button that progresses the battle and leaves the combat
log viewable so the users can see who was defeated. */

let victoryView = () => {
    $('#battleStartBtn').hide();
    $('#playerOneCard').hide();
    $('#playerTwoCard').hide();
};

/* Checks if both, or one of the players have 0 or less health, then changes to the view that displays which character
was defeated. */

let victoryCheck = (firstPlayer, secondPlayer) => {
    let victoryString = "";

    if (firstPlayer.health <= 0 && secondPlayer.health <= 0) {
        victoryString += `<h2>Both of these bots are scrapped!</h2>`;
        $('#combatText').html(`${victoryString}`);
        victoryView();
    } else if (firstPlayer.health <= 0) {
        victoryString += `<h2>${secondPlayer.name} has defeated ${firstPlayer.name}!</h2>`;
        $('#combatText').html(`${victoryString}`);
        victoryView();
    } else if (secondPlayer.health <= 0) {
        victoryString += `<h2>${firstPlayer.name} has defeated ${secondPlayer.name}!</h2>`;
        $('#combatText').html(`${victoryString}`);
        victoryView();
    }

};


module.exports = {
    damage,
    attack,
    evasion,
    victoryCheck,
    shieldCheck,
    empathyCheck,
    nanobotCheck,
    nanoHeal
};
},{"./mods.js":3,"./robots.js":4,"./string.js":5,"./weapons.js":6}],2:[function(require,module,exports){
"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let combat = require('./combat.js');
let string = require('./string.js');

/* characterCreationView sets which elements are visable on load and upon switching between Player One and 
Player Two in the creation process */

let checkToKillIntervals = false;

let characterCreationView = () => {
    $('#model_select').hide();
    $('#weapon_select').hide();
    $('#mod_select').hide();
    $('#droneModels').hide();
    $('#tankbotModels').hide();
    $('#psybotModels').hide();
    $('#droneDescription').hide();
    $('#tankbotDescription').hide();
    $('#psybotDescription').hide();
    $('#battledome').hide();
    $('#type_select').show();
};

/* playerCount is used by robotCheck function for switching which Player is being augmented and which 
header is displayed when the user clicks a button in the modify_select element */

let playerCount = 0;

/* player variable changes in the robotCheck function based on previous variable playerCount's value */

let player;

/* conditional statement that is run at the end of the first character creation process to begin storing values
for next player */

let robotCheck = () => {
    if (playerCount <= 0) {
        player = robots.PlayerOne;
    } else {
        player = robots.PlayerTwo;
    }
};

robotCheck();

$(document).ready(function() {


    characterCreationView();

    /* When a type button is clicked, the user's type selection is stored in their Player object, the type view is hidden,
    and based on the ID of the clicked button, models for that type are displayed in the next view. */
    $('.typebtn').click(function(event) {

        $('#type_select').hide();
        player.setType(event.target.id);

        $('#model_select').show();
        $('#model_buttons').show();

        if (event.target.id == "Drone") {
            $('#droneDescription').show();
            $('#droneModels').show();
        } else if (event.target.id == "Tankbot") {
            $('#tankbotDescription').show();
            $('#tankbotModels').show();
        } else {
            $('#psybotDescription').show();
            $('#psybotModels').show();
        }
    });


    /* When a model button is clicked, the user's model selection is stored in their Player object, the model view
    is hidden, and the weapon selection screen is shown. */
    $('.modelbtn').click(function(event) {

        $('#model_select').hide();
        player.setModel(event.target.id);
        $('#weapon_select').show();
    });

    /* when the user clicks a weapon button, the weapon select view is hidden and the user's weapon property is
    set to the selected weapon, then modifications are shown. */

    $('.wepbtn').click(function(event) {
        $('#weapon_select').hide();
        player.setWeapon(new weapons.WeaponCache[event.target.id]());

        $('#mod_select').show();
    });

    /* when a modification button is clicked, the user's mod property is set to that particular object. 
    playerCount is incremented up each time this happens. the first time it is incremented, the header for
    player one is replaced with one for player two, and the buttons now set values for player two instead 
    of player one. if playerCount is incremented up to two at this point, the character selection screen is 
    hidden and the battledome view is shown. */

    $('.modbtn').click(function(event) {
        player.setMod(new mods.Armory[event.target.id]());

        characterCreationView();
        playerCount++;

        if (playerCount >= 0) {
            $("h1.first").replaceWith('<h1>Player Two</h1>');
        }

        robotCheck();

        if (playerCount == 2) {
            $('#robot_creation').hide();
            $('#playerHeader').hide();
            $('#battledome').show();
            string.robotToCard(robots.PlayerOne, "#playerOneCard");
            string.robotToCard(robots.PlayerTwo, "#playerTwoCard");
        }

    });

    /* the two battle sequence functions are run upon clicking the battle button within the battledome view. 
    these functions are described in greater detail in their corresponding js files. */

    let battleSequence = () => {
        combat.attack(robots.PlayerOne, robots.PlayerTwo);
        combat.shieldCheck(robots.PlayerTwo);
        string.robotToCard(robots.PlayerOne, "#playerOneCard");
        combat.victoryCheck(robots.PlayerOne, robots.PlayerTwo);
    };



    let battleSequenceTwo = () => {
        combat.attack(robots.PlayerTwo, robots.PlayerOne);
        combat.shieldCheck(robots.PlayerOne);
        string.robotToCard(robots.PlayerTwo, "#playerTwoCard");
        combat.victoryCheck(robots.PlayerTwo, robots.PlayerOne);
    };

    $('#battleStartBtn').click(function() {
        battleSequence();
        battleSequenceTwo();
    });

});
},{"./combat.js":1,"./mods.js":3,"./robots.js":4,"./string.js":5,"./weapons.js":6}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
    this.minDamage = 0;
    this.additionalDamageRange = 0;

    this.weapon = "Empty Holster";
    this.name = "Malfunctioning Scrapbot";

    this.health = 70;
    this.shield = 0;
    this.evasion = 0;
};


///////////////////////
//        Types      //
///////////////////////


/* Drones serve the "Agility" type role in this version of Robot Battledome. Slightly lower base health, but heightened
   ability to avoid opponent attacks. */


Robot.Drone = function() {
    this.type = "Drone";
    this.health += this.healthBonus = 20;
    this.shield += this.shieldBonus = 0;
    this.evasion += this.evasionBonus = 10;
};

Robot.Drone.prototype = new Robot.Player();


///////////////////////
//   Drone Models    //
///////////////////////


Robot.ShadowStrike = function() {
    this.health += this.healthBonus = 30;
    this.model = "ShadowStrike";
    this.evasion += this.evasionBonus = 15;
};

Robot.ShadowStrike.prototype = new Robot.Drone();

Robot.LittleBiter = function() {
    this.healthBonus = 40;
    this.model = "LittleBiter";
    this.evasion += this.evasionBonus = 10;
};

Robot.LittleBiter.prototype = new Robot.Drone();

Robot.BulletShooter = function() {
    this.health += this.healthBonus = 20;
    this.model = "BulletShooter";
    this.evasion += this.evasionBonus = 20;
};

Robot.BulletShooter.prototype = new Robot.Drone();


/* Tankbots have slightly higher health than the other two types. No Bonus to evasion (execpt tobor)
  since they have heavier and sturdier frames than other types. */


Robot.Tankbot = function() {
    this.type = "Tankbot";
    this.health += this.healthBonus = 50;
    this.shield += this.shieldBonus = 0;
    this.evasion += this.evasionBonus = 0;
};

Robot.Tankbot.prototype = new Robot.Player();


///////////////////////
//  Tankbot Models   //
///////////////////////


Robot.Tobor = function() {
    this.health += this.healthBonus = 30;
    this.model = "T.O.B.O.R.";
    this.evasion += this.evasionBonus = 7;
};

Robot.Tobor.prototype = new Robot.Tankbot();

Robot.RockBot = function() {
    this.health += this.healthBonus = 40;
    this.model = "RockBot";
    this.shield += this.shieldBonus = 25;
};

Robot.RockBot.prototype = new Robot.Tankbot();

Robot.TankbotPlus = function() {
    this.health += this.healthBonus = 25;
    this.model = "TankbotPlus";
    this.shield += this.shieldBonus = 35;
};

Robot.TankbotPlus.prototype = new Robot.Tankbot();


/* Psybots will have stronger shields.Slight bonus to evading attacks based on their
 ability to calculate opponents next move. */


Robot.Psybot = function() {
    this.type = "Psybot";
    this.health += this.healthBonus = 10;
    this.shield += this.shieldBonus = Math.floor(Math.random() * 5 + 20);
    this.evasion += this.evasionBonus = 10;
};

Robot.Psybot.prototype = new Robot.Player();


///////////////////////
//   Psybot Models   //
///////////////////////


Robot.Mindmelter = function() {
    this.health += this.healthBonus = 25;
    this.model = "Mindmelter";
    this.shield += this.shieldBonus = 30;
};

Robot.Mindmelter.prototype = new Robot.Psybot();

Robot.Brainstorm = function() {
    this.health += this.healthBonus = 15;
    this.model = "Brainstorm";
    this.shield += this.shieldBonus = 25;
    this.evasion += this.evasionBonus = 5;
};

Robot.Brainstorm.prototype = new Robot.Psybot();

Robot.Banshee = function() {
    this.health += this.healthBonus = 10;
    this.model = "Banshee";
    this.health += this.shieldBonus = 55;
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


let PlayerOne = new Robot.Player();
PlayerOne.name = "Player One";
let PlayerTwo = new Robot.Player();
PlayerTwo.name = "Player Two";


/* Export this business */

module.exports = {
    Robot,
    PlayerOne,
    PlayerTwo
};
},{"./mods.js":3,"./weapons.js":6}],5:[function(require,module,exports){
"use strict";

let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let combat = require('./combat.js');

/* function for creating the string that is appended when player is healed from their nanobot mod.
removes lines of text as more are added to the combat text container. */

let robotNanobotHealString = (player, nanoHeal) => {
    let nanoString = `<h5>${player.name} is repaired for ${nanoHeal()} health by their nanobots!`;
    if ($('#combatText').children().length > 7) {
        $('#combatText').children('h5:first').remove();
    }
    $('#combatText').append(nanoString);
};

/* function for creating the string that is appended when offensive player attacks a robot with the empathy
virus modification. removes elements to keep combat text container from being too bloated with text. */

let robotEmpathyString = (offensivePlayer, defensivePlayer) => {
    let empathyString = `<h5>${offensivePlayer.name} hugs ${defensivePlayer.name} instead of attacking! Gross!</h5>`;
    if ($('#combatText').children().length > 7) {
        $('#combatText').children('h5:first').remove();
    }
    $('#combatText').append(empathyString);
};

/* string that is appended whenever a player dodges an opponent's attack. */

let robotDodgeString = (offensivePlayer, defensivePlayer) => {
    let dodgeString = `<h5>${offensivePlayer.name} attacks, but ${defensivePlayer.name} swiftly dodges!</h5>`;
    if ($('#combatText').children().length > 7) {
        $('#combatText').children('h5:first').remove();
    }
    $('#combatText').append(dodgeString);
};

/* creates text that is displayed in battledome view for showing each robot's stats. */

let robotToCard = (player, playerElement) => {
    let playerString = "";
    playerString += `<h1>${player.name}</h1>`;
    playerString += `<h4>Health: ${player.health}</h4>`;
    playerString += `<h4>Shield: ${player.shield}</h4>`;
    playerString += `<h4>Type: ${player.type.type}</h4>`;
    playerString += `<h4>Model: ${player.model.model}</h4>`;
    $(playerElement).html(`${playerString}`);
};

/* creates base combat string when attacks are successful against enemy robots. */

let robotsCombatText = (offensivePlayer, defensivePlayer, damage) => {

    if ($('#combatText').children().length > 7) {
        $('#combatText').children('h5:first').remove();
    }
    $('#combatText').append(`<h5>${offensivePlayer.name} attacks ${defensivePlayer.name} with a ${offensivePlayer.weapon.wepName} for ${damage} damage!</h5>`);


};

module.exports = {
    robotNanobotHealString,
    robotEmpathyString,
    robotToCard,
    robotsCombatText,
    robotDodgeString
};
},{"./combat.js":1,"./mods.js":3,"./robots.js":4,"./weapons.js":6}],6:[function(require,module,exports){
"use strict";

let WeaponCache = {};

///////////////////////
//     Base Weapon   //
///////////////////////


WeaponCache.Weapon = function() {
    this.wepName = null;
    this.minDamage = 0;
    this.additionalDamageRange = 0;
    this.empCheck = 0;
};


///////////////////////
//  Modified Weapons //
///////////////////////


/* EMP Rifle has medium low end, larger random range than most other weapons. */


WeaponCache.EmpRifle = function() {
    this.wepName = "E.M.P. Rifle";
    this.minDamage += 9;
    this.additionalDamageRange += 10;
    this.empCheck += 0;
};

WeaponCache.EmpRifle.prototype = new WeaponCache.Weapon();


/* Megazapper is a fairly straight-forward weapon. Smaller range in randomness, but gives up highest
   possible top-end for consistency. */


WeaponCache.Megazapper = function() {
    this.wepName = "MegaZapper";
    this.minDamage += 12;
    this.additionalDamageRange += 3;
    this.empCheck += 0;
};

WeaponCache.Megazapper.prototype = new WeaponCache.Weapon();


/* Chaos Grenade has the highest top-end for damage, but could also leave you hitting like a wet noodle.
   If time permits, will tweak the damage numbers to come up with something balanced. */


WeaponCache.ChaosGrenade = function() {
    this.wepName = "Chaos Grenade";
    this.minDamage += 1;
    this.additionalDamageRange += 24;
    this.empCheck += 0;
};

WeaponCache.ChaosGrenade.prototype = new WeaponCache.Weapon();


/* Murder Knife is a place holder weapon. */

WeaponCache.MurderKnife = function() {
    this.wepName = "MurderKnife";
    this.minDamage += 9;
    this.additionalDamageRange += 3;
    this.empCheck += 0;
};

WeaponCache.MurderKnife.prototype = new WeaponCache.Weapon();


/* Micro Wave is a place holder weapon. */


WeaponCache.MicroWave = function() {
    this.wepName = "Micro Wave";
    this.minDamage += 11;
    this.additionalDamageRange += 1;
    this.empCheck += 0;
};

WeaponCache.MicroWave.prototype = new WeaponCache.Weapon();


/* Plastic Spork is a place holder weapon. */


WeaponCache.PlasticSpork = function() {
    this.wepName = "Plastic Spork";
    this.minDamage += 3;
    this.additionalDamageRange += 3;
    this.empCheck += 0;
};

WeaponCache.PlasticSpork.prototype = new WeaponCache.Weapon();

module.exports = {
    WeaponCache
};
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb21iYXQuanMiLCJqYXZhc2NyaXB0cy9tYWluLmpzIiwiamF2YXNjcmlwdHMvbW9kcy5qcyIsImphdmFzY3JpcHRzL3JvYm90cy5qcyIsImphdmFzY3JpcHRzL3N0cmluZy5qcyIsImphdmFzY3JpcHRzL3dlYXBvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmxldCByb2JvdHMgPSByZXF1aXJlKCcuL3JvYm90cy5qcycpO1xubGV0IHdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMuanMnKTtcbmxldCBtb2RzID0gcmVxdWlyZSgnLi9tb2RzLmpzJyk7XG5sZXQgc3RyaW5nID0gcmVxdWlyZSgnLi9zdHJpbmcuanMnKTtcblxuLyogY2hlY2tzIHRvIHNlZSBpZiB0aGUgcGxheWVyIGhhcyBzZWxlY3RlZCB0aGUgcmVzdG9yYXRpdmUgbmFub2JvdCBtb2RpZmljYXRpb24gZm9yIHVzZSBpbiBsYXRlciBmdW5jdGlvbiAqL1xuXG5sZXQgbmFub2JvdENoZWNrID0gKHBsYXllcikgPT4ge1xuICAgIGxldCBuYW5vQ2hlY2tlciA9IGZhbHNlO1xuICAgIGlmIChwbGF5ZXIubmFub0NoZWNrID4gMCkge1xuICAgICAgICBuYW5vQ2hlY2tlciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBuYW5vQ2hlY2tlcjtcbn07XG5cbi8qIGlmIHBsYXllciBoYXMgc2VsZWN0ZWQgcmVzdG9yYXRpdmUgbmFub2JvdHMsIHRoZXkgYXJlIGhlYWxlZCBmb3IgdGhlIGFtb3VudCByYW5kb21seSBnZW5lcmF0ZWQgd2l0aGluIHRoaXMgZnVuY3Rpb24gKi9cblxubGV0IG5hbm9IZWFsID0gKCkgPT4ge1xuICAgIGxldCBuYW5vSGVhbEFtb3VudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpO1xuXG4gICAgcmV0dXJuIG5hbm9IZWFsQW1vdW50O1xufTtcblxuLyogdGhpcyBpcyB0aGUgZnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIHBsYXllciBkYW1hZ2UuIGl0IHRha2VzIHRoZSBtaW5pbXVtIGRhbWFnZSBzdGF0IGZyb20gYSB3ZWFwb24gYW5kIGFkZHNcbmEgcmFuZG9tIG51bWJlciBpbiB0aGUgYWRkaXRpb25hbCBkYW1hZ2UgcmFuZ2UgdG8gdGhlIG1pbmltdW0uICovXG5cbmxldCBkYW1hZ2UgPSAocGxheWVyKSA9PiB7XG4gICAgbGV0IHRvdGFsRGFtYWdlID0gMDtcbiAgICB0b3RhbERhbWFnZSArPSBwbGF5ZXIubWluRGFtYWdlO1xuICAgIHRvdGFsRGFtYWdlICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllci5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UpO1xuICAgIHJldHVybiB0b3RhbERhbWFnZTtcbn07XG5cbi8qIGNoZWNrcyBpZiB0aGUgc2hpZWxkIGlzIGxlc3MgdGhhbiB6ZXJvIGFuZCBzZXRzIGl0IHRvIHplcm8gKi9cblxubGV0IHNoaWVsZENoZWNrID0gKHBsYXllcikgPT4ge1xuICAgIGlmIChwbGF5ZXIuc2hpZWxkIDwgMCkge1xuICAgICAgICBwbGF5ZXIuc2hpZWxkID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHBsYXllcjtcbn07XG5cbi8qIGdpdmUgdGhlIHBsYXllciBhIDEgaW4gOCBjaGFuY2UgdG8gY2F1c2Ugb3Bwb25lbnQgdG8gbm90IGRlYWwgZGFtYWdlIGluIGEgcm91bmQgb2YgY29tYmF0LiAqL1xuXG5sZXQgZW1wYXRoeUNoZWNrID0gKHBsYXllcikgPT4ge1xuICAgIGxldCBlbXBhdGh5ID0gZmFsc2U7XG4gICAgaWYgKHBsYXllci5lbXBDaGVjayA+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDgpKSB7XG4gICAgICAgIGVtcGF0aHkgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZW1wYXRoeTtcbn07XG5cbi8qIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIG90aGVyIGNvbWJhdCBmdW5jdGlvbnMgZGVwZW5kaW5nIG9uIGNvbmRpdGlvbnMuIGNoZWNrcyBpZiBwbGF5ZXIgaGFzIHJlc3RvcmF0aXZlIG5hbm9ib3RzLFxuIGVtcGF0aHkgdmlydXMgbW9kLCBldmFzaW9uLCBvciBhIHNoaWVsZCBiZWZvcmUgZGVkdWN0aW5nIGhlYWx0aCBiYXNlZCBvbiB0aGVpciBvcHBvbmVudCdzIGF0dGFjay4gKi9cblxubGV0IGF0dGFjayA9IChvZmZlbnNpdmVQbGF5ZXIsIGRlZmVuc2l2ZVBsYXllcikgPT4ge1xuXG4gICAgbGV0IGRtZ051bWJlciA9IGRhbWFnZShvZmZlbnNpdmVQbGF5ZXIpO1xuICAgIGxldCBoZWFsTnVtYmVyID0gbmFub0hlYWwoZGVmZW5zaXZlUGxheWVyKTtcblxuICAgIGlmIChuYW5vYm90Q2hlY2soZGVmZW5zaXZlUGxheWVyKSA9PT0gdHJ1ZSkge1xuICAgICAgICBkZWZlbnNpdmVQbGF5ZXIuaGVhbHRoICs9IG5hbm9IZWFsKCk7XG4gICAgICAgIHN0cmluZy5yb2JvdE5hbm9ib3RIZWFsU3RyaW5nKGRlZmVuc2l2ZVBsYXllciwgbmFub0hlYWwpO1xuICAgIH1cblxuICAgIGlmIChlbXBhdGh5Q2hlY2soZGVmZW5zaXZlUGxheWVyKSA9PT0gdHJ1ZSkge1xuICAgICAgICBzdHJpbmcucm9ib3RFbXBhdGh5U3RyaW5nKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyKTtcbiAgICB9IGVsc2UgaWYgKGV2YXNpb24oZGVmZW5zaXZlUGxheWVyKSA9PT0gdHJ1ZSkge1xuICAgICAgICBzdHJpbmcucm9ib3REb2RnZVN0cmluZyhvZmZlbnNpdmVQbGF5ZXIsIGRlZmVuc2l2ZVBsYXllcik7XG4gICAgfSBlbHNlIGlmIChkZWZlbnNpdmVQbGF5ZXIuc2hpZWxkID4gMCkge1xuICAgICAgICBkZWZlbnNpdmVQbGF5ZXIuc2hpZWxkIC09IGRtZ051bWJlcjtcbiAgICAgICAgc3RyaW5nLnJvYm90c0NvbWJhdFRleHQob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIsIGRtZ051bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGVmZW5zaXZlUGxheWVyLmhlYWx0aCAtPSBkbWdOdW1iZXI7XG4gICAgICAgIHN0cmluZy5yb2JvdHNDb21iYXRUZXh0KG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyLCBkbWdOdW1iZXIpO1xuICAgIH1cbn07XG5cbi8qIHVzZWQgaW4gdGhlIGF0dGFjayBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSByb2JvdCBhdm9pZHMgYW4gYXR0YWNrLiBJdCBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW5cbjEgYW5kIDEwMCwgYW5kIGlmIHRoZSByb2JvdCdzIGV2YXNpb24gc3RhdCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhhdCBudW1iZXIsIHRoZXkgdGFrZSBubyBkYW1hZ2UgdGhhdCByb3VuZC4gKi9cblxubGV0IGV2YXNpb24gPSAocGxheWVyKSA9PiB7XG4gICAgbGV0IGV2YXNpb25DaGVjayA9IGZhbHNlO1xuICAgIGlmIChwbGF5ZXIuZXZhc2lvbiA+PSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApKSB7XG4gICAgICAgIGV2YXNpb25DaGVjayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2YXNpb25DaGVjaztcbn07XG5cbi8qIFVzZWQgaW4gdmljdG9yeSBjaGVjayBmdW5jdGlvbiB0byBoaWRlIHBsYXllciBjYXJkcywgdGhlIGJ1dHRvbiB0aGF0IHByb2dyZXNzZXMgdGhlIGJhdHRsZSBhbmQgbGVhdmVzIHRoZSBjb21iYXRcbmxvZyB2aWV3YWJsZSBzbyB0aGUgdXNlcnMgY2FuIHNlZSB3aG8gd2FzIGRlZmVhdGVkLiAqL1xuXG5sZXQgdmljdG9yeVZpZXcgPSAoKSA9PiB7XG4gICAgJCgnI2JhdHRsZVN0YXJ0QnRuJykuaGlkZSgpO1xuICAgICQoJyNwbGF5ZXJPbmVDYXJkJykuaGlkZSgpO1xuICAgICQoJyNwbGF5ZXJUd29DYXJkJykuaGlkZSgpO1xufTtcblxuLyogQ2hlY2tzIGlmIGJvdGgsIG9yIG9uZSBvZiB0aGUgcGxheWVycyBoYXZlIDAgb3IgbGVzcyBoZWFsdGgsIHRoZW4gY2hhbmdlcyB0byB0aGUgdmlldyB0aGF0IGRpc3BsYXlzIHdoaWNoIGNoYXJhY3Rlclxud2FzIGRlZmVhdGVkLiAqL1xuXG5sZXQgdmljdG9yeUNoZWNrID0gKGZpcnN0UGxheWVyLCBzZWNvbmRQbGF5ZXIpID0+IHtcbiAgICBsZXQgdmljdG9yeVN0cmluZyA9IFwiXCI7XG5cbiAgICBpZiAoZmlyc3RQbGF5ZXIuaGVhbHRoIDw9IDAgJiYgc2Vjb25kUGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgIHZpY3RvcnlTdHJpbmcgKz0gYDxoMj5Cb3RoIG9mIHRoZXNlIGJvdHMgYXJlIHNjcmFwcGVkITwvaDI+YDtcbiAgICAgICAgJCgnI2NvbWJhdFRleHQnKS5odG1sKGAke3ZpY3RvcnlTdHJpbmd9YCk7XG4gICAgICAgIHZpY3RvcnlWaWV3KCk7XG4gICAgfSBlbHNlIGlmIChmaXJzdFBsYXllci5oZWFsdGggPD0gMCkge1xuICAgICAgICB2aWN0b3J5U3RyaW5nICs9IGA8aDI+JHtzZWNvbmRQbGF5ZXIubmFtZX0gaGFzIGRlZmVhdGVkICR7Zmlyc3RQbGF5ZXIubmFtZX0hPC9oMj5gO1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmh0bWwoYCR7dmljdG9yeVN0cmluZ31gKTtcbiAgICAgICAgdmljdG9yeVZpZXcoKTtcbiAgICB9IGVsc2UgaWYgKHNlY29uZFBsYXllci5oZWFsdGggPD0gMCkge1xuICAgICAgICB2aWN0b3J5U3RyaW5nICs9IGA8aDI+JHtmaXJzdFBsYXllci5uYW1lfSBoYXMgZGVmZWF0ZWQgJHtzZWNvbmRQbGF5ZXIubmFtZX0hPC9oMj5gO1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmh0bWwoYCR7dmljdG9yeVN0cmluZ31gKTtcbiAgICAgICAgdmljdG9yeVZpZXcoKTtcbiAgICB9XG5cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGFtYWdlLFxuICAgIGF0dGFjayxcbiAgICBldmFzaW9uLFxuICAgIHZpY3RvcnlDaGVjayxcbiAgICBzaGllbGRDaGVjayxcbiAgICBlbXBhdGh5Q2hlY2ssXG4gICAgbmFub2JvdENoZWNrLFxuICAgIG5hbm9IZWFsXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgcm9ib3RzID0gcmVxdWlyZSgnLi9yb2JvdHMuanMnKTtcbmxldCB3ZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zLmpzJyk7XG5sZXQgbW9kcyA9IHJlcXVpcmUoJy4vbW9kcy5qcycpO1xubGV0IGNvbWJhdCA9IHJlcXVpcmUoJy4vY29tYmF0LmpzJyk7XG5sZXQgc3RyaW5nID0gcmVxdWlyZSgnLi9zdHJpbmcuanMnKTtcblxuLyogY2hhcmFjdGVyQ3JlYXRpb25WaWV3IHNldHMgd2hpY2ggZWxlbWVudHMgYXJlIHZpc2FibGUgb24gbG9hZCBhbmQgdXBvbiBzd2l0Y2hpbmcgYmV0d2VlbiBQbGF5ZXIgT25lIGFuZCBcblBsYXllciBUd28gaW4gdGhlIGNyZWF0aW9uIHByb2Nlc3MgKi9cblxubGV0IGNoZWNrVG9LaWxsSW50ZXJ2YWxzID0gZmFsc2U7XG5cbmxldCBjaGFyYWN0ZXJDcmVhdGlvblZpZXcgPSAoKSA9PiB7XG4gICAgJCgnI21vZGVsX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAkKCcjd2VhcG9uX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAkKCcjbW9kX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAkKCcjZHJvbmVNb2RlbHMnKS5oaWRlKCk7XG4gICAgJCgnI3Rhbmtib3RNb2RlbHMnKS5oaWRlKCk7XG4gICAgJCgnI3BzeWJvdE1vZGVscycpLmhpZGUoKTtcbiAgICAkKCcjZHJvbmVEZXNjcmlwdGlvbicpLmhpZGUoKTtcbiAgICAkKCcjdGFua2JvdERlc2NyaXB0aW9uJykuaGlkZSgpO1xuICAgICQoJyNwc3lib3REZXNjcmlwdGlvbicpLmhpZGUoKTtcbiAgICAkKCcjYmF0dGxlZG9tZScpLmhpZGUoKTtcbiAgICAkKCcjdHlwZV9zZWxlY3QnKS5zaG93KCk7XG59O1xuXG4vKiBwbGF5ZXJDb3VudCBpcyB1c2VkIGJ5IHJvYm90Q2hlY2sgZnVuY3Rpb24gZm9yIHN3aXRjaGluZyB3aGljaCBQbGF5ZXIgaXMgYmVpbmcgYXVnbWVudGVkIGFuZCB3aGljaCBcbmhlYWRlciBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgdXNlciBjbGlja3MgYSBidXR0b24gaW4gdGhlIG1vZGlmeV9zZWxlY3QgZWxlbWVudCAqL1xuXG5sZXQgcGxheWVyQ291bnQgPSAwO1xuXG4vKiBwbGF5ZXIgdmFyaWFibGUgY2hhbmdlcyBpbiB0aGUgcm9ib3RDaGVjayBmdW5jdGlvbiBiYXNlZCBvbiBwcmV2aW91cyB2YXJpYWJsZSBwbGF5ZXJDb3VudCdzIHZhbHVlICovXG5cbmxldCBwbGF5ZXI7XG5cbi8qIGNvbmRpdGlvbmFsIHN0YXRlbWVudCB0aGF0IGlzIHJ1biBhdCB0aGUgZW5kIG9mIHRoZSBmaXJzdCBjaGFyYWN0ZXIgY3JlYXRpb24gcHJvY2VzcyB0byBiZWdpbiBzdG9yaW5nIHZhbHVlc1xuZm9yIG5leHQgcGxheWVyICovXG5cbmxldCByb2JvdENoZWNrID0gKCkgPT4ge1xuICAgIGlmIChwbGF5ZXJDb3VudCA8PSAwKSB7XG4gICAgICAgIHBsYXllciA9IHJvYm90cy5QbGF5ZXJPbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyID0gcm9ib3RzLlBsYXllclR3bztcbiAgICB9XG59O1xuXG5yb2JvdENoZWNrKCk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cbiAgICBjaGFyYWN0ZXJDcmVhdGlvblZpZXcoKTtcblxuICAgIC8qIFdoZW4gYSB0eXBlIGJ1dHRvbiBpcyBjbGlja2VkLCB0aGUgdXNlcidzIHR5cGUgc2VsZWN0aW9uIGlzIHN0b3JlZCBpbiB0aGVpciBQbGF5ZXIgb2JqZWN0LCB0aGUgdHlwZSB2aWV3IGlzIGhpZGRlbixcbiAgICBhbmQgYmFzZWQgb24gdGhlIElEIG9mIHRoZSBjbGlja2VkIGJ1dHRvbiwgbW9kZWxzIGZvciB0aGF0IHR5cGUgYXJlIGRpc3BsYXllZCBpbiB0aGUgbmV4dCB2aWV3LiAqL1xuICAgICQoJy50eXBlYnRuJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAkKCcjdHlwZV9zZWxlY3QnKS5oaWRlKCk7XG4gICAgICAgIHBsYXllci5zZXRUeXBlKGV2ZW50LnRhcmdldC5pZCk7XG5cbiAgICAgICAgJCgnI21vZGVsX3NlbGVjdCcpLnNob3coKTtcbiAgICAgICAgJCgnI21vZGVsX2J1dHRvbnMnKS5zaG93KCk7XG5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5pZCA9PSBcIkRyb25lXCIpIHtcbiAgICAgICAgICAgICQoJyNkcm9uZURlc2NyaXB0aW9uJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnI2Ryb25lTW9kZWxzJykuc2hvdygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5pZCA9PSBcIlRhbmtib3RcIikge1xuICAgICAgICAgICAgJCgnI3Rhbmtib3REZXNjcmlwdGlvbicpLnNob3coKTtcbiAgICAgICAgICAgICQoJyN0YW5rYm90TW9kZWxzJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI3BzeWJvdERlc2NyaXB0aW9uJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnI3BzeWJvdE1vZGVscycpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvKiBXaGVuIGEgbW9kZWwgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSB1c2VyJ3MgbW9kZWwgc2VsZWN0aW9uIGlzIHN0b3JlZCBpbiB0aGVpciBQbGF5ZXIgb2JqZWN0LCB0aGUgbW9kZWwgdmlld1xuICAgIGlzIGhpZGRlbiwgYW5kIHRoZSB3ZWFwb24gc2VsZWN0aW9uIHNjcmVlbiBpcyBzaG93bi4gKi9cbiAgICAkKCcubW9kZWxidG4nKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICQoJyNtb2RlbF9zZWxlY3QnKS5oaWRlKCk7XG4gICAgICAgIHBsYXllci5zZXRNb2RlbChldmVudC50YXJnZXQuaWQpO1xuICAgICAgICAkKCcjd2VhcG9uX3NlbGVjdCcpLnNob3coKTtcbiAgICB9KTtcblxuICAgIC8qIHdoZW4gdGhlIHVzZXIgY2xpY2tzIGEgd2VhcG9uIGJ1dHRvbiwgdGhlIHdlYXBvbiBzZWxlY3QgdmlldyBpcyBoaWRkZW4gYW5kIHRoZSB1c2VyJ3Mgd2VhcG9uIHByb3BlcnR5IGlzXG4gICAgc2V0IHRvIHRoZSBzZWxlY3RlZCB3ZWFwb24sIHRoZW4gbW9kaWZpY2F0aW9ucyBhcmUgc2hvd24uICovXG5cbiAgICAkKCcud2VwYnRuJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgJCgnI3dlYXBvbl9zZWxlY3QnKS5oaWRlKCk7XG4gICAgICAgIHBsYXllci5zZXRXZWFwb24obmV3IHdlYXBvbnMuV2VhcG9uQ2FjaGVbZXZlbnQudGFyZ2V0LmlkXSgpKTtcblxuICAgICAgICAkKCcjbW9kX3NlbGVjdCcpLnNob3coKTtcbiAgICB9KTtcblxuICAgIC8qIHdoZW4gYSBtb2RpZmljYXRpb24gYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSB1c2VyJ3MgbW9kIHByb3BlcnR5IGlzIHNldCB0byB0aGF0IHBhcnRpY3VsYXIgb2JqZWN0LiBcbiAgICBwbGF5ZXJDb3VudCBpcyBpbmNyZW1lbnRlZCB1cCBlYWNoIHRpbWUgdGhpcyBoYXBwZW5zLiB0aGUgZmlyc3QgdGltZSBpdCBpcyBpbmNyZW1lbnRlZCwgdGhlIGhlYWRlciBmb3JcbiAgICBwbGF5ZXIgb25lIGlzIHJlcGxhY2VkIHdpdGggb25lIGZvciBwbGF5ZXIgdHdvLCBhbmQgdGhlIGJ1dHRvbnMgbm93IHNldCB2YWx1ZXMgZm9yIHBsYXllciB0d28gaW5zdGVhZCBcbiAgICBvZiBwbGF5ZXIgb25lLiBpZiBwbGF5ZXJDb3VudCBpcyBpbmNyZW1lbnRlZCB1cCB0byB0d28gYXQgdGhpcyBwb2ludCwgdGhlIGNoYXJhY3RlciBzZWxlY3Rpb24gc2NyZWVuIGlzIFxuICAgIGhpZGRlbiBhbmQgdGhlIGJhdHRsZWRvbWUgdmlldyBpcyBzaG93bi4gKi9cblxuICAgICQoJy5tb2RidG4nKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuICAgICAgICBwbGF5ZXIuc2V0TW9kKG5ldyBtb2RzLkFybW9yeVtldmVudC50YXJnZXQuaWRdKCkpO1xuXG4gICAgICAgIGNoYXJhY3RlckNyZWF0aW9uVmlldygpO1xuICAgICAgICBwbGF5ZXJDb3VudCsrO1xuXG4gICAgICAgIGlmIChwbGF5ZXJDb3VudCA+PSAwKSB7XG4gICAgICAgICAgICAkKFwiaDEuZmlyc3RcIikucmVwbGFjZVdpdGgoJzxoMT5QbGF5ZXIgVHdvPC9oMT4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvYm90Q2hlY2soKTtcblxuICAgICAgICBpZiAocGxheWVyQ291bnQgPT0gMikge1xuICAgICAgICAgICAgJCgnI3JvYm90X2NyZWF0aW9uJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3BsYXllckhlYWRlcicpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJyNiYXR0bGVkb21lJykuc2hvdygpO1xuICAgICAgICAgICAgc3RyaW5nLnJvYm90VG9DYXJkKHJvYm90cy5QbGF5ZXJPbmUsIFwiI3BsYXllck9uZUNhcmRcIik7XG4gICAgICAgICAgICBzdHJpbmcucm9ib3RUb0NhcmQocm9ib3RzLlBsYXllclR3bywgXCIjcGxheWVyVHdvQ2FyZFwiKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAvKiB0aGUgdHdvIGJhdHRsZSBzZXF1ZW5jZSBmdW5jdGlvbnMgYXJlIHJ1biB1cG9uIGNsaWNraW5nIHRoZSBiYXR0bGUgYnV0dG9uIHdpdGhpbiB0aGUgYmF0dGxlZG9tZSB2aWV3LiBcbiAgICB0aGVzZSBmdW5jdGlvbnMgYXJlIGRlc2NyaWJlZCBpbiBncmVhdGVyIGRldGFpbCBpbiB0aGVpciBjb3JyZXNwb25kaW5nIGpzIGZpbGVzLiAqL1xuXG4gICAgbGV0IGJhdHRsZVNlcXVlbmNlID0gKCkgPT4ge1xuICAgICAgICBjb21iYXQuYXR0YWNrKHJvYm90cy5QbGF5ZXJPbmUsIHJvYm90cy5QbGF5ZXJUd28pO1xuICAgICAgICBjb21iYXQuc2hpZWxkQ2hlY2socm9ib3RzLlBsYXllclR3byk7XG4gICAgICAgIHN0cmluZy5yb2JvdFRvQ2FyZChyb2JvdHMuUGxheWVyT25lLCBcIiNwbGF5ZXJPbmVDYXJkXCIpO1xuICAgICAgICBjb21iYXQudmljdG9yeUNoZWNrKHJvYm90cy5QbGF5ZXJPbmUsIHJvYm90cy5QbGF5ZXJUd28pO1xuICAgIH07XG5cblxuXG4gICAgbGV0IGJhdHRsZVNlcXVlbmNlVHdvID0gKCkgPT4ge1xuICAgICAgICBjb21iYXQuYXR0YWNrKHJvYm90cy5QbGF5ZXJUd28sIHJvYm90cy5QbGF5ZXJPbmUpO1xuICAgICAgICBjb21iYXQuc2hpZWxkQ2hlY2socm9ib3RzLlBsYXllck9uZSk7XG4gICAgICAgIHN0cmluZy5yb2JvdFRvQ2FyZChyb2JvdHMuUGxheWVyVHdvLCBcIiNwbGF5ZXJUd29DYXJkXCIpO1xuICAgICAgICBjb21iYXQudmljdG9yeUNoZWNrKHJvYm90cy5QbGF5ZXJUd28sIHJvYm90cy5QbGF5ZXJPbmUpO1xuICAgIH07XG5cbiAgICAkKCcjYmF0dGxlU3RhcnRCdG4nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgYmF0dGxlU2VxdWVuY2UoKTtcbiAgICAgICAgYmF0dGxlU2VxdWVuY2VUd28oKTtcbiAgICB9KTtcblxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBBcm1vcnkgPSB7fTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICAgICBCYXNlIE1vZCAgICAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbkFybW9yeS5Nb2RpZmljYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBudWxsO1xuICAgIHRoaXMubmFub0NoZWNrID0gbnVsbDtcbiAgICB0aGlzLmhlYWx0aEJvbnVzID0gMDtcbiAgICB0aGlzLmRhbWFnZUJvbnVzID0gMDtcbiAgICB0aGlzLmV2YXNpb25Cb251cyA9IDA7XG4gICAgdGhpcy5zaGllbGRCb251cyA9IDA7XG4gICAgdGhpcy5lbXBDaGVjayA9IDA7XG5cbiAgICByZXR1cm4gdGhpcy5tb2ROYW1lO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gICAgU3BlY2lmaWMgIE1vZHMgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLyogUmVzdG9yYXRpdmUgTmFub2JvdHMgd2lsbCBoZWFsIHRoZSByb2JvdCBmb3IgYSBzbWFsbCBhbW91bnQgYWZ0ZXIgZWFjaCByb3VuZCBvZiBjb21iYXQuICovXG5cblxuQXJtb3J5Lk5hbm9ib3RzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2ROYW1lID0gXCJSZXN0b3JhdGl2ZSBOYW5vYm90c1wiO1xuXG4gICAgdGhpcy5uYW5vQ2hlY2sgKz0gMTtcbiAgICB0aGlzLmhlYWx0aEJvbnVzICs9IDU7XG4gICAgdGhpcy5kYW1hZ2VCb251cyArPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzICs9IDA7XG4gICAgdGhpcy5zaGllbGRCb251cyArPSA1O1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMDtcbn07XG5cbkFybW9yeS5OYW5vYm90cy5wcm90b3R5cGUgPSBuZXcgQXJtb3J5Lk1vZGlmaWNhdGlvbigpO1xuXG5cbi8qIFJlaW5mb3JjZWQgcGxhdGluZyB3aWxsIGdpdmUgdGhlIHJvYm90IGEgc2xpZ2h0bHkgaGlnaGVyIGJhc2UgaGVhbHRoLCBtaW5vciBzaGllbGQuICovXG5cblxuQXJtb3J5LlBsYXRpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBcIlJlaW5mb3JjZWQgUGxhdGluZ1wiO1xuXG4gICAgdGhpcy5uYW5vQ2hlY2sgKz0gMDtcbiAgICB0aGlzLmhlYWx0aEJvbnVzICs9IDI1O1xuICAgIHRoaXMuZGFtYWdlQm9udXMgKz0gMDtcbiAgICB0aGlzLmV2YXNpb25Cb251cyArPSAwO1xuICAgIHRoaXMuc2hpZWxkQm9udXMgKz0gMTA7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuQXJtb3J5LlBsYXRpbmcucHJvdG90eXBlID0gbmV3IEFybW9yeS5Nb2RpZmljYXRpb24oKTtcblxuXG4vKiBGaW5kIFdlYWtuZXNzIHdpbGwgbG9vayBmb3IgZmxhd3MgaW4gb3Bwb25lbnQncyBmcmFtZSwgc2xpZ2h0IGluY3JlYXNlIGluIHJhbmRvbSBkYW1hZ2UuICovXG5cblxuQXJtb3J5LldlYWtuZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2ROYW1lID0gXCJGaW5kIFdlYWtuZXNzXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAwO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gMDtcbiAgICB0aGlzLmRhbWFnZUJvbnVzICs9IDQ7XG4gICAgdGhpcy5ldmFzaW9uQm9udXMgKz0gMDtcbiAgICB0aGlzLnNoaWVsZEJvbnVzICs9IDA7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuQXJtb3J5LldlYWtuZXNzLnByb3RvdHlwZSA9IG5ldyBBcm1vcnkuTW9kaWZpY2F0aW9uKCk7XG5cblxuLyogVXBkYXRlZCBGaXJtd2FyZSByZXNvbHZlcyBhIGJ1ZyB3aGljaCB3ZWFrZW5lZCB0aGUgcm9ib3QncyBhdHRhY2sgYW50aWNpcGF0aW9uIGNhbGN1bGF0aW9ucywgaW5jcmVhc2VzIFxuICAgUm9ib3QncyBldmFzaW9uIHRvdGFsIHNsaWdodGx5LCBtaW5vciBoZWFsdGguICovXG5cblxuQXJtb3J5LkZpcm13YXJlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2ROYW1lID0gXCJVcGRhdGVkIEZpcm13YXJlXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAwO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gMTA7XG4gICAgdGhpcy5kYW1hZ2VCb251cyArPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzICs9IDU7XG4gICAgdGhpcy5zaGllbGRCb251cyArPSAwO1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMDtcbn07XG5cbkFybW9yeS5GaXJtd2FyZS5wcm90b3R5cGUgPSBuZXcgQXJtb3J5Lk1vZGlmaWNhdGlvbigpO1xuXG5cbi8qIEVuaGFuY2UgU2hpZWxkcyBncmFudHMgdGhlIFJvYm90IGEgc2hpZWxkIGF0IHRoZSBiZWdpbm5pbmcgb2YgY29tYmF0LCBtaW5vciBldmFzaW9uLiAqL1xuXG5cbkFybW9yeS5FbmhTaGllbGQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBcIkVuaGFuY2VkIFNoaWVsZGluZ1wiO1xuXG4gICAgdGhpcy5uYW5vQ2hlY2sgKz0gMDtcbiAgICB0aGlzLmhlYWx0aEJvbnVzICs9IDA7XG4gICAgdGhpcy5kYW1hZ2VCb251cyArPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzICs9IDM7XG4gICAgdGhpcy5zaGllbGRCb251cyArPSAyNTtcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5Bcm1vcnkuRW5oU2hpZWxkLnByb3RvdHlwZSA9IG5ldyBBcm1vcnkuTW9kaWZpY2F0aW9uKCk7XG5cblxuLyogRW1wYXRoeSBWaXJ1cyBzbG93bHkgY2F1c2VzIHRoZSBvcHBvbmVudCdzIFJvYm90IHRvIGxvc2UgdXJnZSB0byBmaWdodCwgZXZlbnR1YWxseSBzdG9wcGluZyBmb3IgYSByb3VuZCwgbWlub3Igc2hpZWxkLiAgKi9cblxuXG5Bcm1vcnkuRW1wYXRoeSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubW9kTmFtZSA9IFwiRW1wYXRoeSBWaXJ1c1wiO1xuXG4gICAgdGhpcy5uYW5vQ2hlY2sgKz0gMDtcbiAgICB0aGlzLmhlYWx0aEJvbnVzICs9IDA7XG4gICAgdGhpcy5kYW1hZ2VCb251cyArPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzICs9IDA7XG4gICAgdGhpcy5zaGllbGRCb251cyArPSA1O1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMTtcbn07XG5cbkFybW9yeS5FbXBhdGh5LnByb3RvdHlwZSA9IG5ldyBBcm1vcnkuTW9kaWZpY2F0aW9uKCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFybW9yeVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubGV0IHdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMuanMnKTtcbmxldCBtb2RzID0gcmVxdWlyZSgnLi9tb2RzLmpzJyk7XG5cbmxldCBSb2JvdCA9IHt9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gICAgQmFzZSBSb2JvdCAgICAgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuUm9ib3QuUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50eXBlID0gbnVsbDtcbiAgICB0aGlzLm1vZGVsID0gbnVsbDtcbiAgICB0aGlzLm1vZHMgPSBudWxsO1xuICAgIHRoaXMubWluRGFtYWdlID0gMDtcbiAgICB0aGlzLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSA9IDA7XG5cbiAgICB0aGlzLndlYXBvbiA9IFwiRW1wdHkgSG9sc3RlclwiO1xuICAgIHRoaXMubmFtZSA9IFwiTWFsZnVuY3Rpb25pbmcgU2NyYXBib3RcIjtcblxuICAgIHRoaXMuaGVhbHRoID0gNzA7XG4gICAgdGhpcy5zaGllbGQgPSAwO1xuICAgIHRoaXMuZXZhc2lvbiA9IDA7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgICAgICAgVHlwZXMgICAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4vKiBEcm9uZXMgc2VydmUgdGhlIFwiQWdpbGl0eVwiIHR5cGUgcm9sZSBpbiB0aGlzIHZlcnNpb24gb2YgUm9ib3QgQmF0dGxlZG9tZS4gU2xpZ2h0bHkgbG93ZXIgYmFzZSBoZWFsdGgsIGJ1dCBoZWlnaHRlbmVkXG4gICBhYmlsaXR5IHRvIGF2b2lkIG9wcG9uZW50IGF0dGFja3MuICovXG5cblxuUm9ib3QuRHJvbmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnR5cGUgPSBcIkRyb25lXCI7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDIwO1xuICAgIHRoaXMuc2hpZWxkICs9IHRoaXMuc2hpZWxkQm9udXMgPSAwO1xuICAgIHRoaXMuZXZhc2lvbiArPSB0aGlzLmV2YXNpb25Cb251cyA9IDEwO1xufTtcblxuUm9ib3QuRHJvbmUucHJvdG90eXBlID0gbmV3IFJvYm90LlBsYXllcigpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgIERyb25lIE1vZGVscyAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5Sb2JvdC5TaGFkb3dTdHJpa2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gMzA7XG4gICAgdGhpcy5tb2RlbCA9IFwiU2hhZG93U3RyaWtlXCI7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMTU7XG59O1xuXG5Sb2JvdC5TaGFkb3dTdHJpa2UucHJvdG90eXBlID0gbmV3IFJvYm90LkRyb25lKCk7XG5cblJvYm90LkxpdHRsZUJpdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGhCb251cyA9IDQwO1xuICAgIHRoaXMubW9kZWwgPSBcIkxpdHRsZUJpdGVyXCI7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMTA7XG59O1xuXG5Sb2JvdC5MaXR0bGVCaXRlci5wcm90b3R5cGUgPSBuZXcgUm9ib3QuRHJvbmUoKTtcblxuUm9ib3QuQnVsbGV0U2hvb3RlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAyMDtcbiAgICB0aGlzLm1vZGVsID0gXCJCdWxsZXRTaG9vdGVyXCI7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMjA7XG59O1xuXG5Sb2JvdC5CdWxsZXRTaG9vdGVyLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5Ecm9uZSgpO1xuXG5cbi8qIFRhbmtib3RzIGhhdmUgc2xpZ2h0bHkgaGlnaGVyIGhlYWx0aCB0aGFuIHRoZSBvdGhlciB0d28gdHlwZXMuIE5vIEJvbnVzIHRvIGV2YXNpb24gKGV4ZWNwdCB0b2JvcilcbiAgc2luY2UgdGhleSBoYXZlIGhlYXZpZXIgYW5kIHN0dXJkaWVyIGZyYW1lcyB0aGFuIG90aGVyIHR5cGVzLiAqL1xuXG5cblJvYm90LlRhbmtib3QgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnR5cGUgPSBcIlRhbmtib3RcIjtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gNTA7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5zaGllbGRCb251cyA9IDA7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMDtcbn07XG5cblJvYm90LlRhbmtib3QucHJvdG90eXBlID0gbmV3IFJvYm90LlBsYXllcigpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgVGFua2JvdCBNb2RlbHMgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5Sb2JvdC5Ub2JvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAzMDtcbiAgICB0aGlzLm1vZGVsID0gXCJULk8uQi5PLlIuXCI7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gNztcbn07XG5cblJvYm90LlRvYm9yLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5UYW5rYm90KCk7XG5cblJvYm90LlJvY2tCb3QgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gNDA7XG4gICAgdGhpcy5tb2RlbCA9IFwiUm9ja0JvdFwiO1xuICAgIHRoaXMuc2hpZWxkICs9IHRoaXMuc2hpZWxkQm9udXMgPSAyNTtcbn07XG5cblJvYm90LlJvY2tCb3QucHJvdG90eXBlID0gbmV3IFJvYm90LlRhbmtib3QoKTtcblxuUm9ib3QuVGFua2JvdFBsdXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gMjU7XG4gICAgdGhpcy5tb2RlbCA9IFwiVGFua2JvdFBsdXNcIjtcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnNoaWVsZEJvbnVzID0gMzU7XG59O1xuXG5Sb2JvdC5UYW5rYm90UGx1cy5wcm90b3R5cGUgPSBuZXcgUm9ib3QuVGFua2JvdCgpO1xuXG5cbi8qIFBzeWJvdHMgd2lsbCBoYXZlIHN0cm9uZ2VyIHNoaWVsZHMuU2xpZ2h0IGJvbnVzIHRvIGV2YWRpbmcgYXR0YWNrcyBiYXNlZCBvbiB0aGVpclxuIGFiaWxpdHkgdG8gY2FsY3VsYXRlIG9wcG9uZW50cyBuZXh0IG1vdmUuICovXG5cblxuUm9ib3QuUHN5Ym90ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50eXBlID0gXCJQc3lib3RcIjtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gMTA7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5zaGllbGRCb251cyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUgKyAyMCk7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMTA7XG59O1xuXG5Sb2JvdC5Qc3lib3QucHJvdG90eXBlID0gbmV3IFJvYm90LlBsYXllcigpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgIFBzeWJvdCBNb2RlbHMgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5Sb2JvdC5NaW5kbWVsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDI1O1xuICAgIHRoaXMubW9kZWwgPSBcIk1pbmRtZWx0ZXJcIjtcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnNoaWVsZEJvbnVzID0gMzA7XG59O1xuXG5Sb2JvdC5NaW5kbWVsdGVyLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5Qc3lib3QoKTtcblxuUm9ib3QuQnJhaW5zdG9ybSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAxNTtcbiAgICB0aGlzLm1vZGVsID0gXCJCcmFpbnN0b3JtXCI7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5zaGllbGRCb251cyA9IDI1O1xuICAgIHRoaXMuZXZhc2lvbiArPSB0aGlzLmV2YXNpb25Cb251cyA9IDU7XG59O1xuXG5Sb2JvdC5CcmFpbnN0b3JtLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5Qc3lib3QoKTtcblxuUm9ib3QuQmFuc2hlZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAxMDtcbiAgICB0aGlzLm1vZGVsID0gXCJCYW5zaGVlXCI7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5zaGllbGRCb251cyA9IDU1O1xufTtcblxuUm9ib3QuQmFuc2hlZS5wcm90b3R5cGUgPSBuZXcgUm9ib3QuUHN5Ym90KCk7XG5cblxuLyogRnVuY3Rpb25zIGZvciBzZXR0aW5nIHdlYXBvbnMsIG1vZGlmaWNhdGlvbnMsIHR5cGVzLCBhbmQgbW9kZWxzIHRvIHJvYm90IHBsYXllcnMgKi9cblxuUm9ib3QuUGxheWVyLnByb3RvdHlwZS5zZXRXZWFwb24gPSBmdW5jdGlvbihuZXdXZWFwb24pIHtcbiAgICB0aGlzLndlYXBvbiA9IG5ld1dlYXBvbjtcblxuICAgIHRoaXMuZW1wQ2hlY2sgPSBuZXdXZWFwb24uZW1wQ2hlY2s7XG4gICAgdGhpcy5taW5EYW1hZ2UgPSBuZXdXZWFwb24ubWluRGFtYWdlO1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlID0gbmV3V2VhcG9uLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZTtcbn07XG5cblJvYm90LlBsYXllci5wcm90b3R5cGUuc2V0TW9kID0gZnVuY3Rpb24obmV3TW9kKSB7XG4gICAgdGhpcy5tb2RzID0gbmV3TW9kO1xuXG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gbmV3TW9kLmRhbWFnZUJvbnVzO1xuICAgIHRoaXMuaGVhbHRoICs9IG5ld01vZC5oZWFsdGhCb251cztcbiAgICB0aGlzLm5hbm9DaGVjayA9IG5ld01vZC5uYW5vQ2hlY2s7XG4gICAgdGhpcy5ldmFzaW9uICs9IG5ld01vZC5ldmFzaW9uQm9udXM7XG4gICAgdGhpcy5zaGllbGQgKz0gbmV3TW9kLnNoaWVsZEJvbnVzO1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gbmV3TW9kLmVtcENoZWNrO1xufTtcblxuUm9ib3QuUGxheWVyLnByb3RvdHlwZS5zZXRUeXBlID0gZnVuY3Rpb24obmV3VHlwZSkge1xuICAgIHRoaXMudHlwZSA9IG5ldyBSb2JvdFtuZXdUeXBlXTtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLnR5cGUuaGVhbHRoQm9udXM7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy50eXBlLnNoaWVsZEJvbnVzO1xuICAgIHRoaXMuZXZhc2lvbiArPSB0aGlzLnR5cGUuZXZhc2lvbkJvbnVzO1xuXG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cblJvYm90LlBsYXllci5wcm90b3R5cGUuc2V0TW9kZWwgPSBmdW5jdGlvbihuZXdNb2RlbCkge1xuICAgIHRoaXMubW9kZWwgPSBuZXcgUm9ib3RbbmV3TW9kZWxdO1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMubW9kZWwuaGVhbHRoQm9udXM7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5tb2RlbC5zaGllbGRCb251cztcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5tb2RlbC5ldmFzaW9uQm9udXM7XG5cbiAgICByZXR1cm4gdGhpcy5tb2RlbDtcbn07XG5cblxubGV0IFBsYXllck9uZSA9IG5ldyBSb2JvdC5QbGF5ZXIoKTtcblBsYXllck9uZS5uYW1lID0gXCJQbGF5ZXIgT25lXCI7XG5sZXQgUGxheWVyVHdvID0gbmV3IFJvYm90LlBsYXllcigpO1xuUGxheWVyVHdvLm5hbWUgPSBcIlBsYXllciBUd29cIjtcblxuXG4vKiBFeHBvcnQgdGhpcyBidXNpbmVzcyAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSb2JvdCxcbiAgICBQbGF5ZXJPbmUsXG4gICAgUGxheWVyVHdvXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgcm9ib3RzID0gcmVxdWlyZSgnLi9yb2JvdHMuanMnKTtcbmxldCB3ZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zLmpzJyk7XG5sZXQgbW9kcyA9IHJlcXVpcmUoJy4vbW9kcy5qcycpO1xubGV0IGNvbWJhdCA9IHJlcXVpcmUoJy4vY29tYmF0LmpzJyk7XG5cbi8qIGZ1bmN0aW9uIGZvciBjcmVhdGluZyB0aGUgc3RyaW5nIHRoYXQgaXMgYXBwZW5kZWQgd2hlbiBwbGF5ZXIgaXMgaGVhbGVkIGZyb20gdGhlaXIgbmFub2JvdCBtb2QuXG5yZW1vdmVzIGxpbmVzIG9mIHRleHQgYXMgbW9yZSBhcmUgYWRkZWQgdG8gdGhlIGNvbWJhdCB0ZXh0IGNvbnRhaW5lci4gKi9cblxubGV0IHJvYm90TmFub2JvdEhlYWxTdHJpbmcgPSAocGxheWVyLCBuYW5vSGVhbCkgPT4ge1xuICAgIGxldCBuYW5vU3RyaW5nID0gYDxoNT4ke3BsYXllci5uYW1lfSBpcyByZXBhaXJlZCBmb3IgJHtuYW5vSGVhbCgpfSBoZWFsdGggYnkgdGhlaXIgbmFub2JvdHMhYDtcbiAgICBpZiAoJCgnI2NvbWJhdFRleHQnKS5jaGlsZHJlbigpLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgJCgnI2NvbWJhdFRleHQnKS5jaGlsZHJlbignaDU6Zmlyc3QnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgJCgnI2NvbWJhdFRleHQnKS5hcHBlbmQobmFub1N0cmluZyk7XG59O1xuXG4vKiBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgdGhlIHN0cmluZyB0aGF0IGlzIGFwcGVuZGVkIHdoZW4gb2ZmZW5zaXZlIHBsYXllciBhdHRhY2tzIGEgcm9ib3Qgd2l0aCB0aGUgZW1wYXRoeVxudmlydXMgbW9kaWZpY2F0aW9uLiByZW1vdmVzIGVsZW1lbnRzIHRvIGtlZXAgY29tYmF0IHRleHQgY29udGFpbmVyIGZyb20gYmVpbmcgdG9vIGJsb2F0ZWQgd2l0aCB0ZXh0LiAqL1xuXG5sZXQgcm9ib3RFbXBhdGh5U3RyaW5nID0gKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyKSA9PiB7XG4gICAgbGV0IGVtcGF0aHlTdHJpbmcgPSBgPGg1PiR7b2ZmZW5zaXZlUGxheWVyLm5hbWV9IGh1Z3MgJHtkZWZlbnNpdmVQbGF5ZXIubmFtZX0gaW5zdGVhZCBvZiBhdHRhY2tpbmchIEdyb3NzITwvaDU+YDtcbiAgICBpZiAoJCgnI2NvbWJhdFRleHQnKS5jaGlsZHJlbigpLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgJCgnI2NvbWJhdFRleHQnKS5jaGlsZHJlbignaDU6Zmlyc3QnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgJCgnI2NvbWJhdFRleHQnKS5hcHBlbmQoZW1wYXRoeVN0cmluZyk7XG59O1xuXG4vKiBzdHJpbmcgdGhhdCBpcyBhcHBlbmRlZCB3aGVuZXZlciBhIHBsYXllciBkb2RnZXMgYW4gb3Bwb25lbnQncyBhdHRhY2suICovXG5cbmxldCByb2JvdERvZGdlU3RyaW5nID0gKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyKSA9PiB7XG4gICAgbGV0IGRvZGdlU3RyaW5nID0gYDxoNT4ke29mZmVuc2l2ZVBsYXllci5uYW1lfSBhdHRhY2tzLCBidXQgJHtkZWZlbnNpdmVQbGF5ZXIubmFtZX0gc3dpZnRseSBkb2RnZXMhPC9oNT5gO1xuICAgIGlmICgkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCkubGVuZ3RoID4gNykge1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCdoNTpmaXJzdCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICAkKCcjY29tYmF0VGV4dCcpLmFwcGVuZChkb2RnZVN0cmluZyk7XG59O1xuXG4vKiBjcmVhdGVzIHRleHQgdGhhdCBpcyBkaXNwbGF5ZWQgaW4gYmF0dGxlZG9tZSB2aWV3IGZvciBzaG93aW5nIGVhY2ggcm9ib3QncyBzdGF0cy4gKi9cblxubGV0IHJvYm90VG9DYXJkID0gKHBsYXllciwgcGxheWVyRWxlbWVudCkgPT4ge1xuICAgIGxldCBwbGF5ZXJTdHJpbmcgPSBcIlwiO1xuICAgIHBsYXllclN0cmluZyArPSBgPGgxPiR7cGxheWVyLm5hbWV9PC9oMT5gO1xuICAgIHBsYXllclN0cmluZyArPSBgPGg0PkhlYWx0aDogJHtwbGF5ZXIuaGVhbHRofTwvaDQ+YDtcbiAgICBwbGF5ZXJTdHJpbmcgKz0gYDxoND5TaGllbGQ6ICR7cGxheWVyLnNoaWVsZH08L2g0PmA7XG4gICAgcGxheWVyU3RyaW5nICs9IGA8aDQ+VHlwZTogJHtwbGF5ZXIudHlwZS50eXBlfTwvaDQ+YDtcbiAgICBwbGF5ZXJTdHJpbmcgKz0gYDxoND5Nb2RlbDogJHtwbGF5ZXIubW9kZWwubW9kZWx9PC9oND5gO1xuICAgICQocGxheWVyRWxlbWVudCkuaHRtbChgJHtwbGF5ZXJTdHJpbmd9YCk7XG59O1xuXG4vKiBjcmVhdGVzIGJhc2UgY29tYmF0IHN0cmluZyB3aGVuIGF0dGFja3MgYXJlIHN1Y2Nlc3NmdWwgYWdhaW5zdCBlbmVteSByb2JvdHMuICovXG5cbmxldCByb2JvdHNDb21iYXRUZXh0ID0gKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyLCBkYW1hZ2UpID0+IHtcblxuICAgIGlmICgkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCkubGVuZ3RoID4gNykge1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCdoNTpmaXJzdCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICAkKCcjY29tYmF0VGV4dCcpLmFwcGVuZChgPGg1PiR7b2ZmZW5zaXZlUGxheWVyLm5hbWV9IGF0dGFja3MgJHtkZWZlbnNpdmVQbGF5ZXIubmFtZX0gd2l0aCBhICR7b2ZmZW5zaXZlUGxheWVyLndlYXBvbi53ZXBOYW1lfSBmb3IgJHtkYW1hZ2V9IGRhbWFnZSE8L2g1PmApO1xuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJvYm90TmFub2JvdEhlYWxTdHJpbmcsXG4gICAgcm9ib3RFbXBhdGh5U3RyaW5nLFxuICAgIHJvYm90VG9DYXJkLFxuICAgIHJvYm90c0NvbWJhdFRleHQsXG4gICAgcm9ib3REb2RnZVN0cmluZ1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubGV0IFdlYXBvbkNhY2hlID0ge307XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgICAgQmFzZSBXZWFwb24gICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5XZWFwb25DYWNoZS5XZWFwb24gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndlcE5hbWUgPSBudWxsO1xuICAgIHRoaXMubWluRGFtYWdlID0gMDtcbiAgICB0aGlzLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSA9IDA7XG4gICAgdGhpcy5lbXBDaGVjayA9IDA7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgTW9kaWZpZWQgV2VhcG9ucyAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4vKiBFTVAgUmlmbGUgaGFzIG1lZGl1bSBsb3cgZW5kLCBsYXJnZXIgcmFuZG9tIHJhbmdlIHRoYW4gbW9zdCBvdGhlciB3ZWFwb25zLiAqL1xuXG5cbldlYXBvbkNhY2hlLkVtcFJpZmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53ZXBOYW1lID0gXCJFLk0uUC4gUmlmbGVcIjtcbiAgICB0aGlzLm1pbkRhbWFnZSArPSA5O1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlICs9IDEwO1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMDtcbn07XG5cbldlYXBvbkNhY2hlLkVtcFJpZmxlLnByb3RvdHlwZSA9IG5ldyBXZWFwb25DYWNoZS5XZWFwb24oKTtcblxuXG4vKiBNZWdhemFwcGVyIGlzIGEgZmFpcmx5IHN0cmFpZ2h0LWZvcndhcmQgd2VhcG9uLiBTbWFsbGVyIHJhbmdlIGluIHJhbmRvbW5lc3MsIGJ1dCBnaXZlcyB1cCBoaWdoZXN0XG4gICBwb3NzaWJsZSB0b3AtZW5kIGZvciBjb25zaXN0ZW5jeS4gKi9cblxuXG5XZWFwb25DYWNoZS5NZWdhemFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53ZXBOYW1lID0gXCJNZWdhWmFwcGVyXCI7XG4gICAgdGhpcy5taW5EYW1hZ2UgKz0gMTI7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMztcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5XZWFwb25DYWNoZS5NZWdhemFwcGVyLnByb3RvdHlwZSA9IG5ldyBXZWFwb25DYWNoZS5XZWFwb24oKTtcblxuXG4vKiBDaGFvcyBHcmVuYWRlIGhhcyB0aGUgaGlnaGVzdCB0b3AtZW5kIGZvciBkYW1hZ2UsIGJ1dCBjb3VsZCBhbHNvIGxlYXZlIHlvdSBoaXR0aW5nIGxpa2UgYSB3ZXQgbm9vZGxlLlxuICAgSWYgdGltZSBwZXJtaXRzLCB3aWxsIHR3ZWFrIHRoZSBkYW1hZ2UgbnVtYmVycyB0byBjb21lIHVwIHdpdGggc29tZXRoaW5nIGJhbGFuY2VkLiAqL1xuXG5cbldlYXBvbkNhY2hlLkNoYW9zR3JlbmFkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2VwTmFtZSA9IFwiQ2hhb3MgR3JlbmFkZVwiO1xuICAgIHRoaXMubWluRGFtYWdlICs9IDE7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMjQ7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuV2VhcG9uQ2FjaGUuQ2hhb3NHcmVuYWRlLnByb3RvdHlwZSA9IG5ldyBXZWFwb25DYWNoZS5XZWFwb24oKTtcblxuXG4vKiBNdXJkZXIgS25pZmUgaXMgYSBwbGFjZSBob2xkZXIgd2VhcG9uLiAqL1xuXG5XZWFwb25DYWNoZS5NdXJkZXJLbmlmZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2VwTmFtZSA9IFwiTXVyZGVyS25pZmVcIjtcbiAgICB0aGlzLm1pbkRhbWFnZSArPSA5O1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlICs9IDM7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuV2VhcG9uQ2FjaGUuTXVyZGVyS25pZmUucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5cbi8qIE1pY3JvIFdhdmUgaXMgYSBwbGFjZSBob2xkZXIgd2VhcG9uLiAqL1xuXG5cbldlYXBvbkNhY2hlLk1pY3JvV2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2VwTmFtZSA9IFwiTWljcm8gV2F2ZVwiO1xuICAgIHRoaXMubWluRGFtYWdlICs9IDExO1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlICs9IDE7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuV2VhcG9uQ2FjaGUuTWljcm9XYXZlLnByb3RvdHlwZSA9IG5ldyBXZWFwb25DYWNoZS5XZWFwb24oKTtcblxuXG4vKiBQbGFzdGljIFNwb3JrIGlzIGEgcGxhY2UgaG9sZGVyIHdlYXBvbi4gKi9cblxuXG5XZWFwb25DYWNoZS5QbGFzdGljU3BvcmsgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndlcE5hbWUgPSBcIlBsYXN0aWMgU3BvcmtcIjtcbiAgICB0aGlzLm1pbkRhbWFnZSArPSAzO1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlICs9IDM7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuV2VhcG9uQ2FjaGUuUGxhc3RpY1Nwb3JrLnByb3RvdHlwZSA9IG5ldyBXZWFwb25DYWNoZS5XZWFwb24oKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgV2VhcG9uQ2FjaGVcbn07Il19
