(function () {
  'use strict';
  var tracks = 4;

  var Track = new TrackEntity({
    distance: 5000,
    tracks: tracks
  });

  var Accelerator = new AcceleratorEntity(MyRoll);

  var MyRoll = new RollEntity({
    maxSpeed   : 200, //最大速度
    maxSpeedUp : 30,  //最大加速度
    speedCut   : 10,  //匀减速
    maxSpeedCut: 20,  //最大制动力
    tracks: tracks,
    x: 10,
    y: 1
  });

  Track.loadMyRoll(MyRoll);

  //主循环
  if (window.Worker) {
    var workerJS = `
      onmessage = function (event) {

      };
      setInterval(function () {
        postMessage(1);
      }, 1000 / 60);
    `;
    var blobForWorker = new Blob([workerJS], {type: "text/javascript"});
    var mainWorker = new Worker(window.URL.createObjectURL(blobForWorker));

    mainWorker.onmessage = function (event) {
      mainWorker.postMessage(200);
      MyRoll.update();
      Track.update(MyRoll.translateX, MyRoll.currentSpeed);
  	};
  } else {
    //当tap屏幕的时候会造成卡顿
    var mainLoop = setInterval(function () {
      MyRoll.update();
      Track.update(MyRoll.translateX, MyRoll.currentSpeed);
    }, 1000 / 60);
  }
})();
