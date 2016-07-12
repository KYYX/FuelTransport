(function () {
  'use strict';

  var adjustSpeed = function () {
    currentSpeed += currentAcceleration; //调整当前速度

    if (currentSpeed > controlSpeed) {
      currentSpeed = controlSpeed
    } else if (currentSpeed < 0) {
      currentSpeed = 0;
    } else { /* 速度正常增减 */}
  };

  var setMyRollPosition = function (x, y) {
    myRollNode.style.transform = "translate(" + x + "px, " + y + "px)";
    // myRollNode.style.transform = "translateX(" + x + "px)";
    // myRollNode.style.top = y + "px";
  };

  var screenWidth = window.innerWidth;
  var distance = 5000; //地图距离

  var scrollNode = document.querySelector('.scroll');
  var myRollNode = document.querySelector('#my-rocket');

  scrollNode.style.width = distance + "px";
  /*
  var myRocket = new MyRocket({
    maxSpeed  : 512, //最大速度
    accelerate: 3000 //加速度 -> 多少毫秒加速到最大速度
  }, distance);

  var rocket_1 = new Rocket({
    maxSpeed: 100,
    accelerate: 3000,
    left: 100,
    lane: 1,
    speed: 20
  }, distance);

  $('.scroll').swipeUp(myRocket.moveUp)
              .swipeDown(myRocket.moveDown)
              .tap(function () {
    // myRocket.start();
    // rocket_1.start();
  });
  */
  var scrollNodeLeft  = 0;  //地图滚动的距离
  var currentSpeed    = 0;  //当前速度
  var currentAcceleration = 5; //当前的加速度
  var controlSpeed    = 25; //当前油门深度的最大速度
  var maxSpeed        = 50; //最大速度
  var maxAcceleration = 10; //最大加速度

  //主循环
  var mainLoop = setInterval(function () {
    var translateX, translateY = top;

    adjustSpeed();

    scrollNodeLeft -= currentSpeed / 10;

    if (Math.abs(scrollNodeLeft) < distance - screenWidth ) {
      scrollNode.style.transform = "translateX(" + scrollNodeLeft + "px)";
    } else { /* 地图静止 */}

    translateX = 0 - scrollNodeLeft;

    if (orientation === "down") {
      translateY = top += 1;
    } else if (orientation === "up") {
      translateY = top -= 1;
    }

    setMyRollPosition(translateX, translateY);
  }, 1000 / 60);

  var deepOfaccelerator = 50; //油门深度
  var speedCtrlSwitch = "off";
  var currentPos = 0; //油门的位置的页面定位

  var ballNode = document.querySelector(".ball");

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
      var focus = clientX - currentPos;

      deepOfaccelerator += focus;

      if (deepOfaccelerator > 100 || deepOfaccelerator < 0) {
        deepOfaccelerator -= focus;
      }

      ballNode.style.left = deepOfaccelerator + "px";

      currentPos = clientX;

      controlSpeed = maxSpeed * deepOfaccelerator / 100;
      currentAcceleration = maxAcceleration * deepOfaccelerator / 100;
    }
  });

  var top = 0;
  var orientation = "";
  var upNode = document.querySelector('.orientation.up');

  upNode.addEventListener('touchstart', function (event) {
    orientation = "up";
  });

  upNode.addEventListener('touchend', function (event) {
    orientation = "";
  });

  var downNode = document.querySelector('.orientation.down');

  downNode.addEventListener('touchstart', function (event) {
    orientation = "down";
  });

  downNode.addEventListener('touchend', function (event) {
    orientation = "";
  });
})();
