import Accelerator from './AcceleratorEntity.js';
import       Track from './TrackEntity.js';
import       Robot from './RobotEntity.js';
import          AI from './AIEntity.js';
import        Rock from './RockEntity.js';

var STATUS = "NORMAL";
var SCALE  = 1;
var RANDOM = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

var $distanceStatus = $("#game .status > .distance");
var $timeStatus = $("#time");
var $fuelboard  = $("#fuelboard");
var $speedboard = $("#speedboard");

var workerTimeout; //监控worker;
var workerJS = `
  onmessage = function (event) {
    if (event.data === 200) {
      setTimeout(function () {
        postMessage(event.data);
      }, 1000 / 60);
    }
  }`;
var blobForWorker = new Blob([workerJS], {type: "text/javascript"});

var MainLoop = new Worker(window.URL.createObjectURL(blobForWorker));
var tick = 0;
var screenWidth = window.innerWidth;
var paused = false;
var startTime = -1;
var countDownInterval = -1; //倒计时

var robots     = [];
var rocks      = [[],[],[],[],[]];
var tracks     = TrackCfg.tracks; //赛道数量
var distance   = TrackCfg.distance; //赛道长度
var friction   = TrackCfg.friction; //轨道摩擦力
var robotWidth = 120 / tracks; //球体宽度

//创建陨石
var createRocks = function () {
  for (var i=0; i<tracks; i++) {
    var count    = 0;
    var lastX    = screenWidth - 100;
    var _rockCfg = $.extend(true, {}, rockCfg);

    while (count < TrackCfg.rockCount) {
      lastX += RANDOM(100, 300);
      count += 1;

      _rockCfg.track    = i + 1;
      _rockCfg.weight   = RANDOM(1,50);
      _rockCfg.speed    = 0 - RANDOM(0,200);
      _rockCfg.distance = lastX;

      rocks[i].push(new Rock(_rockCfg));
    }
  }
};

//倒计时
var countDown = function (time, message, callback) {
  var countDown = time;

  console.log(countDown);

  countDownInterval = setInterval(function () {
      countDown -= 1;
      console.log(countDown);

      if (countDown === 0) {
        clearInterval(countDownInterval);
        countDownInterval = -1;
        console.log(message);
        callback();
      }
  }, 1000);

  return countDownInterval;
};

//过滤掉不需要update的对象，设置不在屏幕内的rock为display
var filterRockAndRocket = function () {
  var rocketDistance = MyRobot.get("translateX");

  robots = robots.filter(function (robot) {
    if (robot.get("translateX") < distance) {
      return true;
    } else {
      robot.set("status", "arrived");
      return false;
    }
  });

  for (var i=0; i<rocks.length; i++) {
    rocks[i] = rocks[i].filter(function (rock) {
      if (rock.status === "disappear" || rock.distance < 0) {
        return false;
      } else {
        return true;
      }
    });
  }
};

//碰撞检测
var collisionDetection = function () {
  var rocketWidth    = MyRobot.get("width");
  var rocketDistance = MyRobot.get("translateX");
  var rocketTrack    = MyRobot.get("translateY");
  var len = rocks.length

  for (var i=0; i<len; i++) {
    var rocksForTrack = rocks[i];

    //一条轨道上的陨石
    for (var j=0; j<rocksForTrack.length-1; j++) {
      var     rockJ = rocksForTrack[j];
      var distanceJ = rockJ.get("distance");
      var   weightJ = rockJ.get("weight");
      var    speedJ = rockJ.get("speed");

      if (rockJ.status === "disappear") {
          continue;
      }

      for (var k=j+1; k<rocksForTrack.length; k++) {
        var     rockK = rocksForTrack[k];
        var distanceK = rockK.get("distance");
        var   weightK = rockK.get("weight");
        var    speedK = rockK.get("speed");

        if (rockK.status === "disappear" || Math.abs(distanceJ - distanceK) >= 10) {
            /* 陨石不存在，或者没有相撞 */
            continue;
        } else {
          rockJ.disappear();
          rockK.disappear();

          var _speed = (weightJ * speedJ + weightK * speedK) / (weightJ + weightK);

          rocksForTrack.push(new Rock({
            height  : 45,
            width   : 24,
            weight  : weightJ + weightK,
            track   : i + 1,
            speed   : _speed,
            distance: Math.min(distanceJ, distanceK),
          }));

          break;
        }
      }
    }
  }

  if (rocketDistance < distance - 50) {
    var rocksForTrack = rocks[rocketTrack];

    for (var i=0; i<rocksForTrack.length; i++) {
      var rock = rocksForTrack[i];

      if (rock.status === "disappear") {
        continue;
      }

      var rockWidth    = rock.get("width");
      var rockDistance = rock.get("distance");

      if (Math.abs(rockDistance - rocketDistance) < (rockWidth + rocketWidth) / 2) {
        MyRobot.collide(rock);
      }
    }
  } else {
    /* 进入终点安全区，不进行碰撞检测 */
  }
};

//设置状态栏（剩余路程、能量）
var setStatusBar = function (robot) {
  var config = robot.config;

  if (startTime > -1 && tick % 2 === 0) {
    var  costTime = new Date() - startTime;
    if (costTime < 10) {
      costTime = "000" + costTime;
    } else if (costTime < 100) {
      costTime = "00" + costTime;
    } else if (costTime < 1000) {
      costTime = "0" + costTime;
    } else {
      costTime = "" + costTime;
    }

    var       len = costTime.length;
    var frontHalf = costTime.substring(0, len-3);
    var  backHalf = costTime.substring(len-3, len-1);

    $timeStatus.html(frontHalf + "." + backHalf);
  }

  $distanceStatus.html(Math.round(distance - robot.translateX));

  $fuelboard.html(Math.round(config.fuel2));
  $speedboard.html(Math.round(robot.speed));

  if (config.fuel2 === 0) {
    robot.set("status", "empty");
  }
};

//更新对象状态
var _update = function () {
  tick += 1;

  clearTimeout(workerTimeout);

  //更新火舰状态
  robots.forEach(function (robot) {
    var _friction = robot.get("translateX") < 50 ? 0 : friction;
    robot.get("status") !== "crash" && robot.update(_friction);
  });

  //更新岩石状态
  rocks.forEach(function (rocksForTrack) {
    rocksForTrack.forEach(function (rock) {
      rock.update(friction);
    });
  });

  //碰撞检测
  collisionDetection();

  //过滤
  filterRockAndRocket();

  var rocketDistance = MyRobot.get("translateX");

  //渲染能看到的陨石
  $(".scroll .rock").remove();

  for (var i=0; i<rocks.length; i++) {
    rocks[i].forEach(function (rock) {
      var rockDistance = rock.get("distance");

      if (Math.abs(rocketDistance - rockDistance) <= screenWidth / SCALE) {
        rock.render();
      }
    });
  }

  if (MyRobot.get("status") === "crash") {
    if (STATUS !== "CRASH") {
      if (STATUS !== "NORMAL") {
        clearInterval(countDownInterval);
      }

      STATUS = "CRASH";

      countDown(5, "Traffic accident ~ Game over!", _stop);
    }
  } else if (MyRobot.get("status") === "arrived") {
    if (STATUS !== "ARRIVED") {
      if (STATUS !== "NORMAL") {
        clearInterval(countDownInterval);
      }

      STATUS = "ARRIVED";

      countDown(3, "Misson complete ~ Congratulation!", _stop);
    }
  } else if (MyRobot.get("status") === "empty") {
    if (STATUS !== "EMPTY") {
      if (STATUS !== "NORMAL") {
        clearInterval(countDownInterval);
      }

      STATUS = "EMPTY";

      console.log("坚持10秒，等待救援队伍");
      countDown(10, "Save by rescue team ~ hoooray!", _stop);
    }

    Track.update(MyRobot.translateX, MyRobot.speed);
    setStatusBar(MyRobot);
  } else {
    if (STATUS !== "NORMAL") {
      clearInterval(countDownInterval);
      STATUS = "NORMAL";
    }
    //更新赛道
    Track.update(MyRobot.translateX, MyRobot.speed);
    setStatusBar(MyRobot);
  }

  //如果不暂停，则继续主循环
  if (!paused) {
    workerTimeout = setTimeout(function () {
      console.warn('Worker terminate!!!');
    }, 1000);

    MainLoop.postMessage(200);
  }
};

//结束
var _stop = function () {
  clearTimeout(workerTimeout);
  MainLoop.terminate();
};

//开始
var _start = function () {
  if (startTime === -1) {
    startTime = +new Date();
  } else {
    paused = false;
  }

  MainLoop.postMessage(200);
};

//暂停
var _pause = function () {
  paused = true;
};

//退出
var _quit = function () {
  robots = [];
  rocks  = [[],[],[],[],[]];
};

var _init = function (scale) {
  SCALE = scale;

  Track.init(distance, tracks, MyRobot, SCALE);
  Accelerator.init(MyRobot);
}

//上下移动事件
$(".scene").swipeUp(function () {
  MyRobot.setTranslateY(-1);
}).swipeDown(function () {
  MyRobot.setTranslateY(1);
});

MainLoop.onmessage = _update;

var MyRobot = new Robot($.extend(true, robotCfg.my, {tracks: tracks}));

robots.push(MyRobot);

for (var i=0; i<tracks; i++) {
  var count    = 0;
  var lastX    = screenWidth - 100;
  var _rockCfg = $.extend(true, {}, rockCfg);

  while (count < TrackCfg.rockCount) {
    lastX += RANDOM(100, 300);
    count += 1;

    _rockCfg.track    = i + 1;
    _rockCfg.weight   = RANDOM(1,50);
    _rockCfg.speed    = 0 - RANDOM(0,200);
    _rockCfg.distance = lastX;

    rocks[i].push(new Rock(_rockCfg));
  }
}

//       Track.init(distance, tracks, MyRobot);
// Accelerator.init(MyRobot);

setStatusBar(MyRobot);

module.exports = {
  init: _init,
  start: _start,
  pause: _pause
};
