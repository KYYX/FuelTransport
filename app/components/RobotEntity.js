import Ball from './BallEntity';

// const SIZE = [0, 16, 22.6, 27,7, 32, 35.8];
// const HURT = [0, 5, 4, 3, 2];

function RobotEntity (config) {
  this.status = "normal";

  this.config = config;
  this.power  = 0; //当前动力
  this.speed  = 0;

  this.translateX = config.x;
  this.translateY = config.y;

  this.tracks = config.tracks; //车道总数
  this.height = 180 / this.tracks;
  this.width  = 24; //SIZE[config.level];
  // this.level  = config.level;
  // this.durability = config.durability2;

  this.Ball = new Ball(config.color, config.level, config.x, this.calcOffsetY());
}

/* 计算Y轴偏移量 */
RobotEntity.prototype.calcOffsetY = function () {
  return 45 + this.translateY * this.height;
};

/* 设置加速度和当前最大速度 */
RobotEntity.prototype.setPower = function (power) {
  this.power = power;
};

RobotEntity.prototype.brake = function (power) {
  this.power = 0 - power;
}

RobotEntity.prototype.get = function (attr) {
    return this[attr];
};

RobotEntity.prototype.set = function (attr, value) {
  this[attr] = value;
};

RobotEntity.prototype.getPosition = function () {
  return {
    x: this.translateX,
    y: this.translateY
  }
};

RobotEntity.prototype.collide = function (rock) {
  // var durability2 = this.config.durability2;
  var  rockWeight = rock.weight;
  var   rockSpeed = rock.speed;

  // var thisSize  = this.level;
  var thisSpeed = this.speed;

  var damage = Math.sqrt(rockWeight * Math.abs(thisSpeed - rockSpeed));

  // if (rockSpeed * thisSpeed > 0) {
  //   damage = Math.abs(thisSize * Math.abs(thisSpeed) - rockSize * Math.abs(rockSpeed));
  // } else {
  //   damage = Math.abs(thisSize * thisSpeed - rockSize * rockSpeed);
  // }
  //
  // thisSpeed -= damage / (thisSize + rockSize); //damage / thisSize;

  rock.disappear();

  this.config.durability2 -= damage;
  this.speed = thisSpeed / 2;

  var MaxShield = this.config.durability1;
  var CurShield = this.config.durability2;
  $("#hp > div").height((MaxShield - CurShield) / MaxShield * 100 + "%");

  // console.log("剩余耐久：" + Math.round(this.durability));

  if (this.durability <= 0) {
    this.status = "crash";
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

/* 前进 */
RobotEntity.prototype.update = function (friction) {
  // if (this.status === "empty") {
  //   this.power = 0;
  // }

  var a = (this.power + friction) / this.config.weight;

  this.speed += a / window.cfg.FRAMES;

  this.translateX   += this.speed / window.cfg.FRAMES;
  this.config.fuel2 -= this.power / 1000 * 100 / this.config.cost / window.cfg.FRAMES;

  if (this.translateX < 0) {
    this.translateX = 0;
  }

  this.Ball.setOffsetX(this.translateX);

  if (this.config.fuel2 <= 0) {
    this.config.fuel2 = 0;
  }
};

module.exports = RobotEntity;
