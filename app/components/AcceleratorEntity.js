var AcceleratorEntity = (function () {
  var _Accelerator;

  function _AcceleratorEntity (MyRoll) {
    if (_Accelerator) {
      console.warn('AcceleratorEntity is a singleton');
      return _Accelerator;
    } else {
      var deepOfAccelerator = 100; //油门深度
      var speedCtrlSwitch = "off";
      var currentPos = 0; //油门的位置的页面定位

      var acceleratorNode = document.querySelector("#accelerator");

      acceleratorNode.addEventListener('touchstart', function (event) {
        speedCtrlSwitch = "on";

        currentPos = event.changedTouches[0].clientX;

        event.stopPropagation();
      });

      acceleratorNode.addEventListener('touchend', function (event) {
        speedCtrlSwitch = "off";
      });

      acceleratorNode.addEventListener('touchmove', function (event) {
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

          MyRoll.setDeepOfAccelerator(deepOfAccelerator - 100);
        }
      });
    }
  }

  return _AcceleratorEntity;
})()
