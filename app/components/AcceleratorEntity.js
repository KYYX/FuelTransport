module.exports = (function () {
  var MyRobot;
  var acceleratorNode = document.querySelector("#accelerator");
  var deepOfAccelerator; //油门深度
  // var maxDeep  = deepOfAccelerator * 2;
  // var zeroDeep = maxDeep / 2;
  var speedCtrlSwitch = "off";
  var currentPos = 0; //油门的位置的页面定位

  var touchstart = function (event) {
    speedCtrlSwitch = "on";
    currentPos = event.changedTouches[0].clientX;
  };

  var touchend = function (event) {
    speedCtrlSwitch = "off";
  };

  var touchmove = function (event) {
    if (speedCtrlSwitch === "on") {
      var clientX = event.changedTouches[0].clientX;
      var deep = clientX - currentPos;
      var power;

      deepOfAccelerator += deep;

      if (deepOfAccelerator > maxDeep) {
        deepOfAccelerator = maxDeep;
      } else if (deepOfAccelerator < 0) {
        deepOfAccelerator = 0;
      } else {

      }

      acceleratorNode.style.left = deepOfAccelerator + "px";

      currentPos = clientX;

      // var _deepOfAccelerator = (deepOfAccelerator - zeroDeep) / zeroDeep;
      //
      // if (_deepOfAccelerator > 0) {
      //     power = MyRobot.config.PF * _deepOfAccelerator;
      // } else if (_deepOfAccelerator < 0) {
      //     power = MyRobot.config.BF * _deepOfAccelerator;
      // } else {
      //     power = 0;
      // }

      MyRobot.setPower(deepOfAccelerator / 100);
    }
  };

  acceleratorNode.addEventListener('touchstart', touchstart);
  acceleratorNode.addEventListener('touchend',   touchend);
  acceleratorNode.addEventListener('touchmove',  touchmove);

  return {
    init: function (Robot) {
      MyRobot = Robot;
      deepOfAccelerator = 0;
      acceleratorNode.style.left = deepOfAccelerator + "px";
    }
  };
})()
