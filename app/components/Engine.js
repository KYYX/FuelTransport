import Accelerator from './AcceleratorEntity.js';
import       Track from './TrackEntity.js';
import       Robot from './RobotEntity.js';
import        Rock from './RockEntity.js';

var STATUS  = "NORMAL";
var SCALE   = 1;
var UPDATED = true;

var RANDOM = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

var $monitor = $("#game .monitor");
var $arrivedDialog   = $("#game .cover.arrived");
var $exhaustedDialog = $("#game .cover.exhausted");
var $crashedDialog   = $("#game .cover.crashed");
var $distanceStatus  = $("#game .status > .distance");
var $timeStatus = $("#time");
var $fuelboard  = $("#fuelboard");
var $speedboard = $("#speedboard");

var workerTimeout; //监控worker;
var workerJS = `
  onmessage = function (event) {
    var waitTime = 1000 / 50 - event.data;
    waitTime = waitTime < 0 ? 0 : waitTime;
    setTimeout(function () {
      postMessage(+new Date());
    }, waitTime);
  }`;
var blobForWorker = new Blob([workerJS], {type: "text/javascript"});

var MainLoop = new Worker(window.URL.createObjectURL(blobForWorker));
var tick = 0;
var screenWidth = window.innerWidth;
var paused = false;
var startTime = -1;
var lastTime = 0;
var countDownInterval = -1; //倒计时

var robots  = [];
var rocks   = [[],[],[],[],[]];
var MyRobot ;
var tracks  ; //= TrackCfg.tracks; //赛道数量
var distance; //= TrackCfg.distance; //赛道长度
var friction = 0; //= TrackCfg.friction; //轨道摩擦力

//创建陨石
var createRock = function (track, lastX) {
  var rock = new Rock({
    width   : 24, //陨石宽
    height  : 45, //轨道高
    track   : track + 1,
    weight  : RANDOM(1,50),
    speed   : 0 - RANDOM(0,200),
    distance: lastX//screenWidth / SCALE - 24,
  });

  rock.render();

  return rock;
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

  if (tick % 2 === 0) {
    if (startTime > -1) {
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
  }

  $speedboard.html(Math.round(robot.speed));

  if (config.fuel2 === 0) {
    robot.set("status", "empty");
  }
};

//更新对象状态
var _update = function (event) {
  tick += 1;

  // window.cfg.FRAMES = Math.round(1000 / (event.data - lastTime));

  lastTime = +new Date();//event.data;

  clearTimeout(workerTimeout);

  //更新火舰状态
  robots.forEach(function (robot) {
    var _friction = robot.get("translateX") < 50 ? 0 : friction;
    robot.get("status") !== "crash" && robot.update(_friction);
  });

  //更新岩石状态
  rocks.forEach(function (rocksForTrack) {
    rocksForTrack.forEach(function (rock) {
      rock.status === "active" && rock.update(friction);
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
        rock.invoke();
        rock.render();
      }
    });
  }

  setStatusBar(MyRobot);

  if (MyRobot.get("status") === "crash") {
    paused = true;

    setTimeout(function () { $crashedDialog.fadeIn(50); }, 10);
  } else if (MyRobot.get("status") === "arrived") {
    paused = true;

    setTimeout(function () { $arrivedDialog.fadeIn(50); }, 10);
  } else if (MyRobot.get("status") === "empty") {
    paused = true;

    setTimeout(function () { $exhaustedDialog.fadeIn(50); }, 10);
  } else {
    //更新赛道
    Track.update(MyRobot.translateX, MyRobot.speed);
  }

  //如果不暂停，则继续主循环
  if (!paused) {
    workerTimeout = setTimeout(function () {
      console.warn('Worker terminate!!!');
    }, 1000);

    // var nowTime = +new Date();
    // $monitor.html(nowTime - lastTime);
    var time_ = +new Date() - lastTime;

    MainLoop.postMessage(time_);
  }

  // UPDATED = true;
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
    lastTime = startTime;
  } else {
    paused = false;
  }

  MainLoop.postMessage(0);
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

/**
 * 初始化游戏
 * 设置缩放、轨道数量、距离
 * 创建陨石群
 * 创建我的火舰
 */
var _init = function (config, isTest) {
  SCALE    = config.scale;
  tracks   = config.tracks;   //赛道数量
  distance = config.distance; //赛道长度

  // var oneTrackRockCount = config.rockCount;

  if (!isTest) {
    for (var i=0; i<tracks; i++) {
      var count = 0;
      var lastX = screenWidth / SCALE - 100;//screenWidth - 100;

      // while (count < oneTrackRockCount) {
      while (lastX < distance) {
        lastX += RANDOM(100, 300);
        count += 1;

        rocks[i].push(createRock(i, lastX));
      }
    }
  }

  MyRobot = new Robot($.extend(KIM.rocket, {
    color: "#70CCF0",
    x: 10,
    y: 1,
    tracks: tracks
  }));

  robots.push(MyRobot);

  Track.init(distance, tracks, SCALE);
  Accelerator.init(MyRobot);

  setStatusBar(MyRobot);
}

var _reset = function () {
  robots  = [];
  rocks   = [[],[],[],[],[]];
  MyRobot = null;

  $("#game").find(".rocket-wrap, .rock").remove();
};

//上下移动事件
$(".scene").swipeUp(function () {
  MyRobot.setTranslateY(-1);
}).swipeDown(function () {
  MyRobot.setTranslateY(1);
});

screen.orientation.addEventListener("change", function () {
  var angle = screen.orientation.angle;

  if (angle !== 90 && angle !== 270) {
    _pause();
  } else {
    if (paused) {
      _start();
    }
  }
})

MainLoop.onmessage = _update;

module.exports = {
  init:  _init,
  reset: _reset,
  start: _start,
  pause: _pause,
  addFuel: function (fuel) {
    MyRobot.config.fuel2 += fuel;
    MyRobot.status = "normal";

    return this;
  }
};
