"use strict";
let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let string = require('./string.js');


let nanobotCheck = (player) => {
  let nanoChecker = false;
  if (player.nanoCheck > 0) {
    nanoChecker = true;
  }
  return nanoChecker;
};

let nanoHeal = () => {
  let nanoHealAmount = Math.floor(Math.random() * 5);
  
  return nanoHealAmount;
};

let damage = (player) => {
    let totalDamage = 0;
    totalDamage += player.minDamage;
    totalDamage += Math.floor(Math.random() * player.additionalDamageRange);
    return totalDamage;
};

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
    }
      else if (evasion(defensivePlayer) === true) {
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