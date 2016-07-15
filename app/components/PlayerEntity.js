function Player (config) {
  this.status = "normal";
  this.deepOfAccelerator = 0; //油门深度
  this.tick = 0;

  this.distance = config.distance;

  this.character = config.character;
  this.robot = new Robot(config.robot);
}

Player.prototype.crash = function () {
  this.status = "crash";
};

Player.prototype.update = function () {
  this.tick += 1;

  if (this.deepOfAccelerator < 80 && this.tick % 4 === 0) {
    this.deepOfAccelerator += 10;

    if (this.deepOfAccelerator > 100) {
      this.deepOfAccelerator = 100;
    }
  }

  this.robot.setDeepOfAccelerator(this.deepOfAccelerator);
  this.robot.update();

  if (this.robot.translateX >= this.distance) {
    this.status = "arrived";
    console.log("tick: " + this.tick);
  }
};

module.exports = Player;
