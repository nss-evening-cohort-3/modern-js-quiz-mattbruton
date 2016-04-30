"use strict";

let Robot = {};

Robot.Player = function(name) {
  this.type = null;
  this.model = null;
  this.weapon = null;
  this.name = name || "Malfunctioning Scrapbot";
  this.health = Math.floor(Math.random() * 15 + 60);
  this.shield = 0;
  this.dmgInc = 0;
  this.evasion = 0;
};

  ///////////////////////
 //        Types      //
///////////////////////

/* Drones serve the "Agility" type role in this version of Robot Battledome. Slightly lower base health, but heightened
   ability to avoid opponent attacks. They will also have the ability to do more damage as the rounds go on, exploiting
   flaws in their opponent's frame. */

Robot.Drone = function() {
  this.health -= 10;
  this.type = "Drone";
  this.evasion += 10;
};

Robot.Drone.prototype = new Robot.Player();

/* Tankbots have slightly higher health than the other two types. No Bonus to evasion since they have heavier and 
   sturdier frames than other types. */

Robot.Tankbot = function() {
  this.health += 10;
  this.type = "Tankbot";
};

Robot.Tankbot.prototype = new Robot.Player();

/* Psybots will have stronger shields, take more damage as rounds increase due to their more fragile frames.
   Slight bonus to evading attacks based on their ability to calculate opponents next move. */

Robot.Psybot = function() {
  this.health -= 5;
  this.type = "Psybot";
  this.evasion += 5;
};

Robot.Psybot.prototype = new Robot.Player();


  ///////////////////////
 //   Drone Models    //
///////////////////////






let TestBot = new Robot.Tankbot();


let testLink = () => console.log(TestBot);

module.exports = {
  Robot,
  TestBot,
  testLink
};
