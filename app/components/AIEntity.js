import Robot from './RobotEntity.js';

function AI (config) {
  this.status = "normal";
  this.deepOfAccelerator = 0; //油门深度
  this.tick = 0;

  this.circumstanceDetection = (function (self) {
    return function (front, back) {
      return config.circumstanceDetection(self, front, back);
    }
  })(this);

  this.distance = config.distance;

  this.character = config.character;
  this.robot = new Robot(config.robot);
}

AI.prototype.getOffsetX = function () {
  return this.robot.getOffsetX();
}

AI.prototype.getOffsetY = function () {
  return this.robot.getOffsetY();
}

AI.prototype.crash = function () {
  this.status = "crash";
};

AI.prototype.update = function () {
  this.tick += 1;

  var fd = this.circumstanceDetection(100, 100);

  // if (this.deepOfAccelerator < 80 && this.tick % 4 === 0) {
  //   this.deepOfAccelerator += 10;
  //
  //   if (this.deepOfAccelerator > 100) {
  //     this.deepOfAccelerator = 100;
  //   }
  // }
  var sents = {
    escape: ['赶紧赶紧...', '该死，怎么会在后面！', '我去！这哥们不会看上我了吧？']
  };

  if (fd.left) {
    if (this.status === "normal") { //进入警戒状态
      console.log('啊~~，加速加速，有人在追我...');
      this.status = "escape";
      this.deepOfAccelerator = 100;
    } else {
      if (this.tick % 30 === 0) { //持续警戒状态
        console.log(sents.escape[~~(Math.random() * 3)]);
      }
    }
  } else {
    if (this.status === "escape") { //退出警戒状态
      console.log('呼~~，甩开了，可以安心开车了...');
      this.status = "normal";
      this.deepOfAccelerator = 50;
    } else { /* 保持当前状态 */ }
  }

  this.robot.setDeepOfAccelerator(this.deepOfAccelerator);
  this.robot.update();

  if (this.robot.translateX >= this.distance) {
    this.status = "arrived";
    console.log("tick: " + this.tick);
  }
};

module.exports = AI;
