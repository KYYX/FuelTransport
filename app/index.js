(function () {
  'use strict';
  var screenWidth = window.innerWidth;
  var distance = 5000; //地图距离
  var scrollNodeLeft = 0;  //地图滚动的距离

  var scrollNode = document.querySelector('.scroll');
  var ballNode   = document.querySelector(".ball");

  var MyRoll = new RollEntity({
    maxSpeed   : 200, //最大速度
    maxSpeedUp : 30, //最大加速度
    speedCut   : 10,  //匀减速
    maxSpeedCut: 20,   //最大制动力
    x: 10,
    y: 60
  });

  //设置地图长度
  scrollNode.style.width = distance + "px";

  //主循环
  var mainLoop = setInterval(function () {
    MyRoll.update();

    var myRollStatus = MyRoll.getStatus();

    if (Math.abs(myRollStatus.x) < 73) {
      /* 当球体滚动64px再开始滚动地图 */
    } else if (Math.abs(myRollStatus.x) < distance - screenWidth ) {
      scrollNodeLeft -= myRollStatus.speed / 60;
      scrollNode.style.transform = "translateX(" + scrollNodeLeft + "px)";
    } else {
      /* 地图达到最大距离，停止滚动 */
    }
  }, 1000 / 60);

  var deepOfaccelerator = 100; //油门深度
  var speedCtrlSwitch = "off";
  var currentPos = 0; //油门的位置的页面定位

  ballNode.addEventListener('touchstart', function (event) {
    speedCtrlSwitch = "on";

    currentPos = event.changedTouches[0].clientX;

    event.stopPropagation();
  });

  ballNode.addEventListener('touchend', function (event) {
    speedCtrlSwitch = "off";
  });

  ballNode.addEventListener('touchmove', function (event) {
    if (speedCtrlSwitch === "on") {
      var clientX = event.changedTouches[0].clientX;
      var deep = clientX - currentPos;

      deepOfaccelerator += deep;

      if (deepOfaccelerator > 200) {
        deepOfaccelerator = 200;
      } else if (deepOfaccelerator < 0) {
        deepOfaccelerator = 0;
      } else {

      }

      ballNode.style.left = deepOfaccelerator + "px";

      currentPos = clientX;

      MyRoll.setDeepOfAccelerator(deepOfaccelerator - 100);
    }
  });


  var moveCtrlSwitch = "off"; //上下移动开关
  var moveSwitchPos;

  scrollNode.addEventListener('touchstart', function (event) {
    moveCtrlSwitch = "on";

    moveSwitchPos = event.changedTouches[0].clientY;

    event.stopPropagation();
  });

  scrollNode.addEventListener('touchend', function (event) {
    moveCtrlSwitch = "off";

    event.stopPropagation();
  });

  scrollNode.addEventListener('touchmove', function (event) {
    if (moveCtrlSwitch === "on") {
      var clientY = event.changedTouches[0].clientY;
      var offsetY = clientY - moveSwitchPos;

      MyRoll.setTranslateY(offsetY);

      moveSwitchPos = clientY;
    }
  });
})();
