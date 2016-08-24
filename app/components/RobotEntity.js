import Ball from './BallEntity';

function RobotEntity (config) {
  this.status = "normal";

  this.config = config;
  this.distance = 0;
  this.power = 0; //当前动力
  this.speed = 0; //当前速度
  this.cost  = 0; //当前油耗
  this.track = 2; //当前轨道

  this.Ball = new Ball();
}

RobotEntity.prototype.type = "Rocket";

RobotEntity.prototype.get = function (attr) {
    return this[attr];
};

RobotEntity.prototype.set = function (attr, value) {
  this[attr] = value;
};

RobotEntity.prototype.changePower = function (power, cost) {
  this.power += power;
  this.cost  += cost;
};

RobotEntity.prototype.getPosition = function () {
  return {
    x: this.distance,
    y: this.track
  }
};

RobotEntity.prototype.collide = function (rock) {
  var rockWeight = rock.weight;
  // var  rockSpeed = rock.speed;
  var  thisSpeed = this.speed;
  // var      damage = Math.sqrt(rockWeight * Math.abs(thisSpeed - rockSpeed));
  var damage = rockWeight * thisSpeed;

  rock.disappear();

  this.config.HP -= damage;
  // this.speed = thisSpeed / 2;

  var MaxShield = this.config.MaxHP;
  var CurShield = this.config.HP;

  $("#hp > div").height((MaxShield - CurShield) / MaxShield * 100 + "%");

  // console.log("剩余耐久：" + Math.round(this.durability));

  if (this.config.HP <= 0) {
    this.config.HP = 0;
    this.status = "crash";
  }
};

/* 变道 */
RobotEntity.prototype.up = function () {
   this.track = this.Ball.up();
};

RobotEntity.prototype.down = function () {
   this.track = this.Ball.down();
};

/* 前进 */
RobotEntity.prototype.update = function (friction) {
  var a = (this.power + friction) / this.config.weight;

  this.speed += a / window.cfg.FRAMES;

  this.distance += this.speed / window.cfg.FRAMES;

  if (this.cost > 0) {
    this.config.MP  -= this.power / 1000 * 100 / this.cost / window.cfg.FRAMES;
  }

  if (this.distance < 0) {
    this.distance = 0;
  }

  this.Ball.move(this.distance);

  if (this.config.MP <= 0) {
    this.config.MP = 0;
    this.status = "empty";
  }
};

module.exports = RobotEntity;
