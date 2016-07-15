import Accelerator from './AcceleratorEntity.js';
import Track from './TrackEntity.js';
import Robot from './RobotEntity.js';
import AI from './AIEntity.js';

var timeout; //监控worker;
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

var paused = false;
var startTime = -1;

var robots     = [];
var tracks     = 4; //赛道数量
var distance   = 3000; //赛道长度
var robotWidth = 40; //球体宽度

if (tracks === 4) {
  robotWidth = 30;
} else if (tracks === 5) {
  robotWidth = 24;
} else if (tracks === 6) {
  robotWidth = 20;
} else {
  robotWidth = 40;
}

//碰撞检测
var collisionDetection = function () {
  for (var i=0; i<robots.length - 1; i++) {
    var robotsI = robots[i];
    for (var j=i+1; j<robots.length; j++) {
      var robotsJ = robots[j];

      if (robotsI.getOffsetY() === robotsJ.getOffsetY() &&
          Math.abs(robotsI.getOffsetX() - robotsJ.getOffsetX()) < robotWidth) {
        robotsI.crash();
        robotsJ.crash();
      }
    }
  }
};

//周围检测
var circumstanceDetection = (function (robots) {
  return function (centralRobot, front, back) {
    var fd = {
      top:    true,
      right:  false,
      bottom: true,
      left:   false,
    }

    for (var i=0; i<robots.length; i++) {
      var robot = robots[i];

      if (robot === centralRobot) {
        continue;
      } else {
        //上下是否可变道
        var offsetY = centralRobot.getOffsetY() - robot.getOffsetY();
        //前后距离预警
        var offsetX = centralRobot.getOffsetX() - robot.getOffsetX();

        if (offsetY === 0) {
          if (offsetX < 0 && Math.abs(offsetX) < front) {
            fd.right = true;
          } else if (offsetX > 0 && Math.abs(offsetX) < back) {
            fd.left = true;
          } else { /* 不在前后警戒距离中 */ }
        } else if (Math.abs(offsetY) === 1) {
          if (Math.abs(offsetX) < robotWidth) {
            if (offsetY === -1) {
              fd.bottom = false;
            } else {
              fd.top = false;
            }
          } else { /* 距离安全可变道 */ }
        } else {
          continue;
        }
      }
    }

    return fd;
  };
})(robots);

var _update = function () {
  clearTimeout(timeout);
  //更新车辆
  robots.forEach(function (robot) {
    robot.status !== "crash"   &&
    robot.status !== "arrived" && robot.update();
  });
  //更新赛道
  Track.update(MyRobot.translateX, MyRobot.currentSpeed);
  //碰撞检测
  collisionDetection();

  if (MyRobot.status === "normal") {
    if (MyRobot.translateX >= distance) {
      var endTime = +new Date();
      console.log('Congratulation!!!');
      console.log('Use time: ' + (endTime - startTime) / 1000 + 's');

      MainLoop.terminate();
    } else {
      timeout = setTimeout(function () {
        var endTime = +new Date();
        console.warn('Worker terminate!!!');
        console.warn('Case time: ' + (endTime - startTime) / 1000 + 's');
      }, 1000);

      !paused && MainLoop.postMessage(200);
    }
  } else {
    var endTime = +new Date();
    console.log('Traffic accident!!!');
    console.log('Use time: ' + (endTime - startTime) / 1000 + 's');

    MainLoop.terminate();
  }
};

var _start = function () {
  if (startTime === -1) {
    startTime = +new Date();
  } else {
    paused = false;
  }

  MainLoop.postMessage(200);
};

var _pause = function () {
  paused = true;
};

MainLoop.onmessage = _update;

var MyRobot = new Robot({
  color: "#70CCF0",
  maxSpeed   : 200, //最大速度
  maxSpeedUp : 30,  //最大加速度
  speedCut   : 10,  //匀减速
  maxSpeedCut: 20,  //最大制动力
  tracks: tracks,
  x: 10,
  y: 1
});

var OtherRobot = new AI({
  distance: distance,
  character: {},
  robot: {
    color: "#489733",
    maxSpeed    : 200, //最大速度
    maxSpeedUp  : 30,  //最大加速度
    speedCut    : 10,  //匀减速
    maxSpeedCut : 20,  //最大制动力
    currentSpeed: 20,
    tracks: tracks,
    x: 100,
    y: 0
  },
  circumstanceDetection: circumstanceDetection
});

robots.push(MyRobot);
robots.push(OtherRobot);

Track.init(distance, tracks, MyRobot);
Accelerator.init(MyRobot);

module.exports = {
  start: _start,
  pause: _pause
};
