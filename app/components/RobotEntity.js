import Ball from './BallEntity';

function RobotEntity (config) {
  this.status = "normal";

  this.maxSpeed    = config.maxSpeed;    //最大速度 px/s
  this.maxSpeedUp  = config.maxSpeedUp;  //最大加速度
  this.speedCut    = config.speedCut;    //匀减速
  this.maxSpeedCut = config.maxSpeedCut; //最大制动力

  this.currentSpeed   = config.currentSpeed || 0; //当前速度
  this.currentSpeedUp = 0; //当前加速度

  this.translateX = config.x;
  this.translateY = config.y;

  var tracks = this.tracks = config.tracks; //车道总数

  this.trackHeight = 60;

  if (tracks === 4) {
    this.trackHeight = 45;
  } else if (tracks === 5) {
    this.trackHeight = 36;
  } else if (tracks === 6) {
    this.trackHeight = 30;
  } else {
    this.trackHeight = 60;
  }

  this.Ball = new Ball(config.color, config.x, this.calcOffsetY());
}

/* 计算Y轴偏移量 */
RobotEntity.prototype.calcOffsetY = function () {
  return 45 + this.translateY * this.trackHeight;
};

/* 设置加速度和当前最大速度 */
RobotEntity.prototype.setDeepOfAccelerator = function (deepOfAccelerator) {
  var _deepOfAccelerator = deepOfAccelerator / 100;

  if (_deepOfAccelerator > 0) {
    this.controlledSpeed = this.maxSpeed   * _deepOfAccelerator;
    this.currentSpeedUp  = this.maxSpeedUp * _deepOfAccelerator;
  } else if (_deepOfAccelerator < 0) {
    this.currentSpeedUp = this.maxSpeedCut * _deepOfAccelerator;
  } else {
    this.currentSpeedUp = 0 - this.speedCut;
  }
};

/* 变道 */
RobotEntity.prototype.setTranslateY = function (offset) {
  this.translateY += offset;

  if (this.translateY < 0) {
    this.translateY = 0;
  } else if (this.translateY > this.tracks - 1) {
    this.translateY = this.tracks - 1;
  } else { /* 正常变道 */ }

  this.Ball.setOffsetY(this.calcOffsetY());
};

RobotEntity.prototype.getOffsetX = function () {
  return this.translateX;
}

RobotEntity.prototype.getOffsetY = function () {
  return this.translateY;
}

/* 熄火 */
RobotEntity.prototype.crash = function () {
  this.status = "crash";
};

/* 前进 */
RobotEntity.prototype.update = function () {
  //加速或趟车
  if (this.currentSpeedUp > 0) {
    if (this.currentSpeed < this.controlledSpeed) { //加速中
      this.currentSpeed += this.currentSpeedUp / 60;

      if (this.currentSpeed > this.controlledSpeed) {
        this.currentSpeed = this.controlledSpeed;
      }
    } else {
      this.currentSpeed -= this.speedCut / 60;
    }
  } else { //刹车
    this.currentSpeed += this.currentSpeedUp / 60;

    if (this.currentSpeed < 0) {
      this.currentSpeed = 0;
    }
  }

  this.translateX += this.currentSpeed / 60;

  this.Ball.setOffsetX(this.translateX);
};

module.exports = RobotEntity;
