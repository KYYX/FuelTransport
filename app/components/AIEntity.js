import Robot from './RobotEntity.js';

function AI (config) {
  var person = config.person;

  this.status = "normal";
  this.tick   = 0;
  this.config = config;

  this.circumstanceDetection = (function (self) {
    return function (front, back) {
      return config.circumstanceDetection(self, front, back);
    }
  })(this);

  this.MaxPower = config.robot.power * person.MaxPowerRate;
  this.robot    = new Robot(config.robot);

  this.lastFrontDistance = -1;
}

AI.prototype.get = function (attr) {
  return this.robot.get(attr);
};

AI.prototype.set = function (attr, value) {
  this.robot.set(attr, value);
};

AI.prototype.getPosition = function () {
  return this.robot.getPosition();
};

AI.prototype.update = function (friction) {
  this.tick += 1;

  var    robot = this.robot;
  var robotCfg = robot.config;
  var    armor = robotCfg.armor;
  var  braking = robotCfg.braking;
  var   power  = robotCfg.power;
  var    speed = robot.get("speed");
  var     lfd  = this.lastFrontDistance;
  var      fd  = this.circumstanceDetection(200, 100);

  if (typeof fd.right === "number") {
    var _braking;

    if (lfd < 0) { //开始减速
      _braking = Math.pow(speed, 2) / 200 * (armor + speed) + friction;
      _braking = _braking > braking ? braking : _braking;
    }

    if (fd.right < 50) {
      _braking = _braking * 2;
      _braking = _braking > braking ? braking : _braking;
    }

    if (lfd > fd.right) { //由于和前方车辆变远，脱离减速
      _braking = 0;
    }

    robot.set("power", 0 - _braking);

    this.lastFrontDistance = fd.right;
  } else {
    this.lastFrontDistance = -1;

    var _power = robot.get("power");

    if (_power < 0) {
      _power = this.MaxPower / (60 * 2);
    } else {
      _power += this.MaxPower / (60 * 2);
    }

    _power = _power > this.MaxPower ? this.MaxPower : _power;

    robot.setPower(_power);
  }
  
  robot.update(friction);
};

module.exports = AI;
