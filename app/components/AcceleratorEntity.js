module.exports = (function () {
  var MyRobot;
  var acceleratorNode;
  var deepOfAccelerator = 100; //油门深度
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

      deepOfAccelerator += deep;

      if (deepOfAccelerator > 200) {
        deepOfAccelerator = 200;
      } else if (deepOfAccelerator < 0) {
        deepOfAccelerator = 0;
      } else {

      }

      acceleratorNode.style.left = deepOfAccelerator + "px";

      currentPos = clientX;

      MyRobot.setDeepOfAccelerator(deepOfAccelerator - 100);
    }
  };

  return {
    init: function (Robot) {
      MyRobot = Robot;

      acceleratorNode = document.querySelector("#accelerator");

      acceleratorNode.addEventListener('touchstart', touchstart);
      acceleratorNode.addEventListener('touchend',   touchend);
      acceleratorNode.addEventListener('touchmove',  touchmove);
    }
  };
})()
