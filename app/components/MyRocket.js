var MyRocket = (function () {
  var ww = window.innerWidth;
  var scrollNode = document.querySelector('.scroll');

  return function (cfg, distance) {
    var maxSpeed  = cfg.maxSpeed; //512;  //最大速度
    var accelerat = cfg.accelerat; //3000; //加速度 -> 多少毫秒加速到最大速度

    var speed = 1;
    var top  = 37.5;
    var left = 0;

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

        if (left > ww - distance) {
          scrollNode.style.transform = "translateX(" + left + "px)";
        }

        if (0 - left > distance) {
          console.log('Mission Complete!!!');
          clearInterval(interval);
          scrollNode.removeChild(rocketNode);
        } else {
          rocketNode.style.transform = "translateX(" + (0 - left) + "px)";
        }
      }, 1000 / 36);
    };

    this.moveUp = function () {
      top = top - 25;

      if (top > 0) {
        rocketNode.style.top = top + "%";
      }
    };

    this.moveDown = function () {
      top = top + 25;

      if (top <= 62.5) {
        rocketNode.style.top = top + "%";
      }
    }

    var rocketNode = document.createElement('div');
        // rocketNode.attributes.id = 'my-rocket'; -> 不起作用
        rocketNode.setAttribute('id', 'my-rocket');
        rocketNode.className = "rocket";
        rocketNode.style.transform = "translateX(" + (0 - left) + "px)";
        rocketNode.style.top = top + "%";

    scrollNode.appendChild(rocketNode);
  }
})();
