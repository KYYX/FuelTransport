import Accelerator from './AcceleratorEntity.js';
import Track from './TrackEntity.js';
import Robot from './RobotEntity.js';

var workerJS = `
  onmessage = function (event) {
    if (event.data === 200) {
      setTimeout(function () {
        postMessage(event.data);
      }, 1000 / 60);
    }
  }
`;
var blobForWorker = new Blob([workerJS], {type: "text/javascript"});

var MainLoop = new Worker(window.URL.createObjectURL(blobForWorker));

var paused = false;
var startTime = +new Date();

var tracks = 4;
var distance = 3000;

var MyRoll = new Robot({
  color: "#70CCF0",
  maxSpeed   : 200, //最大速度
  maxSpeedUp : 30,  //最大加速度
  speedCut   : 10,  //匀减速
  maxSpeedCut: 20,  //最大制动力
  tracks: tracks,
  x: 10,
  y: 1
});

var OtherRobot = new Robot({
  color: "#489733",
  maxSpeed    : 200, //最大速度
  maxSpeedUp  : 30,  //最大加速度
  speedCut    : 10,  //匀减速
  maxSpeedCut : 20,  //最大制动力
  currentSpeed: 20,
  tracks: tracks,
  x: 100,
  y: 0
});

var roberts = [MyRoll, OtherRobot];

Track.init(distance, tracks, MyRoll);
Accelerator.init(MyRoll);

var timeout; //监控worker;

var _update = function () {
  clearTimeout(timeout);

  roberts.forEach(function (robot) {
    robot.update();
  });
  // MyRoll.update();
  Track.update(MyRoll.translateX, MyRoll.currentSpeed);

  if (MyRoll.translateX >= distance) {
    clearTimeout(timeout);
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
};

var _start = function () {
  paused = false;
  MainLoop.postMessage(200);
};

var _pause = function () {
  paused = true;
};

MainLoop.onmessage = _update;

module.exports = {
  start: _start,
  pause: _pause
};
