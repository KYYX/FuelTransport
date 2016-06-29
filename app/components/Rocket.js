var Rocket = (function () {
  var scrollNode = document.querySelector('.scroll');

  return function (cfg, distance) {
    var maxSpeed  = cfg.maxSpeed; //512;  //最大速度
    var accelerat = cfg.accelerat; //3000; //加速度 -> 多少毫秒加速到最大速度
    var left      = 0 - cfg.left; //0;    //已经开过的距离
    var lane      = cfg.lane; //所处赛道
    var speed     = cfg.speed; //当前速度

    var interval, acceleratedInterval;

    this.start = function () {
      acceleratedInterval = setInterval(function () {
        speed += 1;

        if (speed > maxSpeed) {
          clearInterval(acceleratedInterval);
        }
      }, accelerat / maxSpeed);

      interval = setInterval(function () {
        left -= (speed * (1  / 36));

        if (0 - left > distance) {
          // console.log('Mission Complete!!!');
          clearInterval(interval);
          scrollNode.removeChild(rocketNode);
        } else {
          rocketNode.style.transform = "translateX(" + (0 - left) + "px)";
        }
      }, 1000 / 36);
    }

    var rocketNode = document.createElement('div');
        rocketNode.className = "rocket";
        rocketNode.style.transform = "translateX(" + (0 - left) + "px)";
        rocketNode.style.top = (12.5 + (lane - 1) * 25) + "%";

    scrollNode.appendChild(rocketNode);
  }
})();
