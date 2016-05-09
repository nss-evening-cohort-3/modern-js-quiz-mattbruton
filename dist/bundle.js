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


    console.log(player);


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


        console.log("1", robots.PlayerOne);
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
        console.log(playerCount);

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


console.log(PlayerOne.health);
console.log(PlayerTwo);
console.log(PlayerOne);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb21iYXQuanMiLCJqYXZhc2NyaXB0cy9tYWluLmpzIiwiamF2YXNjcmlwdHMvbW9kcy5qcyIsImphdmFzY3JpcHRzL3JvYm90cy5qcyIsImphdmFzY3JpcHRzL3N0cmluZy5qcyIsImphdmFzY3JpcHRzL3dlYXBvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xubGV0IHJvYm90cyA9IHJlcXVpcmUoJy4vcm9ib3RzLmpzJyk7XG5sZXQgd2VhcG9ucyA9IHJlcXVpcmUoJy4vd2VhcG9ucy5qcycpO1xubGV0IG1vZHMgPSByZXF1aXJlKCcuL21vZHMuanMnKTtcbmxldCBzdHJpbmcgPSByZXF1aXJlKCcuL3N0cmluZy5qcycpO1xuXG4vKiBjaGVja3MgdG8gc2VlIGlmIHRoZSBwbGF5ZXIgaGFzIHNlbGVjdGVkIHRoZSByZXN0b3JhdGl2ZSBuYW5vYm90IG1vZGlmaWNhdGlvbiBmb3IgdXNlIGluIGxhdGVyIGZ1bmN0aW9uICovXG5cbmxldCBuYW5vYm90Q2hlY2sgPSAocGxheWVyKSA9PiB7XG4gICAgbGV0IG5hbm9DaGVja2VyID0gZmFsc2U7XG4gICAgaWYgKHBsYXllci5uYW5vQ2hlY2sgPiAwKSB7XG4gICAgICAgIG5hbm9DaGVja2VyID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbm9DaGVja2VyO1xufTtcblxuLyogaWYgcGxheWVyIGhhcyBzZWxlY3RlZCByZXN0b3JhdGl2ZSBuYW5vYm90cywgdGhleSBhcmUgaGVhbGVkIGZvciB0aGUgYW1vdW50IHJhbmRvbWx5IGdlbmVyYXRlZCB3aXRoaW4gdGhpcyBmdW5jdGlvbiAqL1xuXG5sZXQgbmFub0hlYWwgPSAoKSA9PiB7XG4gICAgbGV0IG5hbm9IZWFsQW1vdW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG5cbiAgICByZXR1cm4gbmFub0hlYWxBbW91bnQ7XG59O1xuXG4vKiB0aGlzIGlzIHRoZSBmdW5jdGlvbiBmb3IgY2FsY3VsYXRpbmcgcGxheWVyIGRhbWFnZS4gaXQgdGFrZXMgdGhlIG1pbmltdW0gZGFtYWdlIHN0YXQgZnJvbSBhIHdlYXBvbiBhbmQgYWRkc1xuYSByYW5kb20gbnVtYmVyIGluIHRoZSBhZGRpdGlvbmFsIGRhbWFnZSByYW5nZSB0byB0aGUgbWluaW11bS4gKi9cblxubGV0IGRhbWFnZSA9IChwbGF5ZXIpID0+IHtcbiAgICBsZXQgdG90YWxEYW1hZ2UgPSAwO1xuICAgIHRvdGFsRGFtYWdlICs9IHBsYXllci5taW5EYW1hZ2U7XG4gICAgdG90YWxEYW1hZ2UgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGxheWVyLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSk7XG4gICAgcmV0dXJuIHRvdGFsRGFtYWdlO1xufTtcblxuLyogY2hlY2tzIGlmIHRoZSBzaGllbGQgaXMgbGVzcyB0aGFuIHplcm8gYW5kIHNldHMgaXQgdG8gemVybyAqL1xuXG5sZXQgc2hpZWxkQ2hlY2sgPSAocGxheWVyKSA9PiB7XG4gICAgaWYgKHBsYXllci5zaGllbGQgPCAwKSB7XG4gICAgICAgIHBsYXllci5zaGllbGQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gcGxheWVyO1xufTtcblxuLyogZ2l2ZSB0aGUgcGxheWVyIGEgMSBpbiA4IGNoYW5jZSB0byBjYXVzZSBvcHBvbmVudCB0byBub3QgZGVhbCBkYW1hZ2UgaW4gYSByb3VuZCBvZiBjb21iYXQuICovXG5cbmxldCBlbXBhdGh5Q2hlY2sgPSAocGxheWVyKSA9PiB7XG4gICAgbGV0IGVtcGF0aHkgPSBmYWxzZTtcbiAgICBpZiAocGxheWVyLmVtcENoZWNrID4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOCkpIHtcbiAgICAgICAgZW1wYXRoeSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBlbXBhdGh5O1xufTtcblxuLyogZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgb3RoZXIgY29tYmF0IGZ1bmN0aW9ucyBkZXBlbmRpbmcgb24gY29uZGl0aW9ucy4gY2hlY2tzIGlmIHBsYXllciBoYXMgcmVzdG9yYXRpdmUgbmFub2JvdHMsXG4gZW1wYXRoeSB2aXJ1cyBtb2QsIGV2YXNpb24sIG9yIGEgc2hpZWxkIGJlZm9yZSBkZWR1Y3RpbmcgaGVhbHRoIGJhc2VkIG9uIHRoZWlyIG9wcG9uZW50J3MgYXR0YWNrLiAqL1xuXG5sZXQgYXR0YWNrID0gKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyKSA9PiB7XG5cbiAgICBsZXQgZG1nTnVtYmVyID0gZGFtYWdlKG9mZmVuc2l2ZVBsYXllcik7XG4gICAgbGV0IGhlYWxOdW1iZXIgPSBuYW5vSGVhbChkZWZlbnNpdmVQbGF5ZXIpO1xuXG4gICAgaWYgKG5hbm9ib3RDaGVjayhkZWZlbnNpdmVQbGF5ZXIpID09PSB0cnVlKSB7XG4gICAgICAgIGRlZmVuc2l2ZVBsYXllci5oZWFsdGggKz0gbmFub0hlYWwoKTtcbiAgICAgICAgc3RyaW5nLnJvYm90TmFub2JvdEhlYWxTdHJpbmcoZGVmZW5zaXZlUGxheWVyLCBuYW5vSGVhbCk7XG4gICAgfVxuXG4gICAgaWYgKGVtcGF0aHlDaGVjayhkZWZlbnNpdmVQbGF5ZXIpID09PSB0cnVlKSB7XG4gICAgICAgIHN0cmluZy5yb2JvdEVtcGF0aHlTdHJpbmcob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIpO1xuICAgIH0gZWxzZSBpZiAoZXZhc2lvbihkZWZlbnNpdmVQbGF5ZXIpID09PSB0cnVlKSB7XG4gICAgICAgIHN0cmluZy5yb2JvdERvZGdlU3RyaW5nKG9mZmVuc2l2ZVBsYXllciwgZGVmZW5zaXZlUGxheWVyKTtcbiAgICB9IGVsc2UgaWYgKGRlZmVuc2l2ZVBsYXllci5zaGllbGQgPiAwKSB7XG4gICAgICAgIGRlZmVuc2l2ZVBsYXllci5zaGllbGQgLT0gZG1nTnVtYmVyO1xuICAgICAgICBzdHJpbmcucm9ib3RzQ29tYmF0VGV4dChvZmZlbnNpdmVQbGF5ZXIsIGRlZmVuc2l2ZVBsYXllciwgZG1nTnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZlbnNpdmVQbGF5ZXIuaGVhbHRoIC09IGRtZ051bWJlcjtcbiAgICAgICAgc3RyaW5nLnJvYm90c0NvbWJhdFRleHQob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIsIGRtZ051bWJlcik7XG4gICAgfVxufTtcblxuLyogdXNlZCBpbiB0aGUgYXR0YWNrIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIHJvYm90IGF2b2lkcyBhbiBhdHRhY2suIEl0IGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlblxuMSBhbmQgMTAwLCBhbmQgaWYgdGhlIHJvYm90J3MgZXZhc2lvbiBzdGF0IGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGF0IG51bWJlciwgdGhleSB0YWtlIG5vIGRhbWFnZSB0aGF0IHJvdW5kLiAqL1xuXG5sZXQgZXZhc2lvbiA9IChwbGF5ZXIpID0+IHtcbiAgICBsZXQgZXZhc2lvbkNoZWNrID0gZmFsc2U7XG4gICAgaWYgKHBsYXllci5ldmFzaW9uID49IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkpIHtcbiAgICAgICAgZXZhc2lvbkNoZWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZhc2lvbkNoZWNrO1xufTtcblxuLyogVXNlZCBpbiB2aWN0b3J5IGNoZWNrIGZ1bmN0aW9uIHRvIGhpZGUgcGxheWVyIGNhcmRzLCB0aGUgYnV0dG9uIHRoYXQgcHJvZ3Jlc3NlcyB0aGUgYmF0dGxlIGFuZCBsZWF2ZXMgdGhlIGNvbWJhdFxubG9nIHZpZXdhYmxlIHNvIHRoZSB1c2VycyBjYW4gc2VlIHdobyB3YXMgZGVmZWF0ZWQuICovXG5cbmxldCB2aWN0b3J5VmlldyA9ICgpID0+IHtcbiAgICAkKCcjYmF0dGxlU3RhcnRCdG4nKS5oaWRlKCk7XG4gICAgJCgnI3BsYXllck9uZUNhcmQnKS5oaWRlKCk7XG4gICAgJCgnI3BsYXllclR3b0NhcmQnKS5oaWRlKCk7XG59O1xuXG4vKiBDaGVja3MgaWYgYm90aCwgb3Igb25lIG9mIHRoZSBwbGF5ZXJzIGhhdmUgMCBvciBsZXNzIGhlYWx0aCwgdGhlbiBjaGFuZ2VzIHRvIHRoZSB2aWV3IHRoYXQgZGlzcGxheXMgd2hpY2ggY2hhcmFjdGVyXG53YXMgZGVmZWF0ZWQuICovXG5cbmxldCB2aWN0b3J5Q2hlY2sgPSAoZmlyc3RQbGF5ZXIsIHNlY29uZFBsYXllcikgPT4ge1xuICAgIGxldCB2aWN0b3J5U3RyaW5nID0gXCJcIjtcblxuICAgIGlmIChmaXJzdFBsYXllci5oZWFsdGggPD0gMCAmJiBzZWNvbmRQbGF5ZXIuaGVhbHRoIDw9IDApIHtcbiAgICAgICAgdmljdG9yeVN0cmluZyArPSBgPGgyPkJvdGggb2YgdGhlc2UgYm90cyBhcmUgc2NyYXBwZWQhPC9oMj5gO1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmh0bWwoYCR7dmljdG9yeVN0cmluZ31gKTtcbiAgICAgICAgdmljdG9yeVZpZXcoKTtcbiAgICB9IGVsc2UgaWYgKGZpcnN0UGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgIHZpY3RvcnlTdHJpbmcgKz0gYDxoMj4ke3NlY29uZFBsYXllci5uYW1lfSBoYXMgZGVmZWF0ZWQgJHtmaXJzdFBsYXllci5uYW1lfSE8L2gyPmA7XG4gICAgICAgICQoJyNjb21iYXRUZXh0JykuaHRtbChgJHt2aWN0b3J5U3RyaW5nfWApO1xuICAgICAgICB2aWN0b3J5VmlldygpO1xuICAgIH0gZWxzZSBpZiAoc2Vjb25kUGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgIHZpY3RvcnlTdHJpbmcgKz0gYDxoMj4ke2ZpcnN0UGxheWVyLm5hbWV9IGhhcyBkZWZlYXRlZCAke3NlY29uZFBsYXllci5uYW1lfSE8L2gyPmA7XG4gICAgICAgICQoJyNjb21iYXRUZXh0JykuaHRtbChgJHt2aWN0b3J5U3RyaW5nfWApO1xuICAgICAgICB2aWN0b3J5VmlldygpO1xuICAgIH1cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkYW1hZ2UsXG4gICAgYXR0YWNrLFxuICAgIGV2YXNpb24sXG4gICAgdmljdG9yeUNoZWNrLFxuICAgIHNoaWVsZENoZWNrLFxuICAgIGVtcGF0aHlDaGVjayxcbiAgICBuYW5vYm90Q2hlY2ssXG4gICAgbmFub0hlYWxcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCByb2JvdHMgPSByZXF1aXJlKCcuL3JvYm90cy5qcycpO1xubGV0IHdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMuanMnKTtcbmxldCBtb2RzID0gcmVxdWlyZSgnLi9tb2RzLmpzJyk7XG5sZXQgY29tYmF0ID0gcmVxdWlyZSgnLi9jb21iYXQuanMnKTtcbmxldCBzdHJpbmcgPSByZXF1aXJlKCcuL3N0cmluZy5qcycpO1xuXG4vKiBjaGFyYWN0ZXJDcmVhdGlvblZpZXcgc2V0cyB3aGljaCBlbGVtZW50cyBhcmUgdmlzYWJsZSBvbiBsb2FkIGFuZCB1cG9uIHN3aXRjaGluZyBiZXR3ZWVuIFBsYXllciBPbmUgYW5kIFxuUGxheWVyIFR3byBpbiB0aGUgY3JlYXRpb24gcHJvY2VzcyAqL1xuXG5sZXQgY2hlY2tUb0tpbGxJbnRlcnZhbHMgPSBmYWxzZTtcblxubGV0IGNoYXJhY3RlckNyZWF0aW9uVmlldyA9ICgpID0+IHtcbiAgICAkKCcjbW9kZWxfc2VsZWN0JykuaGlkZSgpO1xuICAgICQoJyN3ZWFwb25fc2VsZWN0JykuaGlkZSgpO1xuICAgICQoJyNtb2Rfc2VsZWN0JykuaGlkZSgpO1xuICAgICQoJyNkcm9uZU1vZGVscycpLmhpZGUoKTtcbiAgICAkKCcjdGFua2JvdE1vZGVscycpLmhpZGUoKTtcbiAgICAkKCcjcHN5Ym90TW9kZWxzJykuaGlkZSgpO1xuICAgICQoJyNkcm9uZURlc2NyaXB0aW9uJykuaGlkZSgpO1xuICAgICQoJyN0YW5rYm90RGVzY3JpcHRpb24nKS5oaWRlKCk7XG4gICAgJCgnI3BzeWJvdERlc2NyaXB0aW9uJykuaGlkZSgpO1xuICAgICQoJyNiYXR0bGVkb21lJykuaGlkZSgpO1xuICAgICQoJyN0eXBlX3NlbGVjdCcpLnNob3coKTtcbn07XG5cbi8qIHBsYXllckNvdW50IGlzIHVzZWQgYnkgcm9ib3RDaGVjayBmdW5jdGlvbiBmb3Igc3dpdGNoaW5nIHdoaWNoIFBsYXllciBpcyBiZWluZyBhdWdtZW50ZWQgYW5kIHdoaWNoIFxuaGVhZGVyIGlzIGRpc3BsYXllZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBhIGJ1dHRvbiBpbiB0aGUgbW9kaWZ5X3NlbGVjdCBlbGVtZW50ICovXG5cbmxldCBwbGF5ZXJDb3VudCA9IDA7XG5cbi8qIHBsYXllciB2YXJpYWJsZSBjaGFuZ2VzIGluIHRoZSByb2JvdENoZWNrIGZ1bmN0aW9uIGJhc2VkIG9uIHByZXZpb3VzIHZhcmlhYmxlIHBsYXllckNvdW50J3MgdmFsdWUgKi9cblxubGV0IHBsYXllcjtcblxuLyogY29uZGl0aW9uYWwgc3RhdGVtZW50IHRoYXQgaXMgcnVuIGF0IHRoZSBlbmQgb2YgdGhlIGZpcnN0IGNoYXJhY3RlciBjcmVhdGlvbiBwcm9jZXNzIHRvIGJlZ2luIHN0b3JpbmcgdmFsdWVzXG5mb3IgbmV4dCBwbGF5ZXIgKi9cblxubGV0IHJvYm90Q2hlY2sgPSAoKSA9PiB7XG4gICAgaWYgKHBsYXllckNvdW50IDw9IDApIHtcbiAgICAgICAgcGxheWVyID0gcm9ib3RzLlBsYXllck9uZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIgPSByb2JvdHMuUGxheWVyVHdvO1xuICAgIH1cbn07XG5cbnJvYm90Q2hlY2soKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblxuICAgIGNvbnNvbGUubG9nKHBsYXllcik7XG5cblxuICAgIGNoYXJhY3RlckNyZWF0aW9uVmlldygpO1xuXG4gICAgLyogV2hlbiBhIHR5cGUgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSB1c2VyJ3MgdHlwZSBzZWxlY3Rpb24gaXMgc3RvcmVkIGluIHRoZWlyIFBsYXllciBvYmplY3QsIHRoZSB0eXBlIHZpZXcgaXMgaGlkZGVuLFxuICAgIGFuZCBiYXNlZCBvbiB0aGUgSUQgb2YgdGhlIGNsaWNrZWQgYnV0dG9uLCBtb2RlbHMgZm9yIHRoYXQgdHlwZSBhcmUgZGlzcGxheWVkIGluIHRoZSBuZXh0IHZpZXcuICovXG4gICAgJCgnLnR5cGVidG4nKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICQoJyN0eXBlX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAgICAgcGxheWVyLnNldFR5cGUoZXZlbnQudGFyZ2V0LmlkKTtcblxuICAgICAgICAkKCcjbW9kZWxfc2VsZWN0Jykuc2hvdygpO1xuICAgICAgICAkKCcjbW9kZWxfYnV0dG9ucycpLnNob3coKTtcblxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09IFwiRHJvbmVcIikge1xuICAgICAgICAgICAgJCgnI2Ryb25lRGVzY3JpcHRpb24nKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcjZHJvbmVNb2RlbHMnKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IFwiVGFua2JvdFwiKSB7XG4gICAgICAgICAgICAkKCcjdGFua2JvdERlc2NyaXB0aW9uJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnI3Rhbmtib3RNb2RlbHMnKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcjcHN5Ym90RGVzY3JpcHRpb24nKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcjcHN5Ym90TW9kZWxzJykuc2hvdygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8qIFdoZW4gYSBtb2RlbCBidXR0b24gaXMgY2xpY2tlZCwgdGhlIHVzZXIncyBtb2RlbCBzZWxlY3Rpb24gaXMgc3RvcmVkIGluIHRoZWlyIFBsYXllciBvYmplY3QsIHRoZSBtb2RlbCB2aWV3XG4gICAgaXMgaGlkZGVuLCBhbmQgdGhlIHdlYXBvbiBzZWxlY3Rpb24gc2NyZWVuIGlzIHNob3duLiAqL1xuICAgICQoJy5tb2RlbGJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgJCgnI21vZGVsX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAgICAgcGxheWVyLnNldE1vZGVsKGV2ZW50LnRhcmdldC5pZCk7XG4gICAgICAgICQoJyN3ZWFwb25fc2VsZWN0Jykuc2hvdygpO1xuICAgIH0pO1xuXG4gICAgLyogd2hlbiB0aGUgdXNlciBjbGlja3MgYSB3ZWFwb24gYnV0dG9uLCB0aGUgd2VhcG9uIHNlbGVjdCB2aWV3IGlzIGhpZGRlbiBhbmQgdGhlIHVzZXIncyB3ZWFwb24gcHJvcGVydHkgaXNcbiAgICBzZXQgdG8gdGhlIHNlbGVjdGVkIHdlYXBvbiwgdGhlbiBtb2RpZmljYXRpb25zIGFyZSBzaG93bi4gKi9cblxuICAgICQoJy53ZXBidG4nKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuICAgICAgICAkKCcjd2VhcG9uX3NlbGVjdCcpLmhpZGUoKTtcbiAgICAgICAgcGxheWVyLnNldFdlYXBvbihuZXcgd2VhcG9ucy5XZWFwb25DYWNoZVtldmVudC50YXJnZXQuaWRdKCkpO1xuXG4gICAgICAgICQoJyNtb2Rfc2VsZWN0Jykuc2hvdygpO1xuICAgIH0pO1xuXG4gICAgLyogd2hlbiBhIG1vZGlmaWNhdGlvbiBidXR0b24gaXMgY2xpY2tlZCwgdGhlIHVzZXIncyBtb2QgcHJvcGVydHkgaXMgc2V0IHRvIHRoYXQgcGFydGljdWxhciBvYmplY3QuIFxuICAgIHBsYXllckNvdW50IGlzIGluY3JlbWVudGVkIHVwIGVhY2ggdGltZSB0aGlzIGhhcHBlbnMuIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGluY3JlbWVudGVkLCB0aGUgaGVhZGVyIGZvclxuICAgIHBsYXllciBvbmUgaXMgcmVwbGFjZWQgd2l0aCBvbmUgZm9yIHBsYXllciB0d28sIGFuZCB0aGUgYnV0dG9ucyBub3cgc2V0IHZhbHVlcyBmb3IgcGxheWVyIHR3byBpbnN0ZWFkIFxuICAgIG9mIHBsYXllciBvbmUuIGlmIHBsYXllckNvdW50IGlzIGluY3JlbWVudGVkIHVwIHRvIHR3byBhdCB0aGlzIHBvaW50LCB0aGUgY2hhcmFjdGVyIHNlbGVjdGlvbiBzY3JlZW4gaXMgXG4gICAgaGlkZGVuIGFuZCB0aGUgYmF0dGxlZG9tZSB2aWV3IGlzIHNob3duLiAqL1xuXG4gICAgJCgnLm1vZGJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHBsYXllci5zZXRNb2QobmV3IG1vZHMuQXJtb3J5W2V2ZW50LnRhcmdldC5pZF0oKSk7XG5cblxuICAgICAgICBjb25zb2xlLmxvZyhcIjFcIiwgcm9ib3RzLlBsYXllck9uZSk7XG4gICAgICAgIGNoYXJhY3RlckNyZWF0aW9uVmlldygpO1xuICAgICAgICBwbGF5ZXJDb3VudCsrO1xuXG4gICAgICAgIGlmIChwbGF5ZXJDb3VudCA+PSAwKSB7XG4gICAgICAgICAgICAkKFwiaDEuZmlyc3RcIikucmVwbGFjZVdpdGgoJzxoMT5QbGF5ZXIgVHdvPC9oMT4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvYm90Q2hlY2soKTtcblxuICAgICAgICBpZiAocGxheWVyQ291bnQgPT0gMikge1xuICAgICAgICAgICAgJCgnI3JvYm90X2NyZWF0aW9uJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3BsYXllckhlYWRlcicpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJyNiYXR0bGVkb21lJykuc2hvdygpO1xuICAgICAgICAgICAgc3RyaW5nLnJvYm90VG9DYXJkKHJvYm90cy5QbGF5ZXJPbmUsIFwiI3BsYXllck9uZUNhcmRcIik7XG4gICAgICAgICAgICBzdHJpbmcucm9ib3RUb0NhcmQocm9ib3RzLlBsYXllclR3bywgXCIjcGxheWVyVHdvQ2FyZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJDb3VudCk7XG5cbiAgICB9KTtcblxuICAgIC8qIHRoZSB0d28gYmF0dGxlIHNlcXVlbmNlIGZ1bmN0aW9ucyBhcmUgcnVuIHVwb24gY2xpY2tpbmcgdGhlIGJhdHRsZSBidXR0b24gd2l0aGluIHRoZSBiYXR0bGVkb21lIHZpZXcuIFxuICAgIHRoZXNlIGZ1bmN0aW9ucyBhcmUgZGVzY3JpYmVkIGluIGdyZWF0ZXIgZGV0YWlsIGluIHRoZWlyIGNvcnJlc3BvbmRpbmcganMgZmlsZXMuICovXG5cbiAgICBsZXQgYmF0dGxlU2VxdWVuY2UgPSAoKSA9PiB7XG4gICAgICAgIGNvbWJhdC5hdHRhY2socm9ib3RzLlBsYXllck9uZSwgcm9ib3RzLlBsYXllclR3byk7XG4gICAgICAgIGNvbWJhdC5zaGllbGRDaGVjayhyb2JvdHMuUGxheWVyVHdvKTtcbiAgICAgICAgc3RyaW5nLnJvYm90VG9DYXJkKHJvYm90cy5QbGF5ZXJPbmUsIFwiI3BsYXllck9uZUNhcmRcIik7XG4gICAgICAgIGNvbWJhdC52aWN0b3J5Q2hlY2socm9ib3RzLlBsYXllck9uZSwgcm9ib3RzLlBsYXllclR3byk7XG4gICAgfTtcblxuXG5cbiAgICBsZXQgYmF0dGxlU2VxdWVuY2VUd28gPSAoKSA9PiB7XG4gICAgICAgIGNvbWJhdC5hdHRhY2socm9ib3RzLlBsYXllclR3bywgcm9ib3RzLlBsYXllck9uZSk7XG4gICAgICAgIGNvbWJhdC5zaGllbGRDaGVjayhyb2JvdHMuUGxheWVyT25lKTtcbiAgICAgICAgc3RyaW5nLnJvYm90VG9DYXJkKHJvYm90cy5QbGF5ZXJUd28sIFwiI3BsYXllclR3b0NhcmRcIik7XG4gICAgICAgIGNvbWJhdC52aWN0b3J5Q2hlY2socm9ib3RzLlBsYXllclR3bywgcm9ib3RzLlBsYXllck9uZSk7XG4gICAgfTtcblxuICAgICQoJyNiYXR0bGVTdGFydEJ0bicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBiYXR0bGVTZXF1ZW5jZSgpO1xuICAgICAgICBiYXR0bGVTZXF1ZW5jZVR3bygpO1xuICAgIH0pO1xuXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxubGV0IEFybW9yeSA9IHt9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gICAgIEJhc2UgTW9kICAgICAgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuQXJtb3J5Lk1vZGlmaWNhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubW9kTmFtZSA9IG51bGw7XG4gICAgdGhpcy5uYW5vQ2hlY2sgPSBudWxsO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgPSAwO1xuICAgIHRoaXMuZGFtYWdlQm9udXMgPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzID0gMDtcbiAgICB0aGlzLnNoaWVsZEJvbnVzID0gMDtcbiAgICB0aGlzLmVtcENoZWNrID0gMDtcblxuICAgIHJldHVybiB0aGlzLm1vZE5hbWU7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgICBTcGVjaWZpYyAgTW9kcyAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4vKiBSZXN0b3JhdGl2ZSBOYW5vYm90cyB3aWxsIGhlYWwgdGhlIHJvYm90IGZvciBhIHNtYWxsIGFtb3VudCBhZnRlciBlYWNoIHJvdW5kIG9mIGNvbWJhdC4gKi9cblxuXG5Bcm1vcnkuTmFub2JvdHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBcIlJlc3RvcmF0aXZlIE5hbm9ib3RzXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAxO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gNTtcbiAgICB0aGlzLmRhbWFnZUJvbnVzICs9IDA7XG4gICAgdGhpcy5ldmFzaW9uQm9udXMgKz0gMDtcbiAgICB0aGlzLnNoaWVsZEJvbnVzICs9IDU7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuQXJtb3J5Lk5hbm9ib3RzLnByb3RvdHlwZSA9IG5ldyBBcm1vcnkuTW9kaWZpY2F0aW9uKCk7XG5cblxuLyogUmVpbmZvcmNlZCBwbGF0aW5nIHdpbGwgZ2l2ZSB0aGUgcm9ib3QgYSBzbGlnaHRseSBoaWdoZXIgYmFzZSBoZWFsdGgsIG1pbm9yIHNoaWVsZC4gKi9cblxuXG5Bcm1vcnkuUGxhdGluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubW9kTmFtZSA9IFwiUmVpbmZvcmNlZCBQbGF0aW5nXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAwO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gMjU7XG4gICAgdGhpcy5kYW1hZ2VCb251cyArPSAwO1xuICAgIHRoaXMuZXZhc2lvbkJvbnVzICs9IDA7XG4gICAgdGhpcy5zaGllbGRCb251cyArPSAxMDtcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5Bcm1vcnkuUGxhdGluZy5wcm90b3R5cGUgPSBuZXcgQXJtb3J5Lk1vZGlmaWNhdGlvbigpO1xuXG5cbi8qIEZpbmQgV2Vha25lc3Mgd2lsbCBsb29rIGZvciBmbGF3cyBpbiBvcHBvbmVudCdzIGZyYW1lLCBzbGlnaHQgaW5jcmVhc2UgaW4gcmFuZG9tIGRhbWFnZS4gKi9cblxuXG5Bcm1vcnkuV2Vha25lc3MgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBcIkZpbmQgV2Vha25lc3NcIjtcblxuICAgIHRoaXMubmFub0NoZWNrICs9IDA7XG4gICAgdGhpcy5oZWFsdGhCb251cyArPSAwO1xuICAgIHRoaXMuZGFtYWdlQm9udXMgKz0gNDtcbiAgICB0aGlzLmV2YXNpb25Cb251cyArPSAwO1xuICAgIHRoaXMuc2hpZWxkQm9udXMgKz0gMDtcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5Bcm1vcnkuV2Vha25lc3MucHJvdG90eXBlID0gbmV3IEFybW9yeS5Nb2RpZmljYXRpb24oKTtcblxuXG4vKiBVcGRhdGVkIEZpcm13YXJlIHJlc29sdmVzIGEgYnVnIHdoaWNoIHdlYWtlbmVkIHRoZSByb2JvdCdzIGF0dGFjayBhbnRpY2lwYXRpb24gY2FsY3VsYXRpb25zLCBpbmNyZWFzZXMgXG4gICBSb2JvdCdzIGV2YXNpb24gdG90YWwgc2xpZ2h0bHksIG1pbm9yIGhlYWx0aC4gKi9cblxuXG5Bcm1vcnkuRmlybXdhcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZE5hbWUgPSBcIlVwZGF0ZWQgRmlybXdhcmVcIjtcblxuICAgIHRoaXMubmFub0NoZWNrICs9IDA7XG4gICAgdGhpcy5oZWFsdGhCb251cyArPSAxMDtcbiAgICB0aGlzLmRhbWFnZUJvbnVzICs9IDA7XG4gICAgdGhpcy5ldmFzaW9uQm9udXMgKz0gNTtcbiAgICB0aGlzLnNoaWVsZEJvbnVzICs9IDA7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuQXJtb3J5LkZpcm13YXJlLnByb3RvdHlwZSA9IG5ldyBBcm1vcnkuTW9kaWZpY2F0aW9uKCk7XG5cblxuLyogRW5oYW5jZSBTaGllbGRzIGdyYW50cyB0aGUgUm9ib3QgYSBzaGllbGQgYXQgdGhlIGJlZ2lubmluZyBvZiBjb21iYXQsIG1pbm9yIGV2YXNpb24uICovXG5cblxuQXJtb3J5LkVuaFNoaWVsZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubW9kTmFtZSA9IFwiRW5oYW5jZWQgU2hpZWxkaW5nXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAwO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gMDtcbiAgICB0aGlzLmRhbWFnZUJvbnVzICs9IDA7XG4gICAgdGhpcy5ldmFzaW9uQm9udXMgKz0gMztcbiAgICB0aGlzLnNoaWVsZEJvbnVzICs9IDI1O1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMDtcbn07XG5cbkFybW9yeS5FbmhTaGllbGQucHJvdG90eXBlID0gbmV3IEFybW9yeS5Nb2RpZmljYXRpb24oKTtcblxuXG4vKiBFbXBhdGh5IFZpcnVzIHNsb3dseSBjYXVzZXMgdGhlIG9wcG9uZW50J3MgUm9ib3QgdG8gbG9zZSB1cmdlIHRvIGZpZ2h0LCBldmVudHVhbGx5IHN0b3BwaW5nIGZvciBhIHJvdW5kLCBtaW5vciBzaGllbGQuICAqL1xuXG5cbkFybW9yeS5FbXBhdGh5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2ROYW1lID0gXCJFbXBhdGh5IFZpcnVzXCI7XG5cbiAgICB0aGlzLm5hbm9DaGVjayArPSAwO1xuICAgIHRoaXMuaGVhbHRoQm9udXMgKz0gMDtcbiAgICB0aGlzLmRhbWFnZUJvbnVzICs9IDA7XG4gICAgdGhpcy5ldmFzaW9uQm9udXMgKz0gMDtcbiAgICB0aGlzLnNoaWVsZEJvbnVzICs9IDU7XG4gICAgdGhpcy5lbXBDaGVjayArPSAxO1xufTtcblxuQXJtb3J5LkVtcGF0aHkucHJvdG90eXBlID0gbmV3IEFybW9yeS5Nb2RpZmljYXRpb24oKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJtb3J5XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgd2VhcG9ucyA9IHJlcXVpcmUoJy4vd2VhcG9ucy5qcycpO1xubGV0IG1vZHMgPSByZXF1aXJlKCcuL21vZHMuanMnKTtcblxubGV0IFJvYm90ID0ge307XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyAgICBCYXNlIFJvYm90ICAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5Sb2JvdC5QbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnR5cGUgPSBudWxsO1xuICAgIHRoaXMubW9kZWwgPSBudWxsO1xuICAgIHRoaXMubW9kcyA9IG51bGw7XG4gICAgdGhpcy5taW5EYW1hZ2UgPSAwO1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlID0gMDtcblxuICAgIHRoaXMud2VhcG9uID0gXCJFbXB0eSBIb2xzdGVyXCI7XG4gICAgdGhpcy5uYW1lID0gXCJNYWxmdW5jdGlvbmluZyBTY3JhcGJvdFwiO1xuXG4gICAgdGhpcy5oZWFsdGggPSA3MDtcbiAgICB0aGlzLnNoaWVsZCA9IDA7XG4gICAgdGhpcy5ldmFzaW9uID0gMDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICAgICAgICBUeXBlcyAgICAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8qIERyb25lcyBzZXJ2ZSB0aGUgXCJBZ2lsaXR5XCIgdHlwZSByb2xlIGluIHRoaXMgdmVyc2lvbiBvZiBSb2JvdCBCYXR0bGVkb21lLiBTbGlnaHRseSBsb3dlciBiYXNlIGhlYWx0aCwgYnV0IGhlaWdodGVuZWRcbiAgIGFiaWxpdHkgdG8gYXZvaWQgb3Bwb25lbnQgYXR0YWNrcy4gKi9cblxuXG5Sb2JvdC5Ecm9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHlwZSA9IFwiRHJvbmVcIjtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gMjA7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5zaGllbGRCb251cyA9IDA7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gMTA7XG59O1xuXG5Sb2JvdC5Ecm9uZS5wcm90b3R5cGUgPSBuZXcgUm9ib3QuUGxheWVyKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICAgRHJvbmUgTW9kZWxzICAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblJvYm90LlNoYWRvd1N0cmlrZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAzMDtcbiAgICB0aGlzLm1vZGVsID0gXCJTaGFkb3dTdHJpa2VcIjtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSAxNTtcbn07XG5cblJvYm90LlNoYWRvd1N0cmlrZS5wcm90b3R5cGUgPSBuZXcgUm9ib3QuRHJvbmUoKTtcblxuUm9ib3QuTGl0dGxlQml0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWx0aEJvbnVzID0gNDA7XG4gICAgdGhpcy5tb2RlbCA9IFwiTGl0dGxlQml0ZXJcIjtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSAxMDtcbn07XG5cblJvYm90LkxpdHRsZUJpdGVyLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5Ecm9uZSgpO1xuXG5Sb2JvdC5CdWxsZXRTaG9vdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDIwO1xuICAgIHRoaXMubW9kZWwgPSBcIkJ1bGxldFNob290ZXJcIjtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSAyMDtcbn07XG5cblJvYm90LkJ1bGxldFNob290ZXIucHJvdG90eXBlID0gbmV3IFJvYm90LkRyb25lKCk7XG5cblxuLyogVGFua2JvdHMgaGF2ZSBzbGlnaHRseSBoaWdoZXIgaGVhbHRoIHRoYW4gdGhlIG90aGVyIHR3byB0eXBlcy4gTm8gQm9udXMgdG8gZXZhc2lvbiAoZXhlY3B0IHRvYm9yKVxuICBzaW5jZSB0aGV5IGhhdmUgaGVhdmllciBhbmQgc3R1cmRpZXIgZnJhbWVzIHRoYW4gb3RoZXIgdHlwZXMuICovXG5cblxuUm9ib3QuVGFua2JvdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHlwZSA9IFwiVGFua2JvdFwiO1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSA1MDtcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnNoaWVsZEJvbnVzID0gMDtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSAwO1xufTtcblxuUm9ib3QuVGFua2JvdC5wcm90b3R5cGUgPSBuZXcgUm9ib3QuUGxheWVyKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICBUYW5rYm90IE1vZGVscyAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblJvYm90LlRvYm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDMwO1xuICAgIHRoaXMubW9kZWwgPSBcIlQuTy5CLk8uUi5cIjtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSA3O1xufTtcblxuUm9ib3QuVG9ib3IucHJvdG90eXBlID0gbmV3IFJvYm90LlRhbmtib3QoKTtcblxuUm9ib3QuUm9ja0JvdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSA0MDtcbiAgICB0aGlzLm1vZGVsID0gXCJSb2NrQm90XCI7XG4gICAgdGhpcy5zaGllbGQgKz0gdGhpcy5zaGllbGRCb251cyA9IDI1O1xufTtcblxuUm9ib3QuUm9ja0JvdC5wcm90b3R5cGUgPSBuZXcgUm9ib3QuVGFua2JvdCgpO1xuXG5Sb2JvdC5UYW5rYm90UGx1cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAyNTtcbiAgICB0aGlzLm1vZGVsID0gXCJUYW5rYm90UGx1c1wiO1xuICAgIHRoaXMuc2hpZWxkICs9IHRoaXMuc2hpZWxkQm9udXMgPSAzNTtcbn07XG5cblJvYm90LlRhbmtib3RQbHVzLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5UYW5rYm90KCk7XG5cblxuLyogUHN5Ym90cyB3aWxsIGhhdmUgc3Ryb25nZXIgc2hpZWxkcy5TbGlnaHQgYm9udXMgdG8gZXZhZGluZyBhdHRhY2tzIGJhc2VkIG9uIHRoZWlyXG4gYWJpbGl0eSB0byBjYWxjdWxhdGUgb3Bwb25lbnRzIG5leHQgbW92ZS4gKi9cblxuXG5Sb2JvdC5Qc3lib3QgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnR5cGUgPSBcIlBzeWJvdFwiO1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMuaGVhbHRoQm9udXMgPSAxMDtcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnNoaWVsZEJvbnVzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSArIDIwKTtcbiAgICB0aGlzLmV2YXNpb24gKz0gdGhpcy5ldmFzaW9uQm9udXMgPSAxMDtcbn07XG5cblJvYm90LlBzeWJvdC5wcm90b3R5cGUgPSBuZXcgUm9ib3QuUGxheWVyKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICAgUHN5Ym90IE1vZGVscyAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblJvYm90Lk1pbmRtZWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLmhlYWx0aEJvbnVzID0gMjU7XG4gICAgdGhpcy5tb2RlbCA9IFwiTWluZG1lbHRlclwiO1xuICAgIHRoaXMuc2hpZWxkICs9IHRoaXMuc2hpZWxkQm9udXMgPSAzMDtcbn07XG5cblJvYm90Lk1pbmRtZWx0ZXIucHJvdG90eXBlID0gbmV3IFJvYm90LlBzeWJvdCgpO1xuXG5Sb2JvdC5CcmFpbnN0b3JtID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDE1O1xuICAgIHRoaXMubW9kZWwgPSBcIkJyYWluc3Rvcm1cIjtcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnNoaWVsZEJvbnVzID0gMjU7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMuZXZhc2lvbkJvbnVzID0gNTtcbn07XG5cblJvYm90LkJyYWluc3Rvcm0ucHJvdG90eXBlID0gbmV3IFJvYm90LlBzeWJvdCgpO1xuXG5Sb2JvdC5CYW5zaGVlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5oZWFsdGhCb251cyA9IDEwO1xuICAgIHRoaXMubW9kZWwgPSBcIkJhbnNoZWVcIjtcbiAgICB0aGlzLmhlYWx0aCArPSB0aGlzLnNoaWVsZEJvbnVzID0gNTU7XG59O1xuXG5Sb2JvdC5CYW5zaGVlLnByb3RvdHlwZSA9IG5ldyBSb2JvdC5Qc3lib3QoKTtcblxuXG4vKiBGdW5jdGlvbnMgZm9yIHNldHRpbmcgd2VhcG9ucywgbW9kaWZpY2F0aW9ucywgdHlwZXMsIGFuZCBtb2RlbHMgdG8gcm9ib3QgcGxheWVycyAqL1xuXG5Sb2JvdC5QbGF5ZXIucHJvdG90eXBlLnNldFdlYXBvbiA9IGZ1bmN0aW9uKG5ld1dlYXBvbikge1xuICAgIHRoaXMud2VhcG9uID0gbmV3V2VhcG9uO1xuXG4gICAgdGhpcy5lbXBDaGVjayA9IG5ld1dlYXBvbi5lbXBDaGVjaztcbiAgICB0aGlzLm1pbkRhbWFnZSA9IG5ld1dlYXBvbi5taW5EYW1hZ2U7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgPSBuZXdXZWFwb24uYWRkaXRpb25hbERhbWFnZVJhbmdlO1xufTtcblxuUm9ib3QuUGxheWVyLnByb3RvdHlwZS5zZXRNb2QgPSBmdW5jdGlvbihuZXdNb2QpIHtcbiAgICB0aGlzLm1vZHMgPSBuZXdNb2Q7XG5cbiAgICB0aGlzLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSArPSBuZXdNb2QuZGFtYWdlQm9udXM7XG4gICAgdGhpcy5oZWFsdGggKz0gbmV3TW9kLmhlYWx0aEJvbnVzO1xuICAgIHRoaXMubmFub0NoZWNrID0gbmV3TW9kLm5hbm9DaGVjaztcbiAgICB0aGlzLmV2YXNpb24gKz0gbmV3TW9kLmV2YXNpb25Cb251cztcbiAgICB0aGlzLnNoaWVsZCArPSBuZXdNb2Quc2hpZWxkQm9udXM7XG4gICAgdGhpcy5lbXBDaGVjayArPSBuZXdNb2QuZW1wQ2hlY2s7XG59O1xuXG5Sb2JvdC5QbGF5ZXIucHJvdG90eXBlLnNldFR5cGUgPSBmdW5jdGlvbihuZXdUeXBlKSB7XG4gICAgdGhpcy50eXBlID0gbmV3IFJvYm90W25ld1R5cGVdO1xuICAgIHRoaXMuaGVhbHRoICs9IHRoaXMudHlwZS5oZWFsdGhCb251cztcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLnR5cGUuc2hpZWxkQm9udXM7XG4gICAgdGhpcy5ldmFzaW9uICs9IHRoaXMudHlwZS5ldmFzaW9uQm9udXM7XG5cbiAgICByZXR1cm4gdGhpcy50eXBlO1xufTtcblxuUm9ib3QuUGxheWVyLnByb3RvdHlwZS5zZXRNb2RlbCA9IGZ1bmN0aW9uKG5ld01vZGVsKSB7XG4gICAgdGhpcy5tb2RlbCA9IG5ldyBSb2JvdFtuZXdNb2RlbF07XG4gICAgdGhpcy5oZWFsdGggKz0gdGhpcy5tb2RlbC5oZWFsdGhCb251cztcbiAgICB0aGlzLnNoaWVsZCArPSB0aGlzLm1vZGVsLnNoaWVsZEJvbnVzO1xuICAgIHRoaXMuZXZhc2lvbiArPSB0aGlzLm1vZGVsLmV2YXNpb25Cb251cztcblxuICAgIHJldHVybiB0aGlzLm1vZGVsO1xufTtcblxuXG5sZXQgUGxheWVyT25lID0gbmV3IFJvYm90LlBsYXllcigpO1xuUGxheWVyT25lLm5hbWUgPSBcIlBsYXllciBPbmVcIjtcbmxldCBQbGF5ZXJUd28gPSBuZXcgUm9ib3QuUGxheWVyKCk7XG5QbGF5ZXJUd28ubmFtZSA9IFwiUGxheWVyIFR3b1wiO1xuXG5cbmNvbnNvbGUubG9nKFBsYXllck9uZS5oZWFsdGgpO1xuY29uc29sZS5sb2coUGxheWVyVHdvKTtcbmNvbnNvbGUubG9nKFBsYXllck9uZSk7XG5cbi8qIEV4cG9ydCB0aGlzIGJ1c2luZXNzICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFJvYm90LFxuICAgIFBsYXllck9uZSxcbiAgICBQbGF5ZXJUd29cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCByb2JvdHMgPSByZXF1aXJlKCcuL3JvYm90cy5qcycpO1xubGV0IHdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMuanMnKTtcbmxldCBtb2RzID0gcmVxdWlyZSgnLi9tb2RzLmpzJyk7XG5sZXQgY29tYmF0ID0gcmVxdWlyZSgnLi9jb21iYXQuanMnKTtcblxuLyogZnVuY3Rpb24gZm9yIGNyZWF0aW5nIHRoZSBzdHJpbmcgdGhhdCBpcyBhcHBlbmRlZCB3aGVuIHBsYXllciBpcyBoZWFsZWQgZnJvbSB0aGVpciBuYW5vYm90IG1vZC5cbnJlbW92ZXMgbGluZXMgb2YgdGV4dCBhcyBtb3JlIGFyZSBhZGRlZCB0byB0aGUgY29tYmF0IHRleHQgY29udGFpbmVyLiAqL1xuXG5sZXQgcm9ib3ROYW5vYm90SGVhbFN0cmluZyA9IChwbGF5ZXIsIG5hbm9IZWFsKSA9PiB7XG4gICAgbGV0IG5hbm9TdHJpbmcgPSBgPGg1PiR7cGxheWVyLm5hbWV9IGlzIHJlcGFpcmVkIGZvciAke25hbm9IZWFsKCl9IGhlYWx0aCBieSB0aGVpciBuYW5vYm90cyFgO1xuICAgIGlmICgkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCkubGVuZ3RoID4gNykge1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCdoNTpmaXJzdCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICAkKCcjY29tYmF0VGV4dCcpLmFwcGVuZChuYW5vU3RyaW5nKTtcbn07XG5cbi8qIGZ1bmN0aW9uIGZvciBjcmVhdGluZyB0aGUgc3RyaW5nIHRoYXQgaXMgYXBwZW5kZWQgd2hlbiBvZmZlbnNpdmUgcGxheWVyIGF0dGFja3MgYSByb2JvdCB3aXRoIHRoZSBlbXBhdGh5XG52aXJ1cyBtb2RpZmljYXRpb24uIHJlbW92ZXMgZWxlbWVudHMgdG8ga2VlcCBjb21iYXQgdGV4dCBjb250YWluZXIgZnJvbSBiZWluZyB0b28gYmxvYXRlZCB3aXRoIHRleHQuICovXG5cbmxldCByb2JvdEVtcGF0aHlTdHJpbmcgPSAob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIpID0+IHtcbiAgICBsZXQgZW1wYXRoeVN0cmluZyA9IGA8aDU+JHtvZmZlbnNpdmVQbGF5ZXIubmFtZX0gaHVncyAke2RlZmVuc2l2ZVBsYXllci5uYW1lfSBpbnN0ZWFkIG9mIGF0dGFja2luZyEgR3Jvc3MhPC9oNT5gO1xuICAgIGlmICgkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCkubGVuZ3RoID4gNykge1xuICAgICAgICAkKCcjY29tYmF0VGV4dCcpLmNoaWxkcmVuKCdoNTpmaXJzdCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICAkKCcjY29tYmF0VGV4dCcpLmFwcGVuZChlbXBhdGh5U3RyaW5nKTtcbn07XG5cbi8qIHN0cmluZyB0aGF0IGlzIGFwcGVuZGVkIHdoZW5ldmVyIGEgcGxheWVyIGRvZGdlcyBhbiBvcHBvbmVudCdzIGF0dGFjay4gKi9cblxubGV0IHJvYm90RG9kZ2VTdHJpbmcgPSAob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIpID0+IHtcbiAgICBsZXQgZG9kZ2VTdHJpbmcgPSBgPGg1PiR7b2ZmZW5zaXZlUGxheWVyLm5hbWV9IGF0dGFja3MsIGJ1dCAke2RlZmVuc2l2ZVBsYXllci5uYW1lfSBzd2lmdGx5IGRvZGdlcyE8L2g1PmA7XG4gICAgaWYgKCQoJyNjb21iYXRUZXh0JykuY2hpbGRyZW4oKS5sZW5ndGggPiA3KSB7XG4gICAgICAgICQoJyNjb21iYXRUZXh0JykuY2hpbGRyZW4oJ2g1OmZpcnN0JykucmVtb3ZlKCk7XG4gICAgfVxuICAgICQoJyNjb21iYXRUZXh0JykuYXBwZW5kKGRvZGdlU3RyaW5nKTtcbn07XG5cbi8qIGNyZWF0ZXMgdGV4dCB0aGF0IGlzIGRpc3BsYXllZCBpbiBiYXR0bGVkb21lIHZpZXcgZm9yIHNob3dpbmcgZWFjaCByb2JvdCdzIHN0YXRzLiAqL1xuXG5sZXQgcm9ib3RUb0NhcmQgPSAocGxheWVyLCBwbGF5ZXJFbGVtZW50KSA9PiB7XG4gICAgbGV0IHBsYXllclN0cmluZyA9IFwiXCI7XG4gICAgcGxheWVyU3RyaW5nICs9IGA8aDE+JHtwbGF5ZXIubmFtZX08L2gxPmA7XG4gICAgcGxheWVyU3RyaW5nICs9IGA8aDQ+SGVhbHRoOiAke3BsYXllci5oZWFsdGh9PC9oND5gO1xuICAgIHBsYXllclN0cmluZyArPSBgPGg0PlNoaWVsZDogJHtwbGF5ZXIuc2hpZWxkfTwvaDQ+YDtcbiAgICBwbGF5ZXJTdHJpbmcgKz0gYDxoND5UeXBlOiAke3BsYXllci50eXBlLnR5cGV9PC9oND5gO1xuICAgIHBsYXllclN0cmluZyArPSBgPGg0Pk1vZGVsOiAke3BsYXllci5tb2RlbC5tb2RlbH08L2g0PmA7XG4gICAgJChwbGF5ZXJFbGVtZW50KS5odG1sKGAke3BsYXllclN0cmluZ31gKTtcbn07XG5cbi8qIGNyZWF0ZXMgYmFzZSBjb21iYXQgc3RyaW5nIHdoZW4gYXR0YWNrcyBhcmUgc3VjY2Vzc2Z1bCBhZ2FpbnN0IGVuZW15IHJvYm90cy4gKi9cblxubGV0IHJvYm90c0NvbWJhdFRleHQgPSAob2ZmZW5zaXZlUGxheWVyLCBkZWZlbnNpdmVQbGF5ZXIsIGRhbWFnZSkgPT4ge1xuXG4gICAgaWYgKCQoJyNjb21iYXRUZXh0JykuY2hpbGRyZW4oKS5sZW5ndGggPiA3KSB7XG4gICAgICAgICQoJyNjb21iYXRUZXh0JykuY2hpbGRyZW4oJ2g1OmZpcnN0JykucmVtb3ZlKCk7XG4gICAgfVxuICAgICQoJyNjb21iYXRUZXh0JykuYXBwZW5kKGA8aDU+JHtvZmZlbnNpdmVQbGF5ZXIubmFtZX0gYXR0YWNrcyAke2RlZmVuc2l2ZVBsYXllci5uYW1lfSB3aXRoIGEgJHtvZmZlbnNpdmVQbGF5ZXIud2VhcG9uLndlcE5hbWV9IGZvciAke2RhbWFnZX0gZGFtYWdlITwvaDU+YCk7XG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcm9ib3ROYW5vYm90SGVhbFN0cmluZyxcbiAgICByb2JvdEVtcGF0aHlTdHJpbmcsXG4gICAgcm9ib3RUb0NhcmQsXG4gICAgcm9ib3RzQ29tYmF0VGV4dCxcbiAgICByb2JvdERvZGdlU3RyaW5nXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgV2VhcG9uQ2FjaGUgPSB7fTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICAgICBCYXNlIFdlYXBvbiAgIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbldlYXBvbkNhY2hlLldlYXBvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2VwTmFtZSA9IG51bGw7XG4gICAgdGhpcy5taW5EYW1hZ2UgPSAwO1xuICAgIHRoaXMuYWRkaXRpb25hbERhbWFnZVJhbmdlID0gMDtcbiAgICB0aGlzLmVtcENoZWNrID0gMDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICBNb2RpZmllZCBXZWFwb25zIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8qIEVNUCBSaWZsZSBoYXMgbWVkaXVtIGxvdyBlbmQsIGxhcmdlciByYW5kb20gcmFuZ2UgdGhhbiBtb3N0IG90aGVyIHdlYXBvbnMuICovXG5cblxuV2VhcG9uQ2FjaGUuRW1wUmlmbGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndlcE5hbWUgPSBcIkUuTS5QLiBSaWZsZVwiO1xuICAgIHRoaXMubWluRGFtYWdlICs9IDk7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMTA7XG4gICAgdGhpcy5lbXBDaGVjayArPSAwO1xufTtcblxuV2VhcG9uQ2FjaGUuRW1wUmlmbGUucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5cbi8qIE1lZ2F6YXBwZXIgaXMgYSBmYWlybHkgc3RyYWlnaHQtZm9yd2FyZCB3ZWFwb24uIFNtYWxsZXIgcmFuZ2UgaW4gcmFuZG9tbmVzcywgYnV0IGdpdmVzIHVwIGhpZ2hlc3RcbiAgIHBvc3NpYmxlIHRvcC1lbmQgZm9yIGNvbnNpc3RlbmN5LiAqL1xuXG5cbldlYXBvbkNhY2hlLk1lZ2F6YXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndlcE5hbWUgPSBcIk1lZ2FaYXBwZXJcIjtcbiAgICB0aGlzLm1pbkRhbWFnZSArPSAxMjtcbiAgICB0aGlzLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSArPSAzO1xuICAgIHRoaXMuZW1wQ2hlY2sgKz0gMDtcbn07XG5cbldlYXBvbkNhY2hlLk1lZ2F6YXBwZXIucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5cbi8qIENoYW9zIEdyZW5hZGUgaGFzIHRoZSBoaWdoZXN0IHRvcC1lbmQgZm9yIGRhbWFnZSwgYnV0IGNvdWxkIGFsc28gbGVhdmUgeW91IGhpdHRpbmcgbGlrZSBhIHdldCBub29kbGUuXG4gICBJZiB0aW1lIHBlcm1pdHMsIHdpbGwgdHdlYWsgdGhlIGRhbWFnZSBudW1iZXJzIHRvIGNvbWUgdXAgd2l0aCBzb21ldGhpbmcgYmFsYW5jZWQuICovXG5cblxuV2VhcG9uQ2FjaGUuQ2hhb3NHcmVuYWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53ZXBOYW1lID0gXCJDaGFvcyBHcmVuYWRlXCI7XG4gICAgdGhpcy5taW5EYW1hZ2UgKz0gMTtcbiAgICB0aGlzLmFkZGl0aW9uYWxEYW1hZ2VSYW5nZSArPSAyNDtcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5XZWFwb25DYWNoZS5DaGFvc0dyZW5hZGUucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5cbi8qIE11cmRlciBLbmlmZSBpcyBhIHBsYWNlIGhvbGRlciB3ZWFwb24uICovXG5cbldlYXBvbkNhY2hlLk11cmRlcktuaWZlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53ZXBOYW1lID0gXCJNdXJkZXJLbmlmZVwiO1xuICAgIHRoaXMubWluRGFtYWdlICs9IDk7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMztcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5XZWFwb25DYWNoZS5NdXJkZXJLbmlmZS5wcm90b3R5cGUgPSBuZXcgV2VhcG9uQ2FjaGUuV2VhcG9uKCk7XG5cblxuLyogTWljcm8gV2F2ZSBpcyBhIHBsYWNlIGhvbGRlciB3ZWFwb24uICovXG5cblxuV2VhcG9uQ2FjaGUuTWljcm9XYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53ZXBOYW1lID0gXCJNaWNybyBXYXZlXCI7XG4gICAgdGhpcy5taW5EYW1hZ2UgKz0gMTE7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMTtcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5XZWFwb25DYWNoZS5NaWNyb1dhdmUucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5cbi8qIFBsYXN0aWMgU3BvcmsgaXMgYSBwbGFjZSBob2xkZXIgd2VhcG9uLiAqL1xuXG5cbldlYXBvbkNhY2hlLlBsYXN0aWNTcG9yayA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2VwTmFtZSA9IFwiUGxhc3RpYyBTcG9ya1wiO1xuICAgIHRoaXMubWluRGFtYWdlICs9IDM7XG4gICAgdGhpcy5hZGRpdGlvbmFsRGFtYWdlUmFuZ2UgKz0gMztcbiAgICB0aGlzLmVtcENoZWNrICs9IDA7XG59O1xuXG5XZWFwb25DYWNoZS5QbGFzdGljU3BvcmsucHJvdG90eXBlID0gbmV3IFdlYXBvbkNhY2hlLldlYXBvbigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBXZWFwb25DYWNoZVxufTsiXX0=
