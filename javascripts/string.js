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