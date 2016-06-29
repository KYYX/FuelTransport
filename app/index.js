(function () {
  'use strict';

  // var ww = window.innerWidth;
  var distance    = 5000; //地图距离
  // var maxSpeed    = 512; //最大速度
  // var accelerated = 3000; //加速度 -> 多少毫秒加速到最大速度
  // var speed = 1; //当前速度
  // var left = 0; //已经开过的距离

  // var acceleratedInterval, interval;

  var scrollNode   = document.querySelector('.scroll');
  // var myRocketNode = document.querySelector('#my-rocket');

  scrollNode.style.width = distance + "px";
  // myRocketNode.style.top = "37.5%";

  $('.scroll').swipeUp(function () {
    myRocket.moveUp();
  }).swipeDown(function () {
    myRocket.moveDown();
  }).click(function () {
    myRocket.start();
    rocket_1.start();
  });
  /*
  var start = function () {
    acceleratedInterval = setInterval(function () {
      speed += 1;

      console.log(speed);
      if (speed > maxSpeed) {
        clearInterval(acceleratedInterval);
      }
    }, accelerated / maxSpeed);

    interval = setInterval(function () {
      left -= (speed * (1  / 36));

      if (left > ww - distance) {
        scrollNode.style.transform = "translateX(" + left + "px)";
      }

      if (0 - left > distance) {
        console.log('Mission Complete!!!');
        clearInterval(interval);
      } else {
        myRocketNode.style.transform = "translateX(" + (0 - left) + "px)";
      }
    }, 1000 / 36);
  }
  */
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
})();
