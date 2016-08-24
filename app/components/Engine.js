// import Accelerator from './AcceleratorEntity.js';
import Track from './TrackEntity.js';
import Robot from './RobotEntity.js';
import  Rock from './RockEntity.js';

var STATUS  = "NORMAL";
var SCALE   = 1;

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
var $items = $("#game .items");
var $upBtn = $("#game .button.up");
var $downBtn = $("#game .button.down");

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

var commandObj = {
  up: function () {
    MyRobot.up();
  },
  down: function () {
    MyRobot.down();
  }
};
var commandList = [];
// var robots  = [];
// var rocks   = [[],[],[],[],[]];
var objectInTracks = [[], [], []]
var MyRobot ;
// var tracks  ; //= TrackCfg.tracks; //赛道数量
var distance; //= TrackCfg.distance; //赛道长度
var friction = 0; //= TrackCfg.friction; //轨道摩擦力

//设置装备栏目
var setEquipment = function (equipments) {
  $items.empty();

  for (var i=0; i<10; i++) {
    if (equipments[i]) {
      (function (equipment, $div) {
        var $div = $("<div><div></div><p>" + equipment.name + "</p></div>")
        $items.append($div);

        if (equipment.type === 1 || equipment.type === 2) {
          $div.singleTap(function () {
            $div.toggleClass("active");

            if ($div.hasClass("active")) {
              MyRobot.changePower(equipment.power, equipment.cost);
            } else {
              MyRobot.changePower(0 - equipment.power, 0 - equipment.cost);
            }
          });
        }

        if (equipment.effect) {
          $div.doubleTap(function () {
            console.log("Trigger skill");
          });
        }
      })(equipments[i]);
    } else {
      var $div = $("<div class='disabled'><div></div><p></p></div>");
      $items.append($div);
    }
  }
};

//创建陨石
var createRock = function (track, lastX) {
  var rock = new Rock({
    track: track,
    // weight  : RANDOM(1,50),
    speed: 0,
    distance: lastX
  });

  rock.render();

  return rock;
};

//过滤掉不需要update的对象，设置不在屏幕内的rock为display
var filterRockAndRocket = function () {
  // var rocketDistance = MyRobot.get("translateX");
  //
  // robots = robots.filter(function (robot) {
  //   if (robot.get("translateX") < distance) {
  //     return true;
  //   } else {
  //     robot.set("status", "arrived");
  //     return false;
  //   }
  // });

  for (var i=0; i<objectInTracks.length; i++) {
    objectInTracks[i] = objectInTracks[i].filter(function (obj) {
      return obj.status === "disappear" || obj.distance < 0 ? false : true;
    });

    objectInTracks[i].sort(function (obj1, obj2) {
      return obj1.distance - obj2.distance
    });
  }

  if (MyRobot.distance >= distance) {
    MyRobot.status = "arrived";
  }
};

//碰撞检测
var collisionDetection = function () {
  // var rocketWidth    = MyRobot.get("width");
  // var rocketDistance = MyRobot.get("translateX");
  // var rocketTrack    = MyRobot.track;
  // var len = rocks.length;
  /** 陨石间的碰撞
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
  */
  var myDistance = MyRobot.distance;

  if (myDistance < distance - 50) {
    // var rocksForTrack = rocks[rocketTrack];
    //
    // for (var i=0; i<rocksForTrack.length; i++) {
    //   var rock = rocksForTrack[i];
    //
    //   if (rock.status === "disappear") {
    //     continue;
    //   }
    //
    //   var rockWidth    = rock.get("width");
    //   var rockDistance = rock.get("distance");
    //
    //   if (Math.abs(rockDistance - rocketDistance) < 32) {
    //     MyRobot.collide(rock);
    //   }
    // }
    var rock1, rock2;
    var myTrack = MyRobot.track - 1;
    // var myIndex = MyRobot.index;
    var objects = objectInTracks[myTrack];

    for (var i=0; i<objects.length; i++) {
      if (i > 0) {
        rock1 = objects[i-1];
      }

      rock2 = objects[i+1];

      if (objects[i] === MyRobot) {
        break;
      }
    }

    if (rock1 && Math.abs(myDistance - rock1.distance) < 30) {
      MyRobot.collide(rock1);
    }

    if (rock2 && Math.abs(myDistance - rock2.distance) < 30) {
      MyRobot.collide(rock2);
    }
  } else {
    /* 进入终点安全区，不进行碰撞检测 */
  }
};

//设置状态栏（剩余路程、能量）
var setStatusBar = function (robot) {
  var config = robot.config;

  if (tick % 6 === 0) {
    // if (startTime > -1) {
    //   var  costTime = new Date() - startTime;
    //   if (costTime < 10) {
    //     costTime = "000" + costTime;
    //   } else if (costTime < 100) {
    //     costTime = "00" + costTime;
    //   } else if (costTime < 1000) {
    //     costTime = "0" + costTime;
    //   } else {
    //     costTime = "" + costTime;
    //   }
    //
    //   var       len = costTime.length;
    //   var frontHalf = costTime.substring(0, len-3);
    //   var  backHalf = costTime.substring(len-3, len-1);
    //
    //   $timeStatus.html(frontHalf + "." + backHalf);
    // }

    $distanceStatus.html("剩余距离：" + Math.round(distance - robot.distance));

    $fuelboard.html(Math.round(config.MP));
  }

  $speedboard.html(Math.round(robot.speed));
};

//更新对象状态
var _update = function (event) {
  tick += 1;

  // window.cfg.FRAMES = Math.round(1000 / (event.data - lastTime));

  lastTime = +new Date(); //event.data;

  clearTimeout(workerTimeout);

  if (commandList.length > 0) {
    var command = commandList.shift();
    commandObj[command]();
  }

  //更新火舰状态
  // robots.forEach(function (robot) {
  //   var _friction = robot.get("translateX") < 50 ? 0 : friction;
  //   robot.get("status") !== "crash" && robot.update(_friction);
  // });
  MyRobot.update(friction);

  // 更新d对象状态 ~ update()
  objectInTracks.forEach(function (oneTrack) {
    oneTrack.forEach(function (object) {
      object !== MyRobot && object.update(friction);
    });
  });

  //碰撞检测
  collisionDetection();

  //过滤
  filterRockAndRocket();

  //渲染能看到的陨石
  // $(".scroll .rock").remove();
  //
  // for (var i=0; i<rocks.length; i++) {
  //   rocks[i].forEach(function (rock) {
  //     var rockDistance = rock.get("distance");
  //
  //     if (Math.abs(rocketDistance - rockDistance) <= screenWidth / SCALE) {
  //       rock.invoke();
  //       rock.render();
  //     }
  //   });
  // }

  //更新状态
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
    Track.update(MyRobot.distance, MyRobot.speed);
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

var _init = function (config, isTest) {
  SCALE    = config.scale;
  distance = config.distance; //赛道长度

  MyRobot = new Robot(KIM.rocket);

  objectInTracks = [[MyRobot], [MyRobot], [MyRobot]];

  if (!isTest) {
    // objectInTracks.forEach(function (track, i) {
    //   var lastX = screenWidth / SCALE;
    //
    //   while (lastX < distance) {
    //     if (Math.random () < 0.5) {
    //       track.push(createRock(i+1, lastX));
    //     }
    //
    //     lastX += 96; //+= RANDOM(100, 300);
    //   }
    //
    //   track.push(MyRobot);
    // });

      var lastX = screenWidth / SCALE;

      while (lastX < distance) {
        var count = 0;

        if (Math.random () < 0.5) {
          objectInTracks[0].push(createRock(1, lastX));
          count += 1;
        }

        if (Math.random () < 0.5) {
          objectInTracks[1].push(createRock(2, lastX));
          count += 1;
        }

        if (count === 0 || (Math.random () < 0.5 && count < 2)) {
          objectInTracks[2].push(createRock(3, lastX));
        }

        lastX += 120;
      }
  }

  setEquipment(KIM.rocket.equipment);

  Track.init(distance, SCALE);
  // Accelerator.init(MyRobot);

  setStatusBar(MyRobot);
}

var _reset = function () {
  objectInTracks = [[],[],[]];
  MyRobot = null;

  $("#game").find(".rocket, .rock").remove();
};

$upBtn.tap(function () {
  commandList.push("up");
});

$downBtn.tap(function () {
  commandList.push("down");
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
