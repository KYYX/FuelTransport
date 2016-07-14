var RollEntity = (function () {
  var sceneNode = document.querySelector('.scroll');

  var createRollNode = function () {
    var wrap  = document.createElement('div');
    var inner = document.createElement('div');

     wrap.className = "rocket-wrap";
    inner.className = "rocket";

    wrap.appendChild(inner);

    return wrap;
  };

  var setNodePosition = function (node, x, y) {
    node.style.transform = "translate(" + x + "px, " + y * 100 + "%)";
  }

  function _RollEntity (config) {
    this.maxSpeed    = config.maxSpeed;    //最大速度 px/s
    this.maxSpeedUp  = config.maxSpeedUp;  //最大加速度
    this.speedCut    = config.speedCut;    //匀减速
    this.maxSpeedCut = config.maxSpeedCut; //最大制动力

    this.currentSpeed   = 0; //当前速度
    this.currentSpeedUp = 0; //当前加速度

    this.translateX = config.x;
    this.translateY = config.y;

    this.tracks = config.tracks;

    var node = this.node = createRollNode();

    setNodePosition(node, this.translateX, this.translateY)

    sceneNode.appendChild(node);
  }

  _RollEntity.prototype.setDeepOfAccelerator = function (deepOfAccelerator) {
      if (deepOfAccelerator > 0) {
        this.controlledSpeed = this.maxSpeed * (deepOfAccelerator / 100);
        this.currentSpeedUp  = this.maxSpeedUp * (deepOfAccelerator / 100);
      } else if (deepOfAccelerator < 0) {
        this.currentSpeedUp = this.maxSpeedCut * (deepOfAccelerator / 100);
      } else {
        this.currentSpeedUp = 0 - this.speedCut;
      }
  };

  _RollEntity.prototype.setTranslateY = function (offset) {
    this.translateY += offset;

    if (this.translateY < 0) {
      this.translateY = 0;
    } else if (this.translateY > this.tracks - 1) {
      this.translateY = this.tracks - 1;
    } else {

    }

    setNodePosition(this.node, this.translateX, this.translateY);
  };

  // _RollEntity.prototype.getStatus = function () {
  //   return {
  //     speed: this.currentSpeed,
  //         x: this.translateX,
  //         y: this.translateY
  //   }
  // };

  _RollEntity.prototype.update = function () {
    //加速或趟车
    if (this.currentSpeedUp > 0) {
      if (this.currentSpeed < this.controlledSpeed) { //加速中
        this.currentSpeed += this.currentSpeedUp / 60;

        if (this.currentSpeed > this.controlledSpeed) {
          this.currentSpeed = this.controlledSpeed;
        }
      } else {
        this.currentSpeed -= this.speedCut / 60;
      }
    } else { //刹车
      this.currentSpeed += this.currentSpeedUp / 60;

      if (this.currentSpeed < 0) {
        this.currentSpeed = 0;
      }
    }

    // console.log('current speed:' + this.currentSpeed);


    this.translateX += this.currentSpeed / 60;

    setNodePosition(this.node, this.translateX, this.translateY);
  };

  return _RollEntity
})();
