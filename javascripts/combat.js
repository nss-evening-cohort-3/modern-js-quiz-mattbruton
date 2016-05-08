"use strict";
let robots = require('./robots.js');
let weapons = require('./weapons.js');
let mods = require('./mods.js');
let string = require('./string.js');

let disableCount = 0;

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


let attack = (offensivePlayer, defensivePlayer) => {

    let dmgNumber = damage(offensivePlayer);

    if (evasion(defensivePlayer) === true) {
        string.robotDodgeString(offensivePlayer, defensivePlayer);
    } else if (defensivePlayer.shield > 0) {
        defensivePlayer.shield -= dmgNumber;
        string.robotsCombatText(offensivePlayer, defensivePlayer, dmgNumber);
    } else {
        defensivePlayer.health -= dmgNumber;
        string.robotsCombatText(offensivePlayer, defensivePlayer, dmgNumber);
    }
};


let evasion = (player) => {
    let evasionCheck = false;
    if (player.evasion >= Math.floor(Math.random() * 100)) {
        evasionCheck = true;
    }

    return evasionCheck;
};


let victoryCheck = (firstPlayer, secondPlayer) => {
    let victoryString = "";

    if (firstPlayer.health <= 0 && secondPlayer.health <= 0) {
        victoryString += "Both bots are scrapped!";
        $('#combatText').html(`${victoryString}`);
    } else if (firstPlayer.health <= 0) {
        victoryString += `${secondPlayer.name} has defeated ${firstPlayer.name}!`;
        $('#combatText').html(`${victoryString}`);
    } else if (secondPlayer.health <= 0) {
        victoryString += `${firstPlayer.name} has defeated ${secondPlayer.name}!`;
        $('#combatText').html(`${victoryString}`);
    }

};


module.exports = {
    damage,
    attack,
    evasion,
    victoryCheck,
    shieldCheck
};