(function () {
  'use strict';

  var distance = 5000; //地图距离

  var scrollNode = document.querySelector('.scroll');

  scrollNode.style.width = distance + "px";

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
              .click(function () {
    myRocket.start();
    rocket_1.start();
  });
})();
